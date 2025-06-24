import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { FaThumbsUp, FaTrash, FaEdit, FaHeart, FaPlay } from 'react-icons/fa';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { deletePost, likePost } from '../../../actions/post';
import { useLocation } from 'react-router-dom';

const Post = ({ post, setCurrentId, setShowForm }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('profile')));
  const [isLiked, setIsLiked] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const profile = localStorage.getItem('profile');
    setUser(profile ? JSON.parse(profile) : null);
  }, [location]);

  useEffect(() => {
    if (user?.result && post.likes) {
      setIsLiked(post.likes.includes(user.result._id) || post.likes.includes(user.result.googleId));
    }
  }, [user, post.likes]);

  const handleLike = () => {
    dispatch(likePost(post._id));
  };

  const handleDelete = () => {
    dispatch(deletePost(post._id));
    setShowDeleteConfirm(false);
  };

  const editHandler = () => {
    setCurrentId(post._id);
    setShowForm(true);
  };

  const isVideo = post.selectedFile?.startsWith('data:video');
  const isOwner = user?.result?.googleId === post?.creator || user?.result?._id === post?.creator;

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          maxWidth: 520,
          mx: '40px',
          my: 4,
          borderRadius: 4,
          background: 'rgba(22, 0, 35, 0.8)',
          backdropFilter: 'blur(12px)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 0 24px rgba(139, 92, 246, 0.3)',
          overflow: 'hidden',
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 0 32px rgba(168, 85, 247, 0.5)',
          },
        }}
      >
        {/* Media */}
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          {isVideo ? (
            <video
              src={post.selectedFile}
              controls
              style={{
                width: '100%',
                height: 300,
                objectFit: 'cover',
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16
              }}
            />
          ) : (
            <img
              src={post.selectedFile}
              alt="Post"
              style={{
                width: '100%',
                height: 300,
                objectFit: 'cover',
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16
              }}
            />
          )}
        </Box>

        {/* Content */}
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {post.name}
              </Typography>
              <Typography variant="caption" color="gray">
                {moment(post.createdAt).fromNow()}
              </Typography>
            </Box>
            {isOwner && (
              <Button
                size="small"
                variant="outlined"
                onClick={editHandler}
                sx={{
                  borderRadius: 2,
                  color: '#8b5cf6',
                  borderColor: '#8b5cf6',
                  fontSize: 12,
                  textTransform: 'none',
                }}
                startIcon={<FaEdit size={12} />}
              >
                Edit
              </Button>
            )}
          </Box>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: 18,
              mb: 1,
              color: '#e0e0ff',
            }}
          >
            {post.title}
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: '#c0c0c0', mb: 2, lineHeight: 1.6 }}
          >
            {post.description}
          </Typography>

          {/* Tags */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {post.tags.map((tag, i) => (
              <Chip
                key={i}
                label={`#${tag}`}
                size="small"
                sx={{
                  background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                  color: 'white',
                  fontWeight: 500,
                  borderRadius: 2,
                  px: 1,
                }}
              />
            ))}
          </Box>

          {/* Actions */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pt: 2,
              borderTop: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {/* Like Button */}
            {user?.result ? (
              <Button
                onClick={handleLike}
                startIcon={isLiked ? <FaHeart /> : <FaThumbsUp />}
                sx={{
                  background: isLiked
                    ? 'linear-gradient(135deg, #dc2626, #b91c1c)'
                    : 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: isLiked ? 'white' : '#cccccc',
                  borderRadius: 3,
                  px: 2,
                  fontSize: 14,
                  textTransform: 'none',
                  transition: 'all 0.3s',
                  '&:hover': {
                    background: isLiked
                      ? 'linear-gradient(135deg, #b91c1c, #7f1d1d)'
                      : 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                {post.likes?.length || 0} {post.likes?.length === 1 ? 'Like' : 'Likes'}
              </Button>
            ) : (
              <Typography variant="body2" color="gray">
                <FaHeart style={{ marginRight: 6 }} />
                {post.likes?.length || 0} Likes
              </Typography>
            )}

            {/* Delete Button */}
            {isOwner && (
              <Button
                onClick={() => setShowDeleteConfirm(true)}
                startIcon={<FaTrash />}
                sx={{
                  color: '#ef4444',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 3,
                  px: 2,
                  fontSize: 14,
                  textTransform: 'none',
                  background: 'rgba(255,255,255,0.05)',
                  '&:hover': {
                    background: '#7f1d1d',
                    color: 'white',
                  },
                }}
              >
                Delete
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Delete Confirm Dialog */}
      <Dialog open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this post? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Post;
