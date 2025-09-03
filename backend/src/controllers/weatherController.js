const axios = require('axios');

const WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'your_api_key_here';
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

const weatherController = {
  async getCurrentWeather(req, res) {
    try {
      const { city } = req.params;
      const response = await axios.get(`${WEATHER_BASE_URL}/weather`, {
        params: {
          q: city,
          appid: WEATHER_API_KEY,
          units: 'metric',
          lang: 'sv'
        }
      });
      
      res.json(response.data);
    } catch (error) {
      console.error('Weather API Error:', error.message);
      res.status(500).json({ 
        message: `Kunde inte hämta väderdata för ${req.params.city}`,
        error: error.message 
      });
    }
  },

  async getForecast(req, res) {
    try {
      const { city } = req.params;
      const response = await axios.get(`${WEATHER_BASE_URL}/forecast`, {
        params: {
          q: city,
          appid: WEATHER_API_KEY,
          units: 'metric',
          lang: 'sv'
        }
      });
      
      res.json(response.data);
    } catch (error) {
      console.error('Forecast API Error:', error.message);
      res.status(500).json({ 
        message: `Kunde inte hämta prognos för ${req.params.city}`,
        error: error.message 
      });
    }
  },

  async getWeatherByCoordinates(req, res) {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ 
          message: 'Latitud och longitud krävs' 
        });
      }

      const response = await axios.get(`${WEATHER_BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: WEATHER_API_KEY,
          units: 'metric',
          lang: 'sv'
        }
      });
      
      res.json(response.data);
    } catch (error) {
      console.error('Coordinates Weather API Error:', error.message);
      res.status(500).json({ 
        message: 'Kunde inte hämta väderdata för koordinaterna',
        error: error.message 
      });
    }
  }
};

module.exports = weatherController;
