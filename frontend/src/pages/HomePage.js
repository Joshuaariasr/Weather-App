import React, { useEffect, useRef } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Alert,
  CircularProgress,
  Paper,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useWeather } from '../context/WeatherContext';
import SearchBar from '../components/SearchBar';
import WeatherCard from '../components/WeatherCard';

const HomePage = () => {
  const { currentWeather, loading, error, favorites, getCurrentWeather } = useWeather();
  const hasLoadedInitial = useRef(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Ladda Stockholm som standard när sidan laddas (endast en gång)
  useEffect(() => {
    if (!currentWeather && !hasLoadedInitial.current) {
      hasLoadedInitial.current = true;
      getCurrentWeather('Stockholm');
    }
  }, [currentWeather, getCurrentWeather]);

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: isMobile ? 2 : 4,
        px: isMobile ? 1 : 3
      }}
    >
      <Box textAlign="center" mb={isMobile ? 2 : 4}>
        <Typography 
          variant={isMobile ? "h4" : "h3"} 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            fontSize: isMobile ? '1.8rem' : '2.5rem'
          }}
        >
          Väderappen
        </Typography>
        <Typography 
          variant={isMobile ? "body1" : "h6"} 
          color="text.secondary"
          sx={{
            fontSize: isMobile ? '0.9rem' : '1.1rem'
          }}
        >
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
        <Box mb={isMobile ? 2 : 4}>
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            gutterBottom 
            sx={{ 
              mb: 2,
              fontSize: isMobile ? '1.1rem' : '1.3rem'
            }}
          >
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
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            gutterBottom 
            sx={{ 
              mb: 2,
              fontSize: isMobile ? '1.1rem' : '1.3rem'
            }}
          >
            Dina favoritstäder
          </Typography>
          <Grid 
            container 
            spacing={isMobile ? 1 : 2}
            sx={{
              margin: isMobile ? '-4px' : 'auto'
            }}
          >
            {favorites.map((city, index) => (
              <Grid 
                item 
                xs={12} 
                sm={6} 
                md={4} 
                key={index}
                sx={{
                  padding: isMobile ? '4px' : '8px'
                }}
              >
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: isMobile ? 1.5 : 2, 
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#f5f5f5'
                    },
                    minHeight: isMobile ? 80 : 100,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                  onClick={() => getCurrentWeather(city)}
                >
                  <Typography 
                    variant={isMobile ? "subtitle1" : "h6"}
                    sx={{
                      fontSize: isMobile ? '0.9rem' : '1.1rem'
                    }}
                  >
                    {city}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      fontSize: isMobile ? '0.75rem' : '0.875rem'
                    }}
                  >
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
