const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['stock', 'mutual fund', 'bond', 'crypto', 'etf'],
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  buyPrice: {
    type: Number,
    required: true,
    min: 0
  },
  currentPrice: {
    type: Number,
    default: 0
  },
  totalCost: {
    type: Number,
    default: 0
  },
  currentValue: {
    type: Number,
    default: 0
  },
  gain: {
    type: Number,
    default: 0
  },
  gainPercentage: {
    type: Number,
    default: 0
  },
  purchaseDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Investment', investmentSchema);
