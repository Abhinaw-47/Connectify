import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
} from '@mui/material';

const NotFound = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #2a003f 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 6,
          borderRadius: 4,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #1f2937, #0f172a)',
          color: 'white',
          maxWidth: 500,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '5rem', sm: '6rem', md: '8rem' },
            background: 'linear-gradient(to right, #ec4899, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          404
        </Typography>

        <Typography variant="h6" sx={{ color: '#aaa', mb: 4 }}>
          Oops! The page you're looking for doesn't exist.
        </Typography>

        <Button
          component={Link}
          to="/"
          variant="contained"
          sx={{
            background: 'linear-gradient(to right, #3b82f6, #2563eb)',
            color: 'white',
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
            },
          }}
        >
          Go Back Home
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFound;
