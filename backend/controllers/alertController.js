const Alert = require('../models/Alert');

const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ userId: req.userId }).sort('-createdAt');
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createAlert = async (req, res) => {
  try {
    const { symbol, targetPrice, condition } = req.body;
    const alert = new Alert({
      userId: req.userId,
      symbol: symbol.toUpperCase(),
      targetPrice,
      condition
    });
    await alert.save();
    res.status(201).json(alert);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteAlert = async (req, res) => {
  try {
    await Alert.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Alert deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAlerts, createAlert, deleteAlert };
