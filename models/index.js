const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const User = require('./user')(sequelize, DataTypes);
const Product = require('./product')(sequelize, DataTypes);
const Stock = require('./stock')(sequelize, DataTypes);
const PurchaseOrder = require('./purchaseOrder')(sequelize, DataTypes);
const PurchaseItem = require('./purchaseItem')(sequelize, DataTypes);
const SalesOrder = require('./salesOrder')(sequelize, DataTypes);
const SalesItem = require('./salesItem')(sequelize, DataTypes);
const Refund = require('./refund')(sequelize, DataTypes);

// Associations

// User <-> SalesOrder
User.hasMany(SalesOrder, { foreignKey: 'userId' });
SalesOrder.belongsTo(User, { foreignKey: 'userId' });

// User <-> PurchaseOrder (created by user)
User.hasMany(PurchaseOrder, { foreignKey: 'userId' });
PurchaseOrder.belongsTo(User, { foreignKey: 'userId' });

// PurchaseOrder <-> PurchaseItem
PurchaseOrder.hasMany(PurchaseItem, { foreignKey: 'purchaseOrderId' });
PurchaseItem.belongsTo(PurchaseOrder, { foreignKey: 'purchaseOrderId' });

// SalesOrder <-> SalesItem
SalesOrder.hasMany(SalesItem, { foreignKey: 'salesOrderId' });
SalesItem.belongsTo(SalesOrder, { foreignKey: 'salesOrderId' });

// Product <-> PurchaseItem, SalesItem, Stock
Product.hasMany(PurchaseItem, { foreignKey: 'productId' });
PurchaseItem.belongsTo(Product, { foreignKey: 'productId' });

Product.hasMany(SalesItem, { foreignKey: 'productId' });
SalesItem.belongsTo(Product, { foreignKey: 'productId' });

Product.hasOne(Stock, { foreignKey: 'productId' });
Stock.belongsTo(Product, { foreignKey: 'productId' });

// Refunds link to SalesItem (optional)
SalesItem.hasMany(Refund, { foreignKey: 'salesItemId' });
Refund.belongsTo(SalesItem, { foreignKey: 'salesItemId' });

module.exports = {
  sequelize,
  User,
  Product,
  Stock,
  PurchaseOrder,
  PurchaseItem,
  SalesOrder,
  SalesItem,
  Refund
};
