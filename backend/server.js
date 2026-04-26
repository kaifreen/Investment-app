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
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/investments', require('./routes/investmentRoutes'));
app.use('/api/portfolios', require('./routes/portfolioRoutes'));
app.use('/api/market', require('./routes/marketDataRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));

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
