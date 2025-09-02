const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const { sequelize, Product, Stock } = require('./models');

const authRoutes = require('./routes/authRoute');
const adminRoutes = require('./routes/adminRoute');
const orderRoutes = require('./routes/orderRoute');
const stockRoutes = require('./routes/stockRoute');

const app = express();
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', stockRoutes);

// health
app.get('/', (req, res) => res.json({ message: 'IMS API running' }));

// sync DB and start
const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected');
    // For development you can use { force: true } to recreate tables — careful with data
    await sequelize.sync(); // sync models
    console.log('Models synced');

    // optional: create a seed product for quick testing if none exists
    const p = await Product.findOne();
    if (!p) {
      const prod = await Product.create({ sku: 'SKU-001', name: 'Sample Product', price: 100.0, description: 'Seed product' });
      await Stock.create({ productId: prod.id, quantity: 100 });
      console.log('Seed product & stock created');
    }

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start', err);
  }
})();
