import React from 'react';
import { Card, CardContent, Typography, Box, IconButton, Chip } from '@mui/material';
import { Favorite, FavoriteBorder, LocationOn } from '@mui/icons-material';
import { useWeather } from '../context/WeatherContext';
import { useNavigate } from 'react-router-dom';

const WeatherCard = ({ weather, isFavorite = false, showLocation = true }) => {
  const { addFavorite, removeFavorite } = useWeather();
  const navigate = useNavigate();

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFavorite(weather.name);
    } else {
      addFavorite(weather.name);
    }
  };

  const handleCardClick = () => {
    navigate(`/weather/${weather.name}`);
  };

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const getTemperatureColor = (temp) => {
    if (temp < 0) return '#1976d2'; // Blå för kallt
    if (temp < 10) return '#42a5f5'; // Ljusblå
    if (temp < 20) return '#66bb6a'; // Grön
    if (temp < 30) return '#ffa726'; // Orange
    return '#ef5350'; // Röd för varmt
  };

  return (
    <Card 
      sx={{ 
        cursor: 'pointer', 
        transition: 'all 0.3s ease',
        '&:hover': { 
          transform: 'translateY(-4px)',
          boxShadow: 4
        },
        mb: 2,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}
      onClick={handleCardClick}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1}>
            {showLocation && (
              <Box display="flex" alignItems="center" mb={1}>
                <LocationOn sx={{ mr: 0.5, fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {weather.name}, {weather.sys?.country}
                </Typography>
              </Box>
            )}
            
            <Typography variant="h6" component="div" sx={{ mb: 1 }}>
              {weather.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.slice(1)}
            </Typography>
            
            <Typography 
              variant="h3" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                color: getTemperatureColor(Math.round(weather.main.temp))
              }}
            >
              {Math.round(weather.main.temp)}°C
            </Typography>
          </Box>
          
          <Box display="flex" flexDirection="column" alignItems="center">
            <img 
              src={getWeatherIcon(weather.weather[0].icon)} 
              alt={weather.weather[0].description}
              style={{ width: 80, height: 80 }}
            />
            <IconButton 
              onClick={handleFavoriteClick} 
              sx={{ mt: 1 }}
              size="small"
            >
              {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
          </Box>
        </Box>
        
        <Box display="flex" justifyContent="space-between" mt={2} flexWrap="wrap" gap={1}>
          <Chip 
            label={`Känns som ${Math.round(weather.main.feels_like)}°C`}
            size="small"
            variant="outlined"
          />
          <Chip 
            label={`Luftfuktighet ${weather.main.humidity}%`}
            size="small"
            variant="outlined"
          />
          <Chip 
            label={`Vind ${weather.wind?.speed || 0} m/s`}
            size="small"
            variant="outlined"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
