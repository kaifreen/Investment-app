const Portfolio = require('../models/Portfolio');
const Investment = require('../models/Investment');

// Create Portfolio
const createPortfolio = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const portfolio = new Portfolio({
      userId: req.userId,
      name,
      description
    });
    
    await portfolio.save();
    res.status(201).json({ message: 'Portfolio created', portfolio });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Helper to automatically recalculate totals
const calculateTotals = (portfolio) => {
  let totalCost = 0;
  let totalValue = 0;
  
  if (portfolio.investments && portfolio.investments.length > 0) {
    portfolio.investments.forEach(inv => {
      totalCost += (inv.totalCost || 0);
      totalValue += (inv.currentValue || 0);
    });
  }
  
  portfolio.totalValue = totalValue;
  portfolio.totalGain = totalValue - totalCost;
  portfolio.totalGainPercentage = totalCost > 0 ? (portfolio.totalGain / totalCost) * 100 : 0;
  
  return portfolio;
};

// Get All Portfolios
const getPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ userId: req.userId }).populate('investments');
    portfolios.forEach(calculateTotals);
    res.json(portfolios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single Portfolio
const getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ _id: req.params.id, userId: req.userId })
      .populate('investments');
    
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    calculateTotals(portfolio);
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add Investment to Portfolio
const addInvestmentToPortfolio = async (req, res) => {
  try {
    const { investmentId } = req.body;
    const portfolio = await Portfolio.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    // Check if investment exists
    const investment = await Investment.findOne({ _id: investmentId, userId: req.userId });
    if (!investment) {
      return res.status(404).json({ error: 'Investment not found' });
    }
    
    // Add investment if not already there
    if (!portfolio.investments.includes(investmentId)) {
      portfolio.investments.push(investmentId);
      await portfolio.save();
    }
    
    // Auto-calculate the final totals before returning (need to populate it first)
    const populated = await portfolio.populate('investments');
    calculateTotals(populated);
    
    res.json({ message: 'Investment added to portfolio', portfolio: populated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Portfolio
const updatePortfolio = async (req, res) => {
  try {
    const { name, description } = req.body;
    const portfolio = await Portfolio.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    portfolio.name = name || portfolio.name;
    portfolio.description = description || portfolio.description;
    portfolio.updatedAt = Date.now();
    
    await portfolio.save();
    res.json({ message: 'Portfolio updated', portfolio });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Portfolio
const deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    res.json({ message: 'Portfolio deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove Investment from Portfolio
const removeInvestmentFromPortfolio = async (req, res) => {
  try {
    const { investmentId } = req.params;
    const portfolio = await Portfolio.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    // Remove investment if it's there
    const index = portfolio.investments.indexOf(investmentId);
    if (index > -1) {
      portfolio.investments.splice(index, 1);
      await portfolio.save();
    }
    
    // Auto-calculate the final totals before returning (need to populate it first)
    const populated = await portfolio.populate('investments');
    calculateTotals(populated);
    
    res.json({ message: 'Investment removed from portfolio', portfolio: populated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Portfolio Analytics
const getPortfolioAnalytics = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ _id: req.params.id, userId: req.userId })
      .populate('investments');
      
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    calculateTotals(portfolio);
    
    const allocation = {};
    if (portfolio.investments && portfolio.investments.length > 0) {
      portfolio.investments.forEach(inv => {
        const type = inv.type || 'unknown';
        if (!allocation[type]) {
          allocation[type] = { totalValue: 0, percentage: 0 };
        }
        allocation[type].totalValue += (inv.currentValue || 0);
      });
      
      // Calculate percentages
      const totalPortfolioValue = portfolio.totalValue;
      Object.keys(allocation).forEach(type => {
        allocation[type].percentage = totalPortfolioValue > 0 
          ? (allocation[type].totalValue / totalPortfolioValue) * 100 
          : 0;
      });
    }
    
    res.json({
      portfolioId: portfolio._id,
      totalValue: portfolio.totalValue,
      allocation
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createPortfolio,
  getPortfolios,
  getPortfolio,
  addInvestmentToPortfolio,
  updatePortfolio,
  deletePortfolio,
  removeInvestmentFromPortfolio,
  getPortfolioAnalytics
};
