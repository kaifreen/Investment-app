const Investment = require('../models/Investment');

// Create Investment
const createInvestment = async (req, res) => {
  try {
    const { symbol, name, type, quantity, buyPrice, currentPrice, purchaseDate } = req.body;
    
    const totalCost = quantity * buyPrice;
    const currentValue = quantity * (currentPrice || buyPrice);
    const gain = currentValue - totalCost;
    const gainPercentage = (gain / totalCost) * 100;
    
    const investment = new Investment({
      userId: req.userId,
      symbol,
      name,
      type,
      quantity,
      buyPrice,
      currentPrice: currentPrice || buyPrice,
      totalCost,
      currentValue,
      gain,
      gainPercentage,
      purchaseDate
    });
    
    await investment.save();
    res.status(201).json({ message: 'Investment created', investment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Investments
const getInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ userId: req.userId });
    res.json(investments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single Investment
const getInvestment = async (req, res) => {
  try {
    const investment = await Investment.findOne({ _id: req.params.id, userId: req.userId });
    if (!investment) {
      return res.status(404).json({ error: 'Investment not found' });
    }
    res.json(investment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Investment
const updateInvestment = async (req, res) => {
  try {
    const { currentPrice } = req.body;
    const investment = await Investment.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!investment) {
      return res.status(404).json({ error: 'Investment not found' });
    }
    
    investment.currentPrice = currentPrice || investment.currentPrice;
    investment.currentValue = investment.quantity * investment.currentPrice;
    investment.gain = investment.currentValue - investment.totalCost;
    investment.gainPercentage = (investment.gain / investment.totalCost) * 100;
    
    await investment.save();
    res.json({ message: 'Investment updated', investment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Investment
const deleteInvestment = async (req, res) => {
  try {
    const investment = await Investment.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!investment) {
      return res.status(404).json({ error: 'Investment not found' });
    }
    res.json({ message: 'Investment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Sell / Partially Sell Investment
const sellInvestment = async (req, res) => {
  try {
    const { quantityToSell, sellPrice } = req.body;
    const investment = await Investment.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!investment) {
      return res.status(404).json({ error: 'Investment not found' });
    }
    
    if (!quantityToSell || quantityToSell <= 0) {
      return res.status(400).json({ error: 'Quantity to sell must be strictly positive' });
    }
    
    if (quantityToSell > investment.quantity) {
      return res.status(400).json({ error: 'Cannot sell more than you own' });
    }
    
    // Calculate realized gain for this sale
    const sellValue = quantityToSell * (sellPrice || investment.currentPrice);
    const originalCostForSoldPortion = quantityToSell * investment.buyPrice;
    const realizedGain = sellValue - originalCostForSoldPortion;
    
    // Update the investment document
    investment.quantity -= quantityToSell;
    
    if (investment.quantity === 0) {
      investment.totalCost = 0;
      investment.currentValue = 0;
      investment.gain = 0;
      investment.gainPercentage = 0;
    } else {
      investment.totalCost = investment.quantity * investment.buyPrice;
      investment.currentValue = investment.quantity * investment.currentPrice;
      investment.gain = investment.currentValue - investment.totalCost;
      investment.gainPercentage = (investment.gain / investment.totalCost) * 100;
    }
    
    await investment.save();
    
    res.json({
      message: 'Investment sold successfully',
      realizedGain,
      sellValue,
      investment
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createInvestment,
  getInvestments,
  getInvestment,
  updateInvestment,
  deleteInvestment,
  sellInvestment
};
