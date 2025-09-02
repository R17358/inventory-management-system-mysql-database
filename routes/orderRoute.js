const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/orderController');
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

// Protected endpoints
router.post('/sales', auth, orderCtrl.createSalesOrder); // user creates sales
router.post('/purchases', auth, orderCtrl.createPurchaseOrder); // user creates purchase request

// Admin approves/disapproves PO
router.post('/purchases/:id/approve', auth, requireRole('admin'), orderCtrl.approvePurchaseOrder);

router.get('/purchases', auth, orderCtrl.getAllPurchases);
router.get('/sales', auth, orderCtrl.getAllSales);
router.post('/refunds', auth, orderCtrl.refundItem);

module.exports = router;
