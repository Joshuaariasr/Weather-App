import React, { useEffect, useRef } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import { useWeather } from '../context/WeatherContext';
import SearchBar from '../components/SearchBar';
import WeatherCard from '../components/WeatherCard';
import CitySelector from '../components/CitySelector';

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
          🌤️ Väderappen
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Upptäck väderdata för städer i Norden
        </Typography>
      </Box>

      {/* Sökfunktion */}
      <SearchBar />

      {/* Stadval */}
      <CitySelector />

      {/* Felmeddelanden */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Laddningsindikator */}
      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Huvudinnehåll - Använd Box istället för Grid */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Aktuellt väder */}
        <Box sx={{ flex: { xs: 1, md: 2 } }}>
          {currentWeather ? (
            <WeatherCard weather={currentWeather} />
          ) : (
            <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                Välj en stad för att se väderdata
              </Typography>
            </Paper>
          )}
        </Box>

        {/* Favoriter */}
        <Box sx={{ flex: { xs: 1, md: 1 } }}>
          <Paper elevation={2} sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom>
              ⭐ Favoritstäder
            </Typography>
            {favorites.length > 0 ? (
              <Box>
                {favorites.map((city, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      p: 1, 
                      mb: 1, 
                      bgcolor: 'grey.100', 
                      borderRadius: 1,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'grey.200' }
                    }}
                    onClick={() => getCurrentWeather(city)}
                  >
                    <Typography variant="body2">
                      {city}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Inga favoritstäder än. Lägg till städer genom att söka!
              </Typography>
            )}
          </Paper>
        </Box>
      </Box>

      {/* Information om appen */}
      <Box mt={4}>
        <Paper elevation={1} sx={{ p: 3, bgcolor: 'grey.50' }}>
          <Typography variant="h6" gutterBottom>
            ℹ️ Om appen
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Denna väderapp visar aktuellt väder och prognoser för städer i Norden. 
            Du kan söka efter specifika städer eller välja från våra populära alternativ.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Tillgängliga städer:</strong> Stockholm, Göteborg, Malmö, Köpenhamn
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default HomePage;
