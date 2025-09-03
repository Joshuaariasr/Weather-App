const express = require('express');
const router = express.Router();

// Import route handlers
const weatherRoutes = require('./weather');

// Use routes
router.use('/weather', weatherRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ message: 'API är igång!', timestamp: new Date().toISOString() });
});

module.exports = router;
