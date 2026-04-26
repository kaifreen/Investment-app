const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  investments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investment'
  }],
  totalValue: {
    type: Number,
    default: 0
  },
  totalGain: {
    type: Number,
    default: 0
  },
  totalGainPercentage: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
