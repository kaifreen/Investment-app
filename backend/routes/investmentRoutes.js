const express = require('express');
const {
  createInvestment,
  getInvestments,
  getInvestment,
  updateInvestment,
  deleteInvestment,
  sellInvestment
} = require('../controllers/investmentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/', createInvestment);
router.get('/', getInvestments);
router.get('/:id', getInvestment);
router.post('/:id/sell', sellInvestment);
router.put('/:id', updateInvestment);
router.delete('/:id', deleteInvestment);

module.exports = router;
