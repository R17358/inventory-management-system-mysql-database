const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController');
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

// All admin-only
router.use(auth, requireRole('admin'));

router.post('/users', adminCtrl.createUserByAdmin);
router.get('/users', adminCtrl.getAllUsers);
router.put('/users/:id', adminCtrl.updateUser);
router.patch('/users/:id/suspend', adminCtrl.suspendUser);
router.delete('/users/:id', adminCtrl.deleteUser);

module.exports = router;
