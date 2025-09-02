const { requireRole } = require('../middleware/role');

const express = require('express');
const router = express.Router();
const stockCtrl = require('../controllers/stockController');
const analytics = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

router.get('/stock', auth, stockCtrl.getAllStock);

// analytics (admin only)
router.get('/analytics/sales', auth, requireRole('admin'), analytics.salesPerformance);
router.get('/analytics/retention', auth, requireRole('admin'), analytics.customerRetention);

module.exports = router;
