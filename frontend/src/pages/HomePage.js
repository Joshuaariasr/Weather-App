import React, { useEffect, useRef } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import { useWeather } from '../context/WeatherContext';
import SearchBar from '../components/SearchBar';
import WeatherCard from '../components/WeatherCard';

const HomePage = () => {
  const { currentWeather, loading, error, favorites, getCurrentWeather } = useWeather();
  const hasLoadedInitial = useRef(false);

  // Ladda Stockholm som standard när sidan laddas (endast en gång)
  useEffect(() => {
    if (!currentWeather && !hasLoadedInitial.current) {
      hasLoadedInitial.current = true;
      getCurrentWeather('Stockholm');
    }
  }, [currentWeather, getCurrentWeather]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Väderappen
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Hitta aktuell väderinformation för alla städer
        </Typography>
      </Box>

      <SearchBar />

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {currentWeather && (
        <Box mb={4}>
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            Aktuellt väder
          </Typography>
          <WeatherCard 
            weather={currentWeather} 
            isFavorite={favorites.includes(currentWeather.name)}
          />
        </Box>
      )}

      {favorites.length > 0 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            Dina favoritstäder
          </Typography>
          <Grid container spacing={2}>
            {favorites.map((city, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                  onClick={() => getCurrentWeather(city)}
                >
                  <Typography variant="h6">{city}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Klicka för att visa väder
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default HomePage;
