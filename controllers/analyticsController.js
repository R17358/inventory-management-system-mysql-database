const { SalesOrder, SalesItem, User } = require('../models');
const { Op } = require('sequelize');

// Simple sales performance & retention endpoints

exports.salesPerformance = async (req, res) => {
  // query params: from=YYYY-MM-DD & to=YYYY-MM-DD
  try {
    let { from, to } = req.query;
    if (!from) from = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().slice(0,10);
    if (!to) to = new Date().toISOString().slice(0,10);

    const orders = await SalesOrder.findAll({
      where: {
        createdAt: { [Op.between]: [new Date(from + ' 00:00:00'), new Date(to + ' 23:59:59')] }
      }
    });

    const totalSales = orders.reduce((acc,o) => acc + Number(o.totalAmount), 0);
    const ordersCount = orders.length;
    // avg ticket
    const avgOrder = ordersCount ? (totalSales / ordersCount) : 0;

    res.json({ from, to, totalSales, ordersCount, avgOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.customerRetention = async (req, res) => {
  // approximate retention: customers who placed >1 order vs unique customers over period
  try {
    let { from, to } = req.query;
    if (!from) from = new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().slice(0,10);
    if (!to) to = new Date().toISOString().slice(0,10);

    const orders = await SalesOrder.findAll({
      where: {
        createdAt: { [Op.between]: [new Date(from + ' 00:00:00'), new Date(to + ' 23:59:59')] }
      },
      attributes: ['userId','id']
    });

    const userCountMap = {};
    for (const o of orders) {
      userCountMap[o.userId] = (userCountMap[o.userId] || 0) + 1;
    }
    const uniqueCustomers = Object.keys(userCountMap).length;
    const repeatCustomers = Object.values(userCountMap).filter(c => c > 1).length;
    const retentionRate = uniqueCustomers ? (repeatCustomers / uniqueCustomers) * 100 : 0;

    res.json({ from, to, uniqueCustomers, repeatCustomers, retentionRate: Number(retentionRate.toFixed(2)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
