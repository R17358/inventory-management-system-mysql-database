const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const SALT_ROUNDS = 10;

exports.adminSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ where: { email }});
    if (exists) return res.status(400).json({ message: 'Email already used' });

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const admin = await User.create({ name, email, password: hash, role: 'admin' });
    return res.status(201).json({ message: 'Admin created', admin: { id: admin.id, email: admin.email }});
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email }});
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name }});
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
