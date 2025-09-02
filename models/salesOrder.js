module.exports = (sequelize, DataTypes) => {
  return sequelize.define('SalesOrder', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false }, // who created sale (salesperson)
    customerName: { type: DataTypes.STRING, allowNull: true },
    totalAmount: { type: DataTypes.DECIMAL(12,2), defaultValue: 0.00 },
    status: { type: DataTypes.ENUM('completed','refunded'), defaultValue: 'completed' }
  }, { timestamps: true });
};
