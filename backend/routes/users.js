const router = require('express').Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

// PUT /api/users/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, address, password } = req.body;
    const user = await User.findById(req.user.id);
    if (name) user.name = name;
    if (address) user.address = address;
    if (password) user.password = password;
    await user.save();
    res.json({ id: user._id, name: user.name, email: user.email, address: user.address });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// GET /api/users — admin only
router.get('/', protect, adminOnly, async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

module.exports = router;
