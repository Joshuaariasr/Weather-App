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

// Säker funktion för att validera stadnamn
const validateCityInput = (city) => {
  if (!city || typeof city !== 'string') {
    throw new Error('Ogiltigt stadsnamn');
  }
  
  const cleanCity = city.trim();
  if (cleanCity.length === 0 || cleanCity.length > 50) {
    throw new Error('Stadsnamn måste vara mellan 1-50 tecken');
  }
  
  // Kontrollera att det bara innehåller tillåtna tecken
  if (!/^[a-zA-ZåäöÅÄÖ\s\-']+$/.test(cleanCity)) {
    throw new Error('Stadsnamn får endast innehålla bokstäver, mellanslag, bindestreck och apostrofer');
  }
  
  return cleanCity;
};

// Säker funktion för att validera koordinater
const validateCoordinates = (lat, lon) => {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  
  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error('Ogiltiga koordinater');
  }
  
  if (latitude < -90 || latitude > 90) {
    throw new Error('Latitud måste vara mellan -90 och 90');
  }
  
  if (longitude < -180 || longitude > 180) {
    throw new Error('Longitud måste vara mellan -180 och 180');
  }
  
  return { lat: latitude, lon: longitude };
};

const weatherController = {
  async getCurrentWeather(req, res) {
    try {
      const city = validateCityInput(req.params.city);
      
      // Logga säkert (utan känslig data)
      console.log(`Weather request for city: ${city}`);
      
      // Använd mock data om API-nyckeln är demo
      if (WEATHER_API_KEY === 'demo_key_for_testing') {
        const mockData = mockWeatherData[city] || mockWeatherData['Stockholm'];
        return res.json(mockData);
      }

      // Annars använd riktig API med timeout
      const response = await axios.get(`${WEATHER_BASE_URL}/weather`, {
        params: {
          q: city,
          appid: WEATHER_API_KEY,
          units: 'metric',
          lang: 'sv'
        },
        timeout: 5000 // 5 sekunder timeout
      });
      
      res.json(response.data);
    } catch (error) {
      console.error('Weather API Error:', error.message);
      
      // Säker felhantering - inte läcka känslig information
      if (error.code === 'ECONNABORTED') {
        return res.status(408).json({ 
          error: 'Timeout - väderdata kunde inte hämtas i tid'
        });
      }
      
      if (error.response?.status === 404) {
        return res.status(404).json({ 
          error: `Stad "${req.params.city}" hittades inte`
        });
      }
      
      // Fallback till mock data vid fel
      const mockData = mockWeatherData[req.params.city] || mockWeatherData['Stockholm'];
      res.json(mockData);
    }
  },

  async getForecast(req, res) {
    try {
      const city = validateCityInput(req.params.city);
      
      console.log(`Forecast request for city: ${city}`);
      
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
        },
        timeout: 5000
      });
      
      res.json(response.data.list);
    } catch (error) {
      console.error('Forecast API Error:', error.message);
      
      if (error.code === 'ECONNABORTED') {
        return res.status(408).json({ 
          error: 'Timeout - prognosdata kunde inte hämtas i tid'
        });
      }
      
      // Fallback till mock data vid fel
      const mockData = mockForecastData[req.params.city] || mockForecastData['Stockholm'];
      res.json(mockData.list);
    }
  },

  async getWeatherByCoordinates(req, res) {
    try {
      const { lat, lon } = validateCoordinates(req.query.lat, req.query.lon);
      
      console.log(`Weather request for coordinates: ${lat}, ${lon}`);
      
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
        },
        timeout: 5000
      });
      
      res.json(response.data);
    } catch (error) {
      console.error('Coordinates Weather API Error:', error.message);
      
      if (error.code === 'ECONNABORTED') {
        return res.status(408).json({ 
          error: 'Timeout - väderdata kunde inte hämtas i tid'
        });
      }
      
      // Fallback till mock data vid fel
      res.json(mockWeatherData['Stockholm']);
    }
  }
};

module.exports = weatherController;
