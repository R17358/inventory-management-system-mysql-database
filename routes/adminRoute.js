const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

const {
  createUserByAdmin,
  getAllUsers,
  updateUser,
  suspendUser,
  deleteUser
} = require('../controllers/adminController');

// All admin-only
router.use(auth, requireRole('admin'));

router.post('/users', createUserByAdmin);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.patch('/users/:id/suspend', suspendUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
