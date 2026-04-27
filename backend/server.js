const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Debug middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path} - Auth: ${req.headers.authorization ? 'Yes' : 'No'}`);
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully');
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Routes
console.log('⏳ Loading routes...');
app.use('/api/auth', require('./routes/authRoutes'));
console.log('✓ Auth routes loaded');
app.use('/api/investments', require('./routes/investmentRoutes'));
console.log('✓ Investment routes loaded');
app.use('/api/portfolios', require('./routes/portfolioRoutes'));
console.log('✓ Portfolio routes loaded');
app.use('/api/market', require('./routes/marketDataRoutes'));
console.log('✓ Market data routes loaded');
app.use('/api/alerts', require('./routes/alertRoutes'));
console.log('✓ Alert routes loaded');
app.use('/api/chat', require('./routes/chatRoutes'));
console.log('✓ Chat routes loaded');

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Start background workers
require('./services/alertService').startCron();

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Investment App Backend Server running on http://localhost:${PORT}`);
  console.log(`✓ MongoDB connected to: ${process.env.MONGODB_URI}`);
});

module.exports = app;
