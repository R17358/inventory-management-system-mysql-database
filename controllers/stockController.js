const { Stock, Product } = require('../models');

exports.getAllStock = async (req, res) => {
  try {
    const stocks = await Stock.findAll({ include: [{ model: Product }] });
    res.json({ stocks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
