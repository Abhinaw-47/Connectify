import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMessages } from '../actions/message';
import ChatInput from './ChatInput';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Avatar,
  useMediaQuery,
} from '@mui/material';
import { FaUserCircle, FaPaperPlane, FaTimes } from 'react-icons/fa';
import { connectSocket, getSocket } from '../api';

const ChatContainer = () => {
  const dispatch = useDispatch();
  const { isMsgLoading, selectedUser, messages } = useSelector((s) => s.message);
  const { onlineUsers } = useSelector((s) => s.auth);
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const subscribe = useCallback(() => {
    if (!selectedUser) return;
    const socket = connectSocket();
    socket.off('receiveMessage');
    socket.on('receiveMessage', (msg) =>
      dispatch({ type: 'SEND_MESSAGE', payload: msg })
    );
  }, [selectedUser, dispatch]);

  const unsubscribe = useCallback(() => {
    const socket = getSocket();
    if (socket) socket.off('receiveMessage');
  }, [selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      dispatch(getMessages(selectedUser._id));
      subscribe();
    }
    return unsubscribe;
  }, [selectedUser, dispatch, subscribe, unsubscribe]);

  const fmtTime = (t) =>
    new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const fmtDate = (t) => {
    const d = new Date(t),
      td = new Date(),
      yd = new Date(td.setDate(td.getDate() - 1));
    if (d.toDateString() === new Date().toDateString()) return 'Today';
    if (d.toDateString() === yd.toDateString()) return 'Yesterday';
    return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const withSeps = (messages || []).reduce((acc, m, i, arr) => {
    const prev = arr[i - 1];
    if (!i || new Date(prev.createdAt).toDateString() !== new Date(m.createdAt).toDateString()) {
      acc.push({ type: 'sep', date: m.createdAt, id: `sep-${i}` });
    }
    acc.push({ ...m, type: 'msg', id: m._id });
    return acc;
  }, []);

  if (!selectedUser) {
    return (
      <Box flex={1} display="flex" alignItems="center" justifyContent="center"
        sx={{ background: 'linear-gradient(135deg,#000,#2a003f)', height: '100vh' }}>
        <Paper elevation={6} sx={{
          p: 4, textAlign: 'center', borderRadius: 3,
          background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)'
        }}>
          <FaPaperPlane size={48} color="#8b5cf6" />
          <Typography mt={2} variant="h6" color="white">Start a Conversation</Typography>
          <Typography color="#ccc">Select a friend on the left</Typography>
        </Paper>
      </Box>
    );
  }

  if (isMsgLoading) {
    return (
      <Box flex={1} display="flex" alignItems="center" justifyContent="center"
        sx={{ background: 'linear-gradient(135deg,#000,#2a003f)', height: '100vh' }}>
        <CircularProgress sx={{ color: '#8b5cf6' }} />
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      sx={{
        background: 'linear-gradient(135deg,#000,#2a003f)',
        color: 'white',
      }}
    >
      {/* Header */}
      <Paper
        elevation={4}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 1.5,
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Box display="flex" alignItems="center">
          <Avatar
            sx={{
              mr: 1,
              width: 48,
              height: 48,
              background: 'linear-gradient(to right, #6366f1, #9333ea)',
              boxShadow: '0 0 10px rgba(147, 51, 234, 0.5)',
            }}
          >
            <FaUserCircle size={24} color="#fff" />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600 }}>
              {selectedUser.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: onlineUsers.includes(selectedUser._id) ? '#4ade80' : '#888',
                fontWeight: 400,
              }}
            >
              {onlineUsers.includes(selectedUser._id) ? 'Active now' : 'Offline'}
            </Typography>
          </Box>
        </Box>

        {/* Close button for small screen */}
        {isSmallScreen && (
          <FaTimes
            size={20}
            onClick={() => dispatch({ type: 'SELECT_USER', payload: null })}
            style={{
              cursor: 'pointer',
              color: '#aaa',
              transition: 'color 0.2s ease-in-out',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#ff5f5f')}
            onMouseOut={(e) => (e.currentTarget.style.color = '#aaa')}
          />
        )}
      </Paper>

      {/* Messages */}
      <Box
        flex={1}
        overflow="auto"
        px={2}
        py={1}
        sx={{
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(6px)',
          minHeight: 0,
        }}
      >
        {withSeps.length === 0 ? (
          <Box
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <FaPaperPlane size={42} color="#8b5cf6" />
            <Typography mt={1} color="#ccc">No messages yet</Typography>
            <Typography variant="caption" color="#666">Start the conversation</Typography>
          </Box>
        ) : (
          withSeps.map(({ type, date, ...msg }) =>
            type === 'sep' ? (
              <Box key={msg.id} textAlign="center" my={2}>
                <Paper elevation={1} sx={{
                  display: 'inline-block', px: 2, py: 0.5, borderRadius: 2,
                  background: 'rgba(255,255,255,0.1)'
                }}>
                  <Typography variant="caption" color="#ccc">{fmtDate(date)}</Typography>
                </Paper>
              </Box>
            ) : (
              <Box key={msg._id} display="flex"
                justifyContent={msg.senderId === selectedUser._id ? 'flex-start' : 'flex-end'} mb={1}>
                <Paper sx={{
                  p: 1.5, borderRadius: 2, maxWidth: '60%',
                  background: msg.senderId === selectedUser._id
                    ? 'rgba(100,100,100,0.5)'
                    : 'linear-gradient(135deg,#3b82f6,#9333ea)'
                }}>
                  <Typography color="white">{msg.text}</Typography>
                  <Typography variant="caption" color="rgba(255,255,255,0.7)" align="right">
                    {fmtTime(msg.createdAt)}
                  </Typography>
                </Paper>
              </Box>
            )
          )
        )}
      </Box>

      {/* Chat Input */}
      <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <ChatInput />
      </Box>
    </Box>
  );
};

export default ChatContainer;
