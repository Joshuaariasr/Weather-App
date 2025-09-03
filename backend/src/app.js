const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { 
  generalRateLimit, 
  weatherRateLimit, 
  sanitizeInput, 
  securityHeaders, 
  errorHandler 
} = require('./middleware/security');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5002;

// Security middleware (måste komma först)
app.use(securityHeaders);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  }
}));

// Rate limiting
app.use(generalRateLimit);

// CORS configuration - FIXED
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] // Ersätt med din produktionsdomän
    : ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset']
}));

// Logging
app.use(morgan('combined'));

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization
app.use(sanitizeInput);

// Routes with specific rate limiting
app.use('/api', require('./routes'));

// Error handling middleware (måste komma sist)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route inte hittad',
    message: 'Den begärda resursen finns inte'
  });
});

app.listen(PORT, () => {
  console.log(`Server körs på port ${PORT}`);
  console.log(`Säkerhetsläge: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS aktiverat för: http://localhost:3000`);
});

module.exports = app;
