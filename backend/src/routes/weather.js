const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

// GET /api/weather/current/:city
router.get('/current/:city', weatherController.getCurrentWeather);

// GET /api/weather/forecast/:city
router.get('/forecast/:city', weatherController.getForecast);

// GET /api/weather/coordinates
router.get('/coordinates', weatherController.getWeatherByCoordinates);

module.exports = router;
