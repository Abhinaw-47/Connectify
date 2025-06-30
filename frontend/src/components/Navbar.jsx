import React, { useEffect, useState } from 'react';
import { Avatar, IconButton, Typography, Box, Fade, Slide, Zoom } from '@mui/material';
import { FaSignOutAlt, FaUser } from 'react-icons/fa';
import { BsStars } from 'react-icons/bs';
import { MdLogout } from 'react-icons/md';
import { keyframes } from '@mui/system';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { disconnectSocket, connectSocket, fetchPosts } from '../api';


const floatLogo = keyframes`
  0%, 100% { 
    transform: translateY(0px) rotate(0deg) scale(1);
  }
  25% { 
    transform: translateY(-8px) rotate(5deg) scale(1.05);
  }
  50% { 
    transform: translateY(-4px) rotate(-3deg) scale(1.02);
  }
  75% { 
    transform: translateY(-12px) rotate(2deg) scale(1.08);
  }
`;

const shimmerText = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const pulseGlow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.3),
                0 0 40px rgba(59, 130, 246, 0.2),
                inset 0 0 20px rgba(139, 92, 246, 0.1);
  }
  50% { 
    box-shadow: 0 0 30px rgba(139, 92, 246, 0.5),
                0 0 60px rgba(59, 130, 246, 0.3),
                inset 0 0 30px rgba(139, 92, 246, 0.2);
  }
`;

const slideBackground = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const bounceIn = keyframes`
  0% { 
    transform: scale(0.3) rotateY(-180deg); 
    opacity: 0; 
  }
  50% { 
    transform: scale(1.1) rotateY(-90deg); 
    opacity: 1; 
  }
  100% { 
    transform: scale(1) rotateY(0deg); 
    opacity: 1; 
  }
`;

const COLORS = {
  darkBg: `
    radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
    linear-gradient(135deg, #000000 0%, #1a0033 25%, #2a003f 50%, #1a0033 75%, #000000 100%)
  `,
  text: '#ffffff',
  textMuted: '#a1a1aa',
  danger: '#ef4444',
  purple: '#8b5cf6',
  border: 'rgba(255, 255, 255, 0.2)',
};

const Navbar = () => {
  const [user, setUser] = useState(() => {
    const profile = localStorage.getItem('profile');
    return profile ? JSON.parse(profile) : null;
  });
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMounted(true);
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
const clickLogo=()=> {
  dispatch(fetchUsers())
  // navigate('/posts');
}
  

  return (
    <Fade in={mounted} timeout={800}>
      <Box
        sx={{
          background: COLORS.darkBg,
          backdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2, sm: 4 },
          py: 2,
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          border: `1px solid ${COLORS.border}`,
          borderLeft: 'none',
          borderRight: 'none',
          borderTop: 'none',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: `
              linear-gradient(
                90deg, 
                transparent, 
                rgba(255, 255, 255, 0.05), 
                transparent
              )
            `,
            animation: `${slideBackground} 4s ease-in-out infinite`,
          },
        }}
      >
       
        <Slide direction="right" in={mounted} timeout={800}>
          <Link to="/" onClick={clickLogo} style={{ textDecoration: 'none' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                color: COLORS.text,
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Zoom in={mounted} timeout={1000} style={{ transitionDelay: '200ms' }}>
                <IconButton
                  sx={{
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    color: 'white',
                    width: 50,
                    height: 50,
                    animation: `${floatLogo} 6s ease-in-out infinite`,
                    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      animation: 'none',
                      transform: 'scale(1.1) rotateY(10deg)',
                      boxShadow: '0 12px 35px rgba(59, 130, 246, 0.6)',
                      background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                    },
                  }}
                >
                  <BsStars size={24} />
                </IconButton>
              </Zoom>
              
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  background: `
                    linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6),
                    linear-gradient(45deg, #ffffff, #e0e0ff)
                  `,
                  backgroundSize: '300% 100%, 100% 100%',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: `${shimmerText} 3s ease-in-out infinite`,
                  letterSpacing: '2px',
                  textShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    filter: 'brightness(1.2)',
                  },
                }}
              >
                CONNECTIFY
              </Typography>
            </Box>
          </Link>
        </Slide>

       
        <Slide direction="left" in={mounted} timeout={800} style={{ transitionDelay: '300ms' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative', zIndex: 1 }}>
            {user ? (
              <Fade in timeout={600} style={{ transitionDelay: '500ms' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
               
                  <Box 
                    sx={{ 
                      display: { xs: 'none', sm: 'flex' }, 
                      alignItems: 'center', 
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: '20px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.15)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <Zoom in timeout={800} style={{ transitionDelay: '600ms' }}>
                      <Avatar
                        sx={{
                          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                          color: COLORS.text,
                          fontWeight: 700,
                          width: 40,
                          height: 40,
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          animation: `${bounceIn} 0.8s ease-out`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.1) rotateZ(5deg)',
                            boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
                          },
                        }}
                      >
                        {user?.result?.name?.charAt(0).toUpperCase() || <FaUser size={16} />}
                      </Avatar>
                    </Zoom>
                    
                    <Box>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: COLORS.text,
                          fontWeight: 600,
                          fontSize: '0.9rem',
                        }}
                      >
                        {user?.result?.name || 'User'}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: COLORS.textMuted,
                          fontSize: '0.75rem',
                        }}
                      >
                        Online
                      </Typography>
                    </Box>
                  </Box>

                
                  <Zoom in timeout={800} style={{ transitionDelay: '700ms' }}>
                    <IconButton
                      onClick={logoutHandler}
                      sx={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        width: 45,
                        height: 45,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #ef4444, #dc2626)',
                          color: 'white',
                          transform: 'scale(1.1) rotate(5deg)',
                          boxShadow: '0 8px 25px rgba(239, 68, 68, 0.4)',
                        },
                      }}
                    >
                      <MdLogout size={20} />
                    </IconButton>
                  </Zoom>
                </Box>
              </Fade>
            ) : (
              <Zoom in timeout={800} style={{ transitionDelay: '400ms' }}>
                <Link to="/auth" style={{ textDecoration: 'none' }}>
                  <Box
                    component="button"
                    sx={{
                      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                      color: 'white',
                      px: 3,
                      py: 1.5,
                      borderRadius: '20px',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      animation: `${pulseGlow} 3s ease-in-out infinite`,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                        transform: 'translateY(-3px) scale(1.05)',
                        boxShadow: '0 15px 35px rgba(59, 130, 246, 0.6)',
                        animation: 'none',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: `
                          linear-gradient(
                            90deg, 
                            transparent, 
                            rgba(255, 255, 255, 0.2), 
                            transparent
                          )
                        `,
                        transition: 'left 0.6s',
                      },
                      '&:hover::before': {
                        left: '100%',
                      },
                    }}
                  >
                    Sign In
                  </Box>
                </Link>
              </Zoom>
            )}
          </Box>
        </Slide>
      </Box>
    </Fade>
  );
};

export default Navbar;