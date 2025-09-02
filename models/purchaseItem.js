module.exports = (sequelize, DataTypes) => {
  return sequelize.define('PurchaseItem', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    purchaseOrderId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    productId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    unitPrice: { type: DataTypes.DECIMAL(12,2), allowNull: false },
    quantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    total: { type: DataTypes.DECIMAL(12,2), allowNull: false }
  }, { timestamps: true });
};
