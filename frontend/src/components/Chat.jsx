import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, CircularProgress, Avatar, List, ListItemButton, ListItemText, ListItemAvatar, Divider, Paper } from '@mui/material';
import { FaUserCircle, FaComments } from 'react-icons/fa';
import ChatContainer from './ChatContainer';
import { connectSocket } from '../api';

const Chat = () => {
  const dispatch = useDispatch();
  const { users, isUserLoading, selectedUser } = useSelector((state) => state.message);
  const { onlineUsers } = useSelector((state) => state.auth);

  useEffect(() => {
    const socket = connectSocket();
    socket.on('getOnlineUsers', (UserIds) => {
      dispatch({ type: 'SET_ONLINE_USERS', payload: UserIds });
    });
  }, [dispatch]);

  if (isUserLoading) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" sx={{ background: 'linear-gradient(135deg, #000000 0%, #2a003f 100%)' }}>
        <Box textAlign="center">
          <CircularProgress sx={{ color: '#8b5cf6' }} />
          <Typography mt={2} color="white">Loading users...</Typography>
        </Box>
      </Box>
    );
  }

  if (!users?.length) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" sx={{ background: 'linear-gradient(135deg, #000000 0%, #2a003f 100%)' }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3, textAlign: 'center', background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(6px)' }}>
          <FaUserCircle size={50} color="#aaa" />
          <Typography mt={2} variant="h6" color="white">No Users Available</Typography>
          <Typography variant="body2" color="#ccc">Start by adding some friends to chat with</Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box display="flex" minHeight="100vh" sx={{ background: 'linear-gradient(135deg, #000000 0%, #2a003f 100%)', color: 'white' }}>
      {/* User List */}
      <Box width={{ xs: '100%', sm: '35%' }} sx={{ borderRight: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)', px: 2, py: 2 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Box p={1} bgcolor="#8b5cf6" borderRadius={2}><FaComments color="white" /></Box>
          <Box>
            <Typography fontWeight="bold" color="white">Messages</Typography>
            <Typography variant="body2" color="#ccc">{users.length} contacts</Typography>
          </Box>
        </Box>

        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)', mb: 2 }} />

        <List>
          {users.map((user) => (
            <ListItemButton
              key={user._id}
              onClick={() => dispatch({ type: 'SELECT_USER', payload: user })}
              sx={{
                borderRadius: 2,
                mb: 1,
                background:
                  selectedUser?._id === user._id
                    ? 'linear-gradient(135deg, #3b82f6, #9333ea)'
                    : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.05)',
                },
              }}
            >
              <ListItemAvatar>
                <Box position="relative">
                  <Avatar sx={{ bgcolor: '#6366f1' }}>
                    <FaUserCircle />
                  </Avatar>
                  <Box
                    position="absolute"
                    bottom={0}
                    right={0}
                    width={12}
                    height={12}
                    borderRadius="50%"
                    border="2px solid #1e1e2f"
                    bgcolor={onlineUsers.includes(user._id) ? 'green' : 'gray'}
                  />
                </Box>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography color="white" noWrap>{user.name}</Typography>}
                secondary={<Typography variant="caption" color={onlineUsers.includes(user._id) ? 'lightgreen' : '#aaa'}>{onlineUsers.includes(user._id) ? 'Online' : 'Offline'}</Typography>}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Chat Area */}
      <Box flex={1} sx={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)' }}>
        <ChatContainer />
      </Box>
    </Box>
  );
};

export default Chat;
