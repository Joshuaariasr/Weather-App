import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { weatherService } from '../services/weatherService';

const WeatherContext = createContext();

const initialState = {
  currentWeather: null,
  forecast: [],
  favorites: JSON.parse(localStorage.getItem('weatherFavorites')) || [],
  loading: false,
  error: null,
  searchHistory: JSON.parse(localStorage.getItem('weatherSearchHistory')) || [],
};

const weatherReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_CURRENT_WEATHER':
      return { ...state, currentWeather: action.payload, loading: false, error: null };
    case 'SET_FORECAST':
      return { ...state, forecast: action.payload };
    case 'ADD_FAVORITE':
      const newFavorites = [...state.favorites, action.payload];
      localStorage.setItem('weatherFavorites', JSON.stringify(newFavorites));
      return { ...state, favorites: newFavorites };
    case 'REMOVE_FAVORITE':
      const filteredFavorites = state.favorites.filter(city => city !== action.payload);
      localStorage.setItem('weatherFavorites', JSON.stringify(filteredFavorites));
      return { ...state, favorites: filteredFavorites };
    case 'ADD_TO_HISTORY':
      const newHistory = [action.payload, ...state.searchHistory.filter(city => city !== action.payload)].slice(0, 10);
      localStorage.setItem('weatherSearchHistory', JSON.stringify(newHistory));
      return { ...state, searchHistory: newHistory };
    default:
      return state;
  }
};

export const WeatherProvider = ({ children }) => {
  const [state, dispatch] = useReducer(weatherReducer, initialState);

  const getCurrentWeather = useCallback(async (city) => {
    // Förhindra dubletter av samma stad
    if (state.currentWeather?.name === city) {
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const weather = await weatherService.getCurrentWeather(city);
      dispatch({ type: 'SET_CURRENT_WEATHER', payload: weather });
      dispatch({ type: 'ADD_TO_HISTORY', payload: city });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [state.currentWeather?.name]);

  const getForecast = useCallback(async (city) => {
    try {
      const forecast = await weatherService.getForecast(city);
      dispatch({ type: 'SET_FORECAST', payload: forecast });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  const addFavorite = useCallback((city) => {
    dispatch({ type: 'ADD_FAVORITE', payload: city });
  }, []);

  const removeFavorite = useCallback((city) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: city });
  }, []);

  const value = {
    ...state,
    getCurrentWeather,
    getForecast,
    addFavorite,
    removeFavorite,
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
