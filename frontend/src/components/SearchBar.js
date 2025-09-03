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
  Alert,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Search, MyLocation, History } from '@mui/icons-material';
import { useWeather } from '../context/WeatherContext';
import { validateSearchInput } from '../utils/validation';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [validationError, setValidationError] = useState('');
  const { getCurrentWeather, searchHistory, loading } = useWeather();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSearch = async (city = searchTerm) => {
    try {
      // Clear previous validation errors
      setValidationError('');
      
      if (!city.trim()) {
        setValidationError('Ange ett stadsnamn');
        return;
      }

      // Validate input
      const validation = validateSearchInput(city);
      if (!validation.isValid) {
        setValidationError(validation.errors.join(', '));
        return;
      }

      // Use sanitized input
      await getCurrentWeather(validation.sanitized);
      setSearchTerm('');
      setShowHistory(false);
    } catch (error) {
      setValidationError(error.message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError('');
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // Here we would call an API to get city based on coordinates
            // For now we use a placeholder
            console.log('Position:', latitude, longitude);
          } catch (error) {
            console.error('Error getting location:', error);
          }
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
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowHistory(true)}
          error={!!validationError}
          helperText={validationError}
          inputProps={{
            maxLength: 50 // Limit input length
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              '& fieldset': {
                borderColor: validationError ? 'red' : 'transparent',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255,255,255,0.3)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white',
              },
            },
            '& .MuiFormHelperText-root': {
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.1)',
              padding: '2px 8px',
              borderRadius: '4px',
              marginTop: '4px'
            }
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
