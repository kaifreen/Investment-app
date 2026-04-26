const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register User
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create new user
    const user = new User({ name, email, password });
    await user.save();
    
    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid password' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get User Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update User Profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.name = name || user.name;
    user.phone = phone !== undefined ? phone : user.phone;
    user.address = address !== undefined ? address : user.address;
    user.updatedAt = Date.now();
    
    await user.save();
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login, getProfile, updateProfile };
