import React from 'react';
import { useSelector } from 'react-redux';
import Post from './post/Post';
import {
  CircularProgress,
  Box,
  Typography,
  Paper,
  Avatar,
  Grid,
} from '@mui/material';
import { MdExplore } from 'react-icons/md';

const Posts = ({ setCurrentId, setShowForm }) => {
  const { posts, isLoading } = useSelector((state) => state.post);
  

  const EmptyState = () => (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="60vh"
      textAlign="center"
      px={2}
    >
      <Avatar sx={{ bgcolor: '#6366f1', width: 64, height: 64, mb: 2 }}>
        <MdExplore size={32} />
      </Avatar>
      <Typography variant="h6" sx={{ color: '#fff' }}>
        No posts found
      </Typography>
      <Typography variant="body2" sx={{ color: '#aaa', mt: 1 }}>
        Looks like there's nothing here yet.
      </Typography>
    </Box>
  );

  const LoadingState = () => (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="70vh"
      textAlign="center"
      px={2}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #1e1e2f, #0f0c29)',
          color: 'white',
        }}
      >
        <CircularProgress color="primary" sx={{ mb: 3 }} />
        <Typography variant="h6">Loading Posts...</Typography>
      </Paper>
    </Box>
  );

  if (!posts?.length && !isLoading) return <EmptyState />;
  if (isLoading) return <LoadingState />;

  return (
    <Grid
  container
  spacing={3}
  justifyContent="center" // this ensures it's centered when fewer columns
  sx={{ width: '100%', margin: 0 }} // prevent overflow
>

      {posts.map((post) => (
        <Grid item xs={12} md={6} key={post._id}>
          <Box
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 3,
              p: 2,
              boxShadow: 3,
              height: '100%',
            }}
          >
            <Post post={post} setCurrentId={setCurrentId} setShowForm={setShowForm} />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default Posts;
