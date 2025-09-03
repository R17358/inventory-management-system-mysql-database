const express = require('express');
const router = express.Router();
const {
    adminSignup,
    signIn
} = require('../controllers/authController');
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/role');

// Admin sign up (first admin)
router.post('/admin/signup', adminSignup);

// Sign in (all users)
router.post('/signin', signIn);

module.exports = router;
