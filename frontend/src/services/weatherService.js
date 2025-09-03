import axios from 'axios';
import { 
  validateCityName, 
  validateCoordinates, 
  getSecureHeaders, 
  validateApiResponse
} from '../utils/validation';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

// Create axios instance with security configurations
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: getSecureHeaders()
});

// Request interceptor for security
apiClient.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching of sensitive requests
    config.params = {
      ...config.params,
      _t: Date.now()
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return validateApiResponse(response.data);
  },
  (error) => {
    // Handle different types of errors securely
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || 'Serverfel uppstod';
      throw new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Kunde inte ansluta till servern');
    } else {
      // Something else happened
      throw new Error('Ett oväntat fel uppstod');
    }
  }
);

const weatherService = {
  async getCurrentWeather(city) {
    try {
      // Validate input
      const validation = validateCityName(city);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const response = await apiClient.get(`/weather/current/${encodeURIComponent(validation.sanitized)}`);
      return response;
    } catch (error) {
      console.error('Weather service error:', error.message);
      throw error;
    }
  },

  async getForecast(city) {
    try {
      // Validate input
      const validation = validateCityName(city);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const response = await apiClient.get(`/weather/forecast/${encodeURIComponent(validation.sanitized)}`);
      return response;
    } catch (error) {
      console.error('Forecast service error:', error.message);
      throw error;
    }
  },

  async getWeatherByCoords(lat, lon) {
    try {
      // Validate coordinates
      const validation = validateCoordinates(lat, lon);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const response = await apiClient.get('/weather/coordinates', {
        params: {
          lat: validation.coordinates.lat,
          lon: validation.coordinates.lon
        }
      });
      return response;
    } catch (error) {
      console.error('Coordinates weather service error:', error.message);
      throw error;
    }
  }
};

export { weatherService };
