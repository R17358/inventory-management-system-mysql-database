const { Product, Stock, PurchaseOrder, PurchaseItem, SalesOrder, SalesItem, Refund } = require('../models');
const sequelize = require('../config/db');

exports.createSalesOrder = async (req, res) => {
  // body: { customerName, items: [{ productId, quantity }] }
  const t = await sequelize.transaction();
  try {
    const { customerName, items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'No items' });

    let total = 0;
    const newOrder = await SalesOrder.create({ userId: req.user.id, customerName }, { transaction: t });
    for (const it of items) {
      const product = await Product.findByPk(it.productId, { transaction: t });
      if (!product) { await t.rollback(); return res.status(404).json({ message: 'Product not found: ' + it.productId }); }

      const stock = await Stock.findOne({ where: { productId: product.id }, transaction: t });
      if (!stock || stock.quantity < it.quantity) { await t.rollback(); return res.status(400).json({ message: `Insufficient stock for ${product.name}` }); }

      const lineTotal = Number(product.price) * Number(it.quantity);
      total += lineTotal;

      await SalesItem.create({
        salesOrderId: newOrder.id,
        productId: product.id,
        unitPrice: product.price,
        quantity: it.quantity,
        total: lineTotal
      }, { transaction: t });

      // deduct stock
      stock.quantity = stock.quantity - it.quantity;
      await stock.save({ transaction: t });
    }

    newOrder.totalAmount = total;
    await newOrder.save({ transaction: t });
    await t.commit();
    res.status(201).json({ message: 'Sales order created', orderId: newOrder.id });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: err.message });
  }
};

exports.createPurchaseOrder = async (req, res) => {
  // body: { vendor, items: [{ productId, quantity, unitPrice }] }
  const t = await sequelize.transaction();
  try {
    const { vendor, items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'No items' });

    let total = 0;
    const po = await PurchaseOrder.create({ userId: req.user.id, vendor }, { transaction: t });

    for (const it of items) {
      const product = await Product.findByPk(it.productId, { transaction: t });
      if (!product) {
        // create product if not exists? For simplicity require product exists.
        await t.rollback();
        return res.status(404).json({ message: 'Product not found: ' + it.productId });
      }
      const lineTotal = Number(it.unitPrice) * Number(it.quantity);
      total += lineTotal;

      await PurchaseItem.create({
        purchaseOrderId: po.id,
        productId: product.id,
        unitPrice: it.unitPrice,
        quantity: it.quantity,
        total: lineTotal
      }, { transaction: t });
    }

    po.totalAmount = total;
    await po.save({ transaction: t });
    await t.commit();
    res.status(201).json({ message: 'Purchase order created', purchaseOrderId: po.id });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: err.message });
  }
};

exports.approvePurchaseOrder = async (req, res) => {
  // admin endpoint to approve/disapprove
  const t = await sequelize.transaction();
  try {
    const { id } = req.params; // purchaseOrder id
    const { approve } = req.body; // boolean
    const po = await PurchaseOrder.findByPk(id, { include: [PurchaseItem], transaction: t });
    if (!po) { await t.rollback(); return res.status(404).json({ message: 'PO not found' }); }

    po.status = approve ? 'approved' : 'disapproved';
    await po.save({ transaction: t });

    if (approve) {
      // when approved, add items to stock
      const items = await PurchaseItem.findAll({ where: { purchaseOrderId: po.id }, transaction: t });
      for (const it of items) {
        let stock = await Stock.findOne({ where: { productId: it.productId }, transaction: t });
        if (!stock) {
          stock = await Stock.create({ productId: it.productId, quantity: it.quantity }, { transaction: t });
        } else {
          stock.quantity = stock.quantity + it.quantity;
          await stock.save({ transaction: t });
        }
      }
    }

    await t.commit();
    res.json({ message: `Purchase order ${approve ? 'approved' : 'disapproved'}` });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: err.message });
  }
};

exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await PurchaseOrder.findAll({ include: [{ model: PurchaseItem }] });
    res.json({ purchases });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllSales = async (req, res) => {
  try {
    const sales = await SalesOrder.findAll({ include: [{ model: SalesItem }] });
    res.json({ sales });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.refundItem = async (req, res) => {
  // body: { salesItemId, quantity }
  const t = await sequelize.transaction();
  try {
    const { salesItemId, quantity } = req.body;
    const sItem = await SalesItem.findByPk(salesItemId, { transaction: t });
    if (!sItem) { await t.rollback(); return res.status(404).json({ message: 'Sales item not found' }); }
    if (quantity > sItem.quantity) { await t.rollback(); return res.status(400).json({ message: 'Refund quantity exceeds sold quantity' }); }

    const amount = Number(sItem.unitPrice) * Number(quantity);
    const refund = await Refund.create({ salesItemId, quantity, amount }, { transaction: t });

    // update stock back
    let stock = await Stock.findOne({ where: { productId: sItem.productId }, transaction: t });
    if (!stock) stock = await Stock.create({ productId: sItem.productId, quantity: quantity }, { transaction: t });
    else { stock.quantity += quantity; await stock.save({ transaction: t }); }

    // update sales item quantity and parent order total
    sItem.quantity -= quantity;
    sItem.total = Number(sItem.unitPrice) * Number(sItem.quantity);
    await sItem.save({ transaction: t });

    const parentOrder = await SalesOrder.findByPk(sItem.salesOrderId, { transaction: t });
    // recompute order total
    const orderItems = await SalesItem.findAll({ where: { salesOrderId: parentOrder.id }, transaction: t });
    parentOrder.totalAmount = orderItems.reduce((acc, it) => acc + Number(it.total), 0);
    if (parentOrder.totalAmount === 0) parentOrder.status = 'refunded';
    await parentOrder.save({ transaction: t });

    await t.commit();
    res.json({ message: 'Refund processed', refund });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: err.message });
  }
};
