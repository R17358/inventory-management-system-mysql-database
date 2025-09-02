const bcrypt = require('bcrypt');
const { User } = require('../models');

exports.createUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password || !name) return res.status(400).json({ message: 'Missing fields' });
    const exists = await User.findOne({ where: { email }});
    if (exists) return res.status(400).json({ message: 'Email taken' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: role === 'admin' ? 'admin' : 'user' });
    res.status(201).json({ message: 'User created', user: { id: user.id, email: user.email }});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.password) updates.password = await bcrypt.hash(updates.password, 10);
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Not found' });

    await user.update(updates);
    res.json({ message: 'Updated', user: { id: user.id, email: user.email, name: user.name, suspended: user.suspended }});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.suspendUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { suspended } = req.body; // boolean
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Not found' });
    await user.update({ suspended: !!suspended });
    res.json({ message: 'User suspension updated', suspended: user.suspended });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Not found' });
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id','name','email','role','suspended','createdAt'] });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
