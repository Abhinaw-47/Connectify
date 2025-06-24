import React, { useEffect, useState } from 'react';
import { Avatar, IconButton, Typography, Box } from '@mui/material';
import { FaSignOutAlt } from 'react-icons/fa';
import { BsStars } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { disconnectSocket, connectSocket } from '../api';

const COLORS = {
  darkBg: 'linear-gradient(135deg, #000000 0%, #2a003f 100%)',
  text: '#ffffff',
  textMuted: '#a1a1aa',
  danger: '#ef4444',
  purple: '#8b5cf6',
  border: 'rgba(255, 255, 255, 0.1)',
};

const Navbar = () => {
  const [user, setUser] = useState(() => {
    const profile = localStorage.getItem('profile');
    return profile ? JSON.parse(profile) : null;
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const profile = localStorage.getItem('profile');
    const userData = profile?.length > 0 ? JSON.parse(profile) : null;

    if (userData?.token) {
      try {
        const decodedData = jwtDecode(userData.token);
        if (decodedData.exp * 1000 < new Date().getTime()) {
          logoutHandler();
          return;
        }
        connectSocket();
      } catch (error) {
        logoutHandler();
      }
    }

    setUser(userData);
  }, [location]);

  const logoutHandler = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('profile');
    setUser(null);
    disconnectSocket();
    navigate('/');
  };

  return (
    <Box
      sx={{
        background: COLORS.darkBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 4,
        py: 2,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderBottom: `1px solid ${COLORS.border}`,
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)',
      }}
    >
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            color: COLORS.text,
          }}
        >
          <IconButton
            sx={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              color: 'white',
              animation: 'float 2s ease-in-out infinite',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              '@keyframes float': {
                '0%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-6px)' },
                '100%': { transform: 'translateY(0)' },
              },
            }}
          >
            <BsStars size={24} />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #8b5cf6, #3b82f6)',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            CONNECTIFY
          </Typography>
        </Box>
      </Link>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {user ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  color: COLORS.text,
                  fontWeight: '700',
                }}
              >
                {user?.result?.name?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              <Typography variant="body1" color={COLORS.textMuted}>
                {user?.result?.name || 'User'}
              </Typography>
            </Box>     
          </>
        ) : (
          <Link to="/auth">
            <button
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '14px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(59, 130, 246, 0.4)',
              }}
            >
              Sign In
            </button>
          </Link>
        )}
      </Box>
    </Box>
  );
};

export default Navbar;
