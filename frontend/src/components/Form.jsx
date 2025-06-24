import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, updatedPost } from '../actions/post';
import { MdOutlineBackup, MdRestartAlt } from 'react-icons/md';

const Form = ({ currentId, setCurrentId, setShowForm }) => {
  const dispatch = useDispatch();
  const [postData, setPostData] = useState({
    title: '',
    description: '',
    tags: '',
    selectedFile: '',
  });

  const post = useSelector((state) =>
    currentId ? state.post.posts.find((post) => post._id === currentId) : null
  );
  const user = JSON.parse(localStorage.getItem('profile'));

  useEffect(() => {
    if (post) setPostData(post);
  }, [post]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentId === 0) {
      dispatch(createPost({ ...postData, name: user?.result.name }));
    } else {
      dispatch(updatedPost(currentId, { ...postData, name: user?.result.name }));
    }
    setShowForm(false);
    handleClear();
  };

  const handleClear = () => {
    setCurrentId(0);
    setPostData({ title: '', description: '', tags: '', selectedFile: '' });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper
        elevation={12}
        sx={{
          width: '100%',
          maxWidth: 600,
          maxHeight: '90vh',
          overflowY: 'auto',
          p: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #0f172a, #1f2937)', // match Modal background
          color: 'white',
          boxShadow: 24,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          sx={{
            textAlign: 'center',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {currentId ? 'Edit Post' : 'Create New Post'}
        </Typography>

        <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            required
            value={postData.title}
            onChange={(e) => setPostData({ ...postData, title: e.target.value })}
            sx={{ mb: 2 }}
            InputProps={{ style: { color: '#fff' } }}
            InputLabelProps={{ style: { color: '#9ca3af' } }}
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            required
            value={postData.description}
            onChange={(e) => setPostData({ ...postData, description: e.target.value })}
            sx={{ mb: 2 }}
            InputProps={{ style: { color: '#fff' } }}
            InputLabelProps={{ style: { color: '#9ca3af' } }}
          />
          <TextField
            label="Tags (comma separated)"
            variant="outlined"
            fullWidth
            value={postData.tags}
            onChange={(e) =>
              setPostData({ ...postData, tags: e.target.value.split(',') })
            }
            sx={{ mb: 2 }}
            InputProps={{ style: { color: '#fff' } }}
            InputLabelProps={{ style: { color: '#9ca3af' } }}
          />

          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setPostData({ ...postData, selectedFile: reader.result });
                };
                reader.readAsDataURL(file);
              }
            }}
            style={{
              marginBottom: '16px',
              color: '#ffffff',
              backgroundColor: '#1e293b',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.15)',
              width: '100%',
              cursor: 'pointer',
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            startIcon={<MdOutlineBackup />}
            sx={{
              mt: 1,
              background: 'linear-gradient(135deg, #4f46e5, #9333ea)',
              color: '#fff',
              fontWeight: 'bold',
              borderRadius: 3,
              '&:hover': {
                background: 'linear-gradient(135deg, #4338ca, #7e22ce)',
              },
            }}
          >
            Submit
          </Button>

          <Button
            type="button"
            fullWidth
            startIcon={<MdRestartAlt />}
            onClick={handleClear}
            sx={{
              mt: 2,
              backgroundColor: '#374151',
              color: '#f1f5f9',
              fontWeight: 'bold',
              borderRadius: 3,
              '&:hover': {
                backgroundColor: '#4b5563',
              },
            }}
          >
            Reset
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Form;
