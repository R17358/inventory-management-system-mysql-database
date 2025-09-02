module.exports = (sequelize, DataTypes) => {
  return sequelize.define('PurchaseOrder', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false }, // who requested
    vendor: { type: DataTypes.STRING, allowNull: true },
    totalAmount: { type: DataTypes.DECIMAL(12,2), defaultValue: 0.00 },
    status: { type: DataTypes.ENUM('pending','approved','disapproved'), defaultValue: 'pending' }
  }, { timestamps: true });
};
