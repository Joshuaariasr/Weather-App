import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Paper, 
  List, 
  ListItem, 
  ListItemText,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Search, MyLocation, History } from '@mui/icons-material';
import { useWeather } from '../context/WeatherContext';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const { getCurrentWeather, searchHistory, loading } = useWeather();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSearch = async (city = searchTerm) => {
    if (city.trim()) {
      await getCurrentWeather(city.trim());
      setSearchTerm('');
      setShowHistory(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // Här skulle vi anropa en API för att få stad baserat på koordinater
          // För nu använder vi en placeholder
          console.log('Position:', latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <Box sx={{ position: 'relative', mb: 3 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: isMobile ? 1.5 : 2, 
          display: 'flex', 
          alignItems: 'center', 
          gap: isMobile ? 1 : 2,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          flexDirection: isMobile ? 'column' : 'row'
        }}
        className="search-container"
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Sök efter stad..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowHistory(true)}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              '& fieldset': {
                borderColor: 'transparent',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255,255,255,0.3)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white',
              },
            },
          }}
        />
        <Box 
          display="flex" 
          gap={1} 
          width={isMobile ? '100%' : 'auto'}
          justifyContent={isMobile ? 'space-between' : 'flex-end'}
        >
          <Button
            variant="contained"
            onClick={() => handleSearch()}
            disabled={loading || !searchTerm.trim()}
            startIcon={<Search />}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.3)',
              },
              flex: isMobile ? 1 : 'none',
              minHeight: isMobile ? 44 : 'auto'
            }}
          >
            {isMobile ? 'Sök' : 'Sök'}
          </Button>
          <IconButton
            onClick={getCurrentLocation}
            sx={{ 
              color: 'white',
              minHeight: isMobile ? 44 : 'auto',
              minWidth: isMobile ? 44 : 'auto'
            }}
            title="Använd min plats"
          >
            <MyLocation />
          </IconButton>
        </Box>
      </Paper>

      {showHistory && searchHistory.length > 0 && (
        <Paper 
          elevation={3} 
          sx={{ 
            position: 'absolute', 
            top: '100%', 
            left: 0, 
            right: 0, 
            zIndex: 1000,
            mt: 1
          }}
        >
          <Box sx={{ p: 1, borderBottom: '1px solid #eee' }}>
            <Typography variant="subtitle2" color="text.secondary">
              <History sx={{ mr: 1, verticalAlign: 'middle' }} />
              Senaste sökningar
            </Typography>
          </Box>
          <List dense>
            {searchHistory.slice(0, 5).map((city, index) => (
              <ListItem
                key={index}
                button
                onClick={() => handleSearch(city)}
                sx={{ 
                  '&:hover': { backgroundColor: '#f5f5f5' },
                  minHeight: isMobile ? 48 : 'auto'
                }}
              >
                <ListItemText primary={city} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default SearchBar;
