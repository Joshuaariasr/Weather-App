import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, useMediaQuery, useTheme } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import CloudIcon from '@mui/icons-material/Cloud';

const Navbar = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar position="static" sx={{ mb: 3 }}>
      <Toolbar sx={{ 
        paddingLeft: isMobile ? 1 : 2,
        paddingRight: isMobile ? 1 : 2
      }}>
        <CloudIcon sx={{ mr: 2, fontSize: isMobile ? 24 : 28 }} />
        <Typography 
          variant={isMobile ? "h6" : "h6"} 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontSize: isMobile ? '1.1rem' : '1.25rem'
          }}
        >
          Väderappen
        </Typography>
        <Box display="flex" gap={isMobile ? 0.5 : 2}>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{ 
              backgroundColor: location.pathname === '/' ? 'rgba(255,255,255,0.1)' : 'transparent',
              fontSize: isMobile ? '0.875rem' : '1rem',
              padding: isMobile ? '6px 8px' : '8px 16px',
              minHeight: isMobile ? 44 : 'auto',
              minWidth: isMobile ? 44 : 'auto'
            }}
          >
            Hem
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/favorites"
            sx={{
              backgroundColor: location.pathname === '/favorites' ? 'rgba(255,255,255,0.1)' : 'transparent',
              fontSize: isMobile ? '0.875rem' : '1rem',
              padding: isMobile ? '6px 8px' : '8px 16px',
              minHeight: isMobile ? 44 : 'auto',
              minWidth: isMobile ? 44 : 'auto'
            }}
          >
            Favoriter
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
