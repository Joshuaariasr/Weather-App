import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import CloudIcon from '@mui/icons-material/Cloud';

const Navbar = () => {
  const location = useLocation();

  return (
    <AppBar position="static" sx={{ mb: 3 }}>
      <Toolbar>
        <CloudIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Väderappen
        </Typography>
        <Box>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{ 
              mr: 2,
              backgroundColor: location.pathname === '/' ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
          >
            Hem
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/favorites"
            sx={{
              backgroundColor: location.pathname === '/favorites' ? 'rgba(255,255,255,0.1)' : 'transparent'
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
