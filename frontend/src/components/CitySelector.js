import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper,
  useMediaQuery,
  useTheme,
  Chip
} from '@mui/material';
import { LocationCity, TrendingUp } from '@mui/icons-material';
import { useWeather } from '../context/WeatherContext';

const CitySelector = () => {
  const [availableCities, setAvailableCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getCurrentWeather, currentWeather } = useWeather();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchAvailableCities();
  }, []);

  const fetchAvailableCities = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/weather/cities');
      const data = await response.json();
      setAvailableCities(data.cities || []);
    } catch (error) {
      console.error('Error fetching cities:', error);
      // Fallback till hårdkodade städer
      setAvailableCities([
        { name: 'Stockholm', country: 'SE' },
        { name: 'Göteborg', country: 'SE' },
        { name: 'Malmö', country: 'SE' },
        { name: 'Köpenhamn', country: 'DK' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = async (cityName) => {
    try {
      await getCurrentWeather(cityName);
    } catch (error) {
      console.error('Error fetching weather for city:', error);
    }
  };

  const getCountryFlag = (countryCode) => {
    const flags = {
      'SE': '🇸🇪',
      'DK': '🇩🇰',
      'NO': '🇳🇴',
      'FI': '🇫🇮'
    };
    return flags[countryCode] || '🌍';
  };

  if (loading) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography>Laddar städer...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Paper 
        elevation={2} 
        sx={{ 
          p: isMobile ? 2 : 3,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocationCity sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" component="h2">
            Populära städer
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Klicka på en stad för att se aktuellt väder
        </Typography>

        {/* Använd Box istället för Grid för att undvika varningar */}
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: 1
          }}
        >
          {availableCities.map((city, index) => (
            <Button
              key={index}
              fullWidth
              variant={currentWeather?.name === city.name ? "contained" : "outlined"}
              onClick={() => handleCitySelect(city.name)}
              sx={{
                p: 1.5,
                minHeight: isMobile ? 60 : 70,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.5,
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
                  {getCountryFlag(city.country)}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontWeight: currentWeather?.name === city.name ? 600 : 500,
                    fontSize: isMobile ? '0.875rem' : '1rem'
                  }}
                >
                  {city.name}
                </Typography>
              </Box>
              <Chip
                size="small"
                label={city.country}
                variant="outlined"
                sx={{ 
                  fontSize: '0.7rem',
                  height: 20,
                  '& .MuiChip-label': { px: 1 }
                }}
              />
            </Button>
          ))}
        </Box>

        {currentWeather && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp sx={{ color: 'primary.main' }} />
              <Typography variant="body2" color="text.secondary">
                Aktuell stad: <strong>{currentWeather.name}</strong>
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default CitySelector;
