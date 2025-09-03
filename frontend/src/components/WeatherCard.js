import React from 'react';
import { Card, CardContent, Typography, Box, IconButton, Chip } from '@mui/material';
import { Favorite, FavoriteBorder, LocationOn } from '@mui/icons-material';
import { useWeather } from '../context/WeatherContext';
import { useNavigate } from 'react-router-dom';

const WeatherCard = ({ weather, isFavorite = false, showLocation = true }) => {
  const { addFavorite, removeFavorite } = useWeather();
  const navigate = useNavigate();

  // Säkerhetskontroll för weather-objektet
  if (!weather || !weather.name) {
    return (
      <Card elevation={2} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Ingen väderdata tillgänglig
        </Typography>
      </Card>
    );
  }

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

  const formatTemperature = (temp) => {
    return Math.round(temp);
  };

  const formatWindSpeed = (speed) => {
    return Math.round(speed * 3.6); // Konvertera m/s till km/h
  };

  const getWindDirection = (deg) => {
    const directions = ['N', 'NO', 'O', 'SO', 'S', 'SV', 'V', 'NV'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  return (
    <Card 
      elevation={2} 
      sx={{ 
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4
        }
      }}
      onClick={handleCardClick}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header med stad och favorit-knapp */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {showLocation && <LocationOn sx={{ mr: 1, color: 'primary.main' }} />}
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
              {weather.name}
            </Typography>
          </Box>
          <IconButton 
            onClick={handleFavoriteClick}
            sx={{ color: isFavorite ? 'error.main' : 'grey.400' }}
          >
            {isFavorite ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        </Box>

        {/* Huvudväder */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h2" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                color: getTemperatureColor(weather.main?.temp || 0)
              }}
            >
              {formatTemperature(weather.main?.temp || 0)}°
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              {weather.weather?.[0]?.description || 'Okänt väder'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Känns som {formatTemperature(weather.main?.feels_like || 0)}°
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            {weather.weather?.[0]?.icon && (
              <img 
                src={getWeatherIcon(weather.weather[0].icon)} 
                alt={weather.weather[0].description}
                style={{ width: 80, height: 80 }}
              />
            )}
          </Box>
        </Box>

        {/* Väderdetaljer */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Min/Max
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {formatTemperature(weather.main?.temp_min || 0)}° / {formatTemperature(weather.main?.temp_max || 0)}°
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Luftfuktighet
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {weather.main?.humidity || 0}%
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Vind
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {formatWindSpeed(weather.wind?.speed || 0)} km/h
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {getWindDirection(weather.wind?.deg || 0)}
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Tryck
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {weather.main?.pressure || 0} hPa
            </Typography>
          </Box>
        </Box>

        {/* Sikt */}
        {weather.visibility && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Chip 
              label={`Sikt: ${Math.round(weather.visibility / 1000)} km`}
              variant="outlined"
              size="small"
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
