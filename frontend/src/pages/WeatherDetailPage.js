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
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useWeather } from '../context/WeatherContext';
import WeatherCard from '../components/WeatherCard';

const WeatherDetailPage = () => {
  const { city } = useParams();
  const navigate = useNavigate();
  const { currentWeather, forecast, loading, error, getCurrentWeather, getForecast, favorites } = useWeather();
  const [forecastLoading, setForecastLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

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
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: isMobile ? 2 : 4,
          px: isMobile ? 1 : 3
        }}
      >
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: isMobile ? 2 : 4,
          px: isMobile ? 1 : 3
        }}
      >
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
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: isMobile ? 2 : 4,
          px: isMobile ? 1 : 3
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Ingen väderdata tillgänglig
        </Typography>
      </Container>
    );
  }

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: isMobile ? 2 : 4,
        px: isMobile ? 1 : 3
      }}
    >
      <Box mb={isMobile ? 2 : 4}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            fontSize: isMobile ? '1.5rem' : '2rem'
          }}
        >
          Väder för {currentWeather.name}
        </Typography>
        <Typography 
          variant={isMobile ? "body1" : "subtitle1"} 
          color="text.secondary"
          sx={{
            fontSize: isMobile ? '0.9rem' : '1rem'
          }}
        >
          {formatDate(currentWeather.dt)}
        </Typography>
      </Box>

      <Grid container spacing={isMobile ? 1 : 3}>
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
            <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
              <Typography 
                variant={isMobile ? "h6" : "h6"} 
                gutterBottom
                sx={{
                  fontSize: isMobile ? '1.1rem' : '1.25rem'
                }}
              >
                Detaljerad information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box display="flex" flexDirection="column" gap={isMobile ? 1.5 : 2}>
                <Box display="flex" justifyContent="space-between">
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}
                  >
                    Känns som:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    fontWeight="bold"
                    sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}
                  >
                    {Math.round(currentWeather.main.feels_like)}°C
                  </Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between">
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}
                  >
                    Luftfuktighet:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    fontWeight="bold"
                    sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}
                  >
                    {currentWeather.main.humidity}%
                  </Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between">
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}
                  >
                    Vindhastighet:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    fontWeight="bold"
                    sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}
                  >
                    {currentWeather.wind?.speed || 0} m/s
                  </Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between">
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}
                  >
                    Lufttryck:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    fontWeight="bold"
                    sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}
                  >
                    {currentWeather.main.pressure} hPa
                  </Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between">
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}
                  >
                    Sikt:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    fontWeight="bold"
                    sx={{ fontSize: isMobile ? '0.8rem' : '0.875rem' }}
                  >
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
              <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
                <Typography 
                  variant={isMobile ? "h6" : "h6"} 
                  gutterBottom
                  sx={{
                    fontSize: isMobile ? '1.1rem' : '1.25rem'
                  }}
                >
                  5-dagars prognos
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {forecastLoading ? (
                  <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Grid 
                    container 
                    spacing={isMobile ? 1 : 2}
                    className="forecast-grid"
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: isMobile 
                        ? 'repeat(2, 1fr)' 
                        : isTablet 
                        ? 'repeat(3, 1fr)' 
                        : 'repeat(5, 1fr)',
                      gap: isMobile ? 1 : 2
                    }}
                  >
                    {forecast.slice(0, 5).map((day, index) => (
                      <Grid item key={index}>
                        <Box 
                          textAlign="center" 
                          p={isMobile ? 1 : 2}
                          sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: 2,
                            '&:hover': {
                              backgroundColor: '#f5f5f5'
                            }
                          }}
                        >
                          <Typography 
                            variant="subtitle2" 
                            fontWeight="bold"
                            sx={{ 
                              fontSize: isMobile ? '0.75rem' : '0.875rem',
                              mb: 1
                            }}
                          >
                            {formatDate(day.dt)}
                          </Typography>
                          <img 
                            src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                            alt={day.weather[0].description}
                            style={{ 
                              width: isMobile ? 40 : 50, 
                              height: isMobile ? 40 : 50 
                            }}
                          />
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              fontSize: isMobile ? '0.7rem' : '0.8rem',
                              mb: 1
                            }}
                          >
                            {day.weather[0].description}
                          </Typography>
                          <Box display="flex" justifyContent="center" gap={1}>
                            <Typography 
                              variant="body2" 
                              fontWeight="bold"
                              sx={{ fontSize: isMobile ? '0.7rem' : '0.8rem' }}
                            >
                              {Math.round(day.main.temp_max)}°
                            </Typography>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ fontSize: isMobile ? '0.7rem' : '0.8rem' }}
                            >
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
