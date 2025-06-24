import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Paper,
  Divider,
} from '@mui/material';
import { FaUser, FaEnvelope, FaLock, FaRedo } from 'react-icons/fa';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { googleSignin, signIn, signUp } from '../actions/auth';

const Auth = () => {
  const [postData, setPostData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isSignUp, setIsSignUp] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setPostData({ ...postData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      dispatch(signUp(postData, navigate));
    } else {
      dispatch(signIn(postData, navigate));
    }
  };

  const handleGoogleSuccess = (res) => {
    const credential = res.credential;
    const decoded = jwtDecode(credential);
    dispatch(googleSignin({ token: credential, user: decoded }, navigate));
  };

  const handleGoogleError = (error) => {
    console.error('Google Sign In failed:', error);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #2a003f 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
        py: 4,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 4,
          width: '100%',
          maxWidth: 420,
          background: 'rgba(255, 255, 255, 0.06)',
          backdropFilter: 'blur(10px)',
          color: '#fff',
          boxShadow: '0 0 30px rgba(255,255,255,0.05)',
        }}
      >
        {/* Heading */}
        <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </Typography>
        <Typography
          variant="body2"
          align="center"
          sx={{ color: '#aaa', mb: 2 }}
        >
          {isSignUp ? 'Join our community today' : 'Sign in to your account'}
        </Typography>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {isSignUp && (
            <>
              <TextField
                fullWidth
                name="firstName"
                placeholder="First Name"
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaUser size={16} color="gray" />
                    </InputAdornment>
                  ),
                  sx: { color: '#fff' },
                }}
              />
              <TextField
                fullWidth
                name="lastName"
                placeholder="Last Name"
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaUser size={16} color="gray" />
                    </InputAdornment>
                  ),
                  sx: { color: '#fff' },
                }}
              />
            </>
          )}

          <TextField
            fullWidth
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            type="email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaEnvelope size={16} color="gray" />
                </InputAdornment>
              ),
              sx: { color: '#fff' },
            }}
          />

          <TextField
            fullWidth
            name="password"
            placeholder="Password"
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            type="password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaLock size={16} color="gray" />
                </InputAdornment>
              ),
              sx: { color: '#fff' },
            }}
          />

          {isSignUp && (
            <TextField
              fullWidth
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              type="password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaRedo size={16} color="gray" />
                  </InputAdornment>
                ),
                sx: { color: '#fff' },
              }}
            />
          )}

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{
              mt: 3,
              py: 1.5,
              fontWeight: 'bold',
              fontSize: '1rem',
              background: 'linear-gradient(to right, #9333ea, #7e22ce)',
              '&:hover': {
                background: 'linear-gradient(to right, #7e22ce, #6b21a8)',
              },
            }}
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Button>

          {/* Divider */}
          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }}>
            <Typography variant="body2" sx={{ color: '#aaa' }}>
              or continue with
            </Typography>
          </Divider>

          {/* Google Login */}
          <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
            <Box display="flex" justifyContent="center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="filled_blue"
                size="large"
              />
            </Box>
          </GoogleOAuthProvider>

          {/* Switch mode */}
          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 3, color: '#aaa' }}
          >
            {isSignUp
              ? 'Already have an account? '
              : "Don't have an account? "}
            <Button
              variant="text"
              onClick={() => setIsSignUp(!isSignUp)}
              sx={{
                color: '#60a5fa',
                fontWeight: 'bold',
                textTransform: 'none',
              }}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </Button>
          </Typography>
        </Box>

        {/* Footer */}
        <Typography
          variant="caption"
          align="center"
          display="block"
          sx={{ mt: 4, color: '#666' }}
        >
          © 2025 CONNECTIFY by ABHINAW ANAND. All rights reserved.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Auth;
