module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Refund', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    salesItemId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    quantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    amount: { type: DataTypes.DECIMAL(12,2), allowNull: false }
  }, { timestamps: true });
};
