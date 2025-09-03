const rateLimit = require('express-rate-limit');
const { body, param, query, validationResult } = require('express-validator');

// Rate limiting för att förhindra spam och DoS-attacker - MINSKAD för utveckling
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: message,
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: message,
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
  });
};

// Allmän rate limit - MINSKAD för utveckling
const generalRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minuter
  1000, // max 1000 requests per IP (höjd för utveckling)
  'För många förfrågningar från denna IP, försök igen senare'
);

// Striktare rate limit för väder-API - MINSKAD för utveckling
const weatherRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minuter
  100, // max 100 väderförfrågningar per IP (höjd för utveckling)
  'För många väderförfrågningar, försök igen senare'
);

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Sanitize string inputs
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .substring(0, 100); // Limit length
  };

  // Sanitize req.body
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeString(req.body[key]);
      }
    });
  }

  // Sanitize req.params
  if (req.params) {
    Object.keys(req.params).forEach(key => {
      if (typeof req.params[key] === 'string') {
        req.params[key] = sanitizeString(req.params[key]);
      }
    });
  }

  // Sanitize req.query
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeString(req.query[key]);
      }
    });
  }

  next();
};

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Ogiltig input',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// City name validation
const validateCityName = [
  param('city')
    .isLength({ min: 1, max: 50 })
    .withMessage('Stadsnamn måste vara mellan 1-50 tecken')
    .matches(/^[a-zA-ZåäöÅÄÖ\s\-']+$/)
    .withMessage('Stadsnamn får endast innehålla bokstäver, mellanslag, bindestreck och apostrofer')
    .customSanitizer(value => value.trim()),
  handleValidationErrors
];

// Coordinates validation
const validateCoordinates = [
  query('lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitud måste vara mellan -90 och 90'),
  query('lon')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitud måste vara mellan -180 och 180'),
  handleValidationErrors
];

// Security headers middleware
const securityHeaders = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Strict Transport Security (för HTTPS)
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self'"
  );
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  next();
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Security Error:', err);
  
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'Ogiltig JSON-data'
    });
  }
  
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'Förfrågan är för stor'
    });
  }
  
  // Default error response
  res.status(500).json({
    error: isDevelopment ? err.message : 'Ett fel uppstod på servern'
  });
};

module.exports = {
  generalRateLimit,
  weatherRateLimit,
  sanitizeInput,
  validateCityName,
  validateCoordinates,
  securityHeaders,
  errorHandler
};
