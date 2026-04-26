const express = require('express');
const {
  createPortfolio,
  getPortfolios,
  getPortfolio,
  addInvestmentToPortfolio,
  updatePortfolio,
  deletePortfolio,
  removeInvestmentFromPortfolio,
  getPortfolioAnalytics
} = require('../controllers/portfolioController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/', createPortfolio);
router.get('/', getPortfolios);
router.get('/:id', getPortfolio);
router.get('/:id/analytics', getPortfolioAnalytics);
router.post('/:id/add-investment', addInvestmentToPortfolio);
router.delete('/:id/remove-investment/:investmentId', removeInvestmentFromPortfolio);
router.put('/:id', updatePortfolio);
router.delete('/:id', deletePortfolio);

module.exports = router;
