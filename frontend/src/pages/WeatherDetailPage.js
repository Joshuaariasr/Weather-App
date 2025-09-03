import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent,
  Alert,
  CircularProgress,
  Chip,
  Divider
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useWeather } from '../context/WeatherContext';
import WeatherCard from '../components/WeatherCard';

const WeatherDetailPage = () => {
  const { city } = useParams();
  const navigate = useNavigate();
  const { currentWeather, forecast, loading, error, getCurrentWeather, getForecast, favorites } = useWeather();
  const [forecastLoading, setForecastLoading] = useState(false);

  useEffect(() => {
    if (city) {
      getCurrentWeather(city);
      setForecastLoading(true);
      getForecast(city).finally(() => setForecastLoading(false));
    }
  }, [city, getCurrentWeather, getForecast]);

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('sv-SE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('sv-SE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Typography variant="h6" color="text.secondary">
          Kunde inte hämta väderdata för {city}
        </Typography>
      </Container>
    );
  }

  if (!currentWeather) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Ingen väderdata tillgänglig
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Väder för {currentWeather.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {formatDate(currentWeather.dt)}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Huvudväderkort */}
        <Grid item xs={12} md={8}>
          <WeatherCard 
            weather={currentWeather} 
            isFavorite={favorites.includes(currentWeather.name)}
            showLocation={false}
          />
        </Grid>

        {/* Detaljerad information */}
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Detaljerad information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Känns som:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {Math.round(currentWeather.main.feels_like)}°C
                  </Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Luftfuktighet:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {currentWeather.main.humidity}%
                  </Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Vindhastighet:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {currentWeather.wind?.speed || 0} m/s
                  </Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Lufttryck:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {currentWeather.main.pressure} hPa
                  </Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Sikt:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {currentWeather.visibility ? (currentWeather.visibility / 1000).toFixed(1) : 'N/A'} km
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 5-dagars prognos */}
        {forecast.length > 0 && (
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  5-dagars prognos
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {forecastLoading ? (
                  <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {forecast.slice(0, 5).map((day, index) => (
                      <Grid item xs={12} sm={6} md={2.4} key={index}>
                        <Box 
                          textAlign="center" 
                          p={2}
                          sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: 2,
                            '&:hover': {
                              backgroundColor: '#f5f5f5'
                            }
                          }}
                        >
                          <Typography variant="subtitle2" fontWeight="bold">
                            {formatDate(day.dt)}
                          </Typography>
                          <img 
                            src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                            alt={day.weather[0].description}
                            style={{ width: 50, height: 50 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {day.weather[0].description}
                          </Typography>
                          <Box display="flex" justifyContent="center" gap={1} mt={1}>
                            <Typography variant="body2" fontWeight="bold">
                              {Math.round(day.main.temp_max)}°
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {Math.round(day.main.temp_min)}°
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default WeatherDetailPage;
