const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const { 
  weatherRateLimit, 
  validateCityName, 
  validateCoordinates 
} = require('../middleware/security');

// Apply rate limiting to all weather routes
router.use(weatherRateLimit);

// GET /api/weather/current/:city
router.get('/current/:city', validateCityName, weatherController.getCurrentWeather);

// GET /api/weather/forecast/:city
router.get('/forecast/:city', validateCityName, weatherController.getForecast);

// GET /api/weather/coordinates
router.get('/coordinates', validateCoordinates, weatherController.getWeatherByCoordinates);

// GET /api/weather/cities - Ny endpoint för att hämta alla tillgängliga städer
router.get('/cities', weatherController.getAvailableCities);

module.exports = router;
