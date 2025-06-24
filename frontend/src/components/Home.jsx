import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Button,
  Modal,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FaSearch, FaComments, FaUpload } from 'react-icons/fa';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';

import Form from './Form';
import Posts from './Posts/Posts';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getPostsBySearch } from '../actions/post';
import { connectSocket } from '../api';
import { fetchUsers } from '../actions/message';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const NAVBAR_HEIGHT = 20; // adjust if your navbar has a different height

const Home = ({ showForm, setShowForm }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [currentId, setCurrentId] = useState(0);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const [search, setSearch] = useState('');
  const query = useQuery();
  const searchQuery = query.get('searchQuery');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = () => {
    if (search.trim()) {
      dispatch(getPostsBySearch({ search }));
      navigate(`/posts/search?searchQuery=${search}`);
    } else {
      navigate('/');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/');
  };

  useEffect(() => {
    if (searchQuery) {
      dispatch(getPostsBySearch({ search: searchQuery }));
    }
  }, [dispatch, searchQuery]);

  useEffect(() => {
    const currUser = JSON.parse(localStorage.getItem('profile'));
    setUser(currUser);
    if (currUser) connectSocket();
    dispatch(fetchUsers())
  }, [location]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #2a003f 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: isSmallScreen ? 'column' : 'row',
      }}
    >
      {/* Sidebar */}
     {user && (
  <Box
    sx={{
      position: isSmallScreen ? 'relative' : 'fixed',
      top: isSmallScreen ? 0 : `${88}px`,
      left: 0,
      width: isSmallScreen ? '100%' : '220px',
      height: isSmallScreen ? 'auto' : `calc(100vh - ${NAVBAR_HEIGHT}px)`,
      p: 2,
      bgcolor: 'rgba(255, 255, 255, 0.05)',
      borderRight: isSmallScreen ? 'none' : '1px solid #333',
      display: 'flex',
      flexDirection: isSmallScreen ? 'row' : 'column',
      alignItems: 'center',
      gap: 2,
      zIndex: 1000,
    }}
  >
    <Button
      variant="contained"
      startIcon={<FaUpload />}
      onClick={() => setShowForm(true)}
      sx={{
        bgcolor: '#6b21a8',
        px: 2,
        py: 1,
        minWidth: isSmallScreen ? 'auto' : '160px',
      }}
    >
      {!isSmallScreen && 'Upload'}
    </Button>

    <Button
      variant="contained"
      startIcon={<FaComments />}
      onClick={() => navigate('/chat')}
      sx={{
        bgcolor: '#1d4ed8',
        px: 2,
        py: 1,
        minWidth: isSmallScreen ? 'auto' : '160px',
      }}
    >
      {!isSmallScreen && 'Chat'}
    </Button>

    <Button
      variant="contained"
      startIcon={<LogoutIcon />}
      onClick={handleLogout}
      sx={{
        bgcolor: '#dc2626',
        px: 2,
        py: 1,
        mt: isSmallScreen ? 0 : '220%',
        minWidth: isSmallScreen ? 'auto' : '160px',
      }}
    >
      {!isSmallScreen && 'Sign Out'}
    </Button>
  </Box>
)}


      {/* Main Content */}
      <Box
  sx={{
    ml: user ? (isSmallScreen ? 0 : '220px') : 0,
    mt: isSmallScreen ? 0 : `${NAVBAR_HEIGHT}px`,
    width: user
      ? isSmallScreen
        ? '100%'
        : 'calc(100% - 220px)'
      : '100%',
    px: user ? 2 : 0,
    pt: 3,
    pb: 6,
    display: 'flex',
    flexDirection: 'column',
    alignItems: user ? 'stretch' : 'center', // center align if no user
  }}
>

        {/* Search Bar */}
        <Paper
          elevation={6}
          sx={{
            mb: 3,
            bgcolor: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(8px)',
            borderRadius: 3,
            px: 2,
            py: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <TextField
            variant="standard"
            fullWidth
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            InputProps={{
              disableUnderline: true,
              sx: { color: 'white' },
              endAdornment: (
                <IconButton onClick={handleSearch}>
                  <FaSearch color="white" />
                </IconButton>
              ),
            }}
          />
        </Paper>

        {/* Posts */}
        <Posts setCurrentId={setCurrentId} setShowForm={setShowForm} />

        {/* Upload Modal */}
        <Modal
          open={showForm}
          onClose={() => setShowForm(false)}
          aria-labelledby="upload-form"
          closeAfterTransition
          slotProps={{
            backdrop: {
              timeout: 300,
              sx: { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
            },
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
          }}
        >
          <Paper
            sx={{
              width: '100%',
              maxWidth: 600,
              maxHeight: '90vh',
              overflowY: 'auto',
              p: 3,
              position: 'relative',
              borderRadius: 3,
              background: 'linear-gradient(135deg, #0f172a, #1f2937)',
              color: 'white',
              boxShadow: 24,
            }}
          >
            <IconButton
              onClick={() => setShowForm(false)}
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                color: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
            <Form
              currentId={currentId}
              setCurrentId={setCurrentId}
              setShowForm={setShowForm}
            />
          </Paper>
        </Modal>

        {/* Footer */}
        <Box sx={{ borderTop: '1px solid #444', mt: 4, py: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="white">
            © 2025 CONNECTIFY by ABHINAW ANAND. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
