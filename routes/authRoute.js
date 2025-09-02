const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

// Admin sign up (first admin)
router.post('/admin/signup', authCtrl.adminSignup);

// Sign in (all users)
router.post('/signin', authCtrl.signIn);

module.exports = router;
