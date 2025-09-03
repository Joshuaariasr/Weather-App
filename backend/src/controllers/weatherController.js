const axios = require('axios');

const WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'demo_key_for_testing';
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Mock data för demo
const mockWeatherData = {
  'Stockholm': {
    coord: { lon: 18.0649, lat: 59.3326 },
    weather: [{ id: 800, main: 'Clear', description: 'klar himmel', icon: '01d' }],
    base: 'stations',
    main: {
      temp: 15,
      feels_like: 14,
      temp_min: 12,
      temp_max: 18,
      pressure: 1013,
      humidity: 65
    },
    visibility: 10000,
    wind: { speed: 3.5, deg: 230 },
    clouds: { all: 0 },
    dt: Math.floor(Date.now() / 1000),
    sys: {
      type: 1,
      id: 1788,
      country: 'SE',
      sunrise: Math.floor(Date.now() / 1000) - 3600,
      sunset: Math.floor(Date.now() / 1000) + 3600
    },
    timezone: 7200,
    id: 2673730,
    name: 'Stockholm',
    cod: 200
  },
  'Göteborg': {
    coord: { lon: 11.9746, lat: 57.7089 },
    weather: [{ id: 801, main: 'Clouds', description: 'några moln', icon: '02d' }],
    base: 'stations',
    main: {
      temp: 13,
      feels_like: 12,
      temp_min: 10,
      temp_max: 16,
      pressure: 1015,
      humidity: 70
    },
    visibility: 10000,
    wind: { speed: 4.2, deg: 250 },
    clouds: { all: 20 },
    dt: Math.floor(Date.now() / 1000),
    sys: {
      type: 1,
      id: 1788,
      country: 'SE',
      sunrise: Math.floor(Date.now() / 1000) - 3600,
      sunset: Math.floor(Date.now() / 1000) + 3600
    },
    timezone: 7200,
    id: 2711537,
    name: 'Göteborg',
    cod: 200
  },
  'Malmö': {
    coord: { lon: 13.0007, lat: 55.6059 },
    weather: [{ id: 500, main: 'Rain', description: 'lätt regn', icon: '10d' }],
    base: 'stations',
    main: {
      temp: 11,
      feels_like: 10,
      temp_min: 9,
      temp_max: 14,
      pressure: 1010,
      humidity: 85
    },
    visibility: 8000,
    wind: { speed: 5.1, deg: 180 },
    clouds: { all: 75 },
    dt: Math.floor(Date.now() / 1000),
    sys: {
      type: 1,
      id: 1788,
      country: 'SE',
      sunrise: Math.floor(Date.now() / 1000) - 3600,
      sunset: Math.floor(Date.now() / 1000) + 3600
    },
    timezone: 7200,
    id: 2692969,
    name: 'Malmö',
    cod: 200
  }
};

const mockForecastData = {
  'Stockholm': {
    list: Array.from({ length: 5 }, (_, i) => ({
      dt: Math.floor(Date.now() / 1000) + (i * 86400),
      main: {
        temp: 15 + Math.random() * 5,
        temp_min: 12 + Math.random() * 3,
        temp_max: 18 + Math.random() * 4,
        pressure: 1013,
        humidity: 65
      },
      weather: [{ id: 800, main: 'Clear', description: 'klar himmel', icon: '01d' }],
      clouds: { all: 0 },
      wind: { speed: 3.5, deg: 230 },
      visibility: 10000,
      pop: 0.1,
      sys: { pod: 'd' },
      dt_txt: new Date(Date.now() + (i * 86400 * 1000)).toISOString()
    }))
  }
};

const weatherController = {
  async getCurrentWeather(req, res) {
    try {
      const { city } = req.params;
      
      // Använd mock data om API-nyckeln är demo
      if (WEATHER_API_KEY === 'demo_key_for_testing') {
        const mockData = mockWeatherData[city] || mockWeatherData['Stockholm'];
        return res.json(mockData);
      }

      // Annars använd riktig API
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
      
      // Fallback till mock data vid fel
      const mockData = mockWeatherData[req.params.city] || mockWeatherData['Stockholm'];
      res.json(mockData);
    }
  },

  async getForecast(req, res) {
    try {
      const { city } = req.params;
      
      // Använd mock data om API-nyckeln är demo
      if (WEATHER_API_KEY === 'demo_key_for_testing') {
        const mockData = mockForecastData[city] || mockForecastData['Stockholm'];
        return res.json(mockData.list);
      }

      // Annars använd riktig API
      const response = await axios.get(`${WEATHER_BASE_URL}/forecast`, {
        params: {
          q: city,
          appid: WEATHER_API_KEY,
          units: 'metric',
          lang: 'sv'
        }
      });
      
      res.json(response.data.list);
    } catch (error) {
      console.error('Forecast API Error:', error.message);
      
      // Fallback till mock data vid fel
      const mockData = mockForecastData[req.params.city] || mockForecastData['Stockholm'];
      res.json(mockData.list);
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

      // Använd mock data om API-nyckeln är demo
      if (WEATHER_API_KEY === 'demo_key_for_testing') {
        return res.json(mockWeatherData['Stockholm']);
      }

      // Annars använd riktig API
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
      
      // Fallback till mock data vid fel
      res.json(mockWeatherData['Stockholm']);
    }
  }
};

module.exports = weatherController;
