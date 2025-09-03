import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const weatherService = {
  async getCurrentWeather(city) {
    try {
      const response = await axios.get(`${API_BASE_URL}/weather/current/${city}`);
      return response.data;
    } catch (error) {
      throw new Error(`Kunde inte hämta väderdata för ${city}`);
    }
  },

  async getForecast(city) {
    try {
      const response = await axios.get(`${API_BASE_URL}/weather/forecast/${city}`);
      return response.data;
    } catch (error) {
      throw new Error(`Kunde inte hämta prognos för ${city}`);
    }
  },

  async getWeatherByCoords(lat, lon) {
    try {
      const response = await axios.get(`${API_BASE_URL}/weather/coordinates?lat=${lat}&lon=${lon}`);
      return response.data;
    } catch (error) {
      throw new Error('Kunde inte hämta väderdata för din position');
    }
  }
};

export { weatherService };
