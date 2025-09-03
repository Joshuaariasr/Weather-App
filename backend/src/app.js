const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', require('./routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Något gick fel!' });
});

// 404 handler - fixed the route pattern
app.use((req, res) => {
  res.status(404).json({ message: 'Route inte hittad' });
});

app.listen(PORT, () => {
  console.log(`Server körs på port ${PORT}`);
});

module.exports = app;
