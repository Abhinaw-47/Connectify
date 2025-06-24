import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../actions/message';
import {
  Box,
  Paper,
  IconButton,
  InputBase,
  Tooltip,
  Avatar,
} from '@mui/material';
import { FaPaperPlane, FaImage } from 'react-icons/fa';

const ChatInput = () => {
  const [post, setPost] = useState({ image: '', text: '' });
  const { selectedUser } = useSelector((state) => state.message);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!post.text.trim() && !post.image) return;
    dispatch(sendMessage(selectedUser._id, post));
    setPost({ image: '', text: '' });
  };

  const handleInputChange = (e) => {
    setPost({ ...post, text: e.target.value });
  };

  return (
    <Box
      px={2}
      py={2}
      sx={{
        background: 'linear-gradient(135deg,#0f172a,#1e293b)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {post.image && (
        <Box
          position="relative"
          display="inline-block"
          mb={1.5}
          ml={1}
        >
          <img
            src={post.image}
            alt="preview"
            style={{ maxWidth: '6rem', maxHeight: '6rem', borderRadius: 12 }}
          />
          <IconButton
            size="small"
            onClick={() => setPost((prev) => ({ ...prev, image: '' }))}
            sx={{
              position: 'absolute',
              top: -8,
              right: -8,
              bgcolor: 'red',
              color: 'white',
              '&:hover': { bgcolor: 'darkred' },
              width: 20,
              height: 20,
              fontSize: 12,
              zIndex: 1,
            }}
          >
            ×
          </IconButton>
        </Box>
      )}

      <form onSubmit={handleSubmit}>
        <Paper
          component="div"
          elevation={3}
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 2,
            py: 1,
            borderRadius: 4,
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Upload Image */}
          <Tooltip title="Add Photo">
            <IconButton
              onClick={() => fileInputRef.current?.click()}
              sx={{ color: '#8b5cf6' }}
            >
              <FaImage />
            </IconButton>
          </Tooltip>

          {/* Message Text Input */}
          <InputBase
            sx={{
              ml: 1,
              flex: 1,
              color: 'white',
              '&::placeholder': { color: '#aaa' },
            }}
            placeholder="Type your message..."
            value={post.text}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />

          {/* Send Button */}
          <Tooltip title="Send Message">
            <span>
              <IconButton
                type="submit"
                disabled={!post.text.trim() && !post.image}
                sx={{
                  color: post.text.trim() || post.image ? 'white' : '#555',
                  bgcolor:
                    post.text.trim() || post.image
                      ? 'linear-gradient(to right, #3b82f6, #9333ea)'
                      : 'rgba(255,255,255,0.05)',
                  p: 1.2,
                  borderRadius: 2,
                }}
              >
                <FaPaperPlane />
              </IconButton>
            </span>
          </Tooltip>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            hidden
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setPost((prev) => ({ ...prev, image: reader.result }));
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </Paper>
      </form>
    </Box>
  );
};

export default ChatInput;
