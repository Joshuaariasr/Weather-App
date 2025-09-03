import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Alert,
  CircularProgress,
  Button,
  Paper,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useWeather } from '../context/WeatherContext';
import WeatherCard from '../components/WeatherCard';

const FavoritesPage = () => {
  const { favorites, getCurrentWeather, loading } = useWeather();
  const [favoriteWeathers, setFavoriteWeathers] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: isMobile ? 2 : 4,
          px: isMobile ? 1 : 3
        }}
      >
        <Box textAlign="center">
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            gutterBottom
            sx={{
              fontSize: isMobile ? '1.5rem' : '2rem'
            }}
          >
            Dina favoriter
          </Typography>
          <Paper elevation={3} sx={{ p: isMobile ? 2 : 4, mt: 4 }}>
            <Typography 
              variant={isMobile ? "h6" : "h6"} 
              color="text.secondary" 
              gutterBottom
              sx={{
                fontSize: isMobile ? '1.1rem' : '1.25rem'
              }}
            >
              Du har inga favoritstäder än
            </Typography>
            <Typography 
              variant={isMobile ? "body2" : "body1"} 
              color="text.secondary" 
              sx={{ 
                mb: 3,
                fontSize: isMobile ? '0.9rem' : '1rem'
              }}
            >
              Lägg till städer som favoriter genom att klicka på hjärtat när du söker efter väder.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => window.location.href = '/'}
              size={isMobile ? "medium" : "large"}
              sx={{
                minHeight: isMobile ? 44 : 'auto'
              }}
            >
              Gå till startsidan
            </Button>
          </Paper>
        </Box>
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
          Dina favoritstäder
        </Typography>
        <Typography 
          variant={isMobile ? "body1" : "subtitle1"} 
          color="text.secondary"
          sx={{
            fontSize: isMobile ? '0.9rem' : '1rem'
          }}
        >
          {favorites.length} stad{favorites.length !== 1 ? 'er' : ''} sparade
        </Typography>
      </Box>

      {loadingFavorites && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      <Grid 
        container 
        spacing={isMobile ? 1 : 3}
        sx={{
          margin: isMobile ? '-4px' : 'auto'
        }}
      >
        {favoriteWeathers.map((weather, index) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            key={index}
            sx={{
              padding: isMobile ? '4px' : '12px'
            }}
          >
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
