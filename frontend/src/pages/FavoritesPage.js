import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Alert,
  CircularProgress,
  Button,
  Paper
} from '@mui/material';
import { useWeather } from '../context/WeatherContext';
import WeatherCard from '../components/WeatherCard';

const FavoritesPage = () => {
  const { favorites, getCurrentWeather, loading } = useWeather();
  const [favoriteWeathers, setFavoriteWeathers] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  useEffect(() => {
    if (favorites.length > 0) {
      loadFavoriteWeathers();
    }
  }, [favorites]);

  const loadFavoriteWeathers = async () => {
    setLoadingFavorites(true);
    try {
      const weatherPromises = favorites.map(city => getCurrentWeather(city));
      const weathers = await Promise.all(weatherPromises);
      setFavoriteWeathers(weathers);
    } catch (error) {
      console.error('Error loading favorite weathers:', error);
    } finally {
      setLoadingFavorites(false);
    }
  };

  if (favorites.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box textAlign="center">
          <Typography variant="h4" gutterBottom>
            Dina favoriter
          </Typography>
          <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Du har inga favoritstäder än
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Lägg till städer som favoriter genom att klicka på hjärtat när du söker efter väder.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => window.location.href = '/'}
              size="large"
            >
              Gå till startsidan
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Dina favoritstäder
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {favorites.length} stad{favorites.length !== 1 ? 'er' : ''} sparade
        </Typography>
      </Box>

      {loadingFavorites && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      <Grid container spacing={3}>
        {favoriteWeathers.map((weather, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <WeatherCard 
              weather={weather} 
              isFavorite={true}
            />
          </Grid>
        ))}
      </Grid>

      {favoriteWeathers.length === 0 && !loadingFavorites && (
        <Alert severity="info" sx={{ mt: 3 }}>
          Kunde inte ladda väderdata för dina favoriter. Försök igen senare.
        </Alert>
      )}
    </Container>
  );
};

export default FavoritesPage;
