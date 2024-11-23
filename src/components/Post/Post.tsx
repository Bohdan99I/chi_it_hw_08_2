import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardActions, 
  CardMedia, 
  Typography, 
  Box,
  IconButton,
  Skeleton,
  Dialog,
  DialogContent
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { IPost } from '../../types';


import CommentIcon from '@mui/icons-material/Comment';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import { CommentSection } from '../CommentSection/CommentSection';
import { PostForm } from '../PostForm/PostForm';

interface PostProps {
  post: IPost;
  onDelete?: (postId: number) => void;
  onEdit?: (postId: number) => void;
}

export const Post: React.FC<PostProps> = ({ post, onDelete, onEdit }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const isOwner = user?.id === post.user.id;
  const baseUrl = 'http://ec2-13-49-67-34.eu-north-1.compute.amazonaws.com';

  const handleDelete = () => {
    if (onDelete) {
      onDelete(post.id);
    }
  };

  const handleEdit = () => {
    setOpenEditDialog(true);
  };

  const handleComments = () => {
    setShowComments(!showComments);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleEditSuccess = () => {
    if (onEdit) {
      onEdit(post.id);
    }
    setOpenEditDialog(false);
  };

  return (
    <>
      <Card sx={{ mb: 2 }}>
        <Box sx={{ position: 'relative' }}>
          {!imageLoaded && (
            <Skeleton 
              variant="rectangular" 
              height={400} 
              animation="wave"
              sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}
            />
          )}
          <CardMedia
            component="img"
            height="400"
            image={`${baseUrl}${post.imageUrl}`}
            alt={post.description}
            sx={{ 
              objectFit: 'cover',
              cursor: 'pointer',
              filter: 'brightness(0.9)',
              transition: 'filter 0.3s ease-in-out',
              '&:hover': {
                filter: 'brightness(1)'
              }
            }}
            onLoad={handleImageLoad}
            onClick={handleOpenDialog}
          />
          <IconButton
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)'
              }
            }}
            onClick={handleOpenDialog}
          >
            <ZoomInIcon />
          </IconButton>
        </Box>
        <CardContent>
          <Typography variant="body1" color="text.primary" gutterBottom>
            {post.description}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Posted by: {post.user.username}
          </Typography>
          <Typography variant="caption" display="block">
            Comments: {post.commentCount}
          </Typography>
          {post.createdAt && (
            <Typography variant="caption" display="block">
              Posted on: {new Date(post.createdAt).toLocaleDateString()}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
            <IconButton onClick={handleComments}>
              <CommentIcon />
            </IconButton>
            {isOwner && (
              <>
                <IconButton onClick={handleEdit} color="primary">
                  <Edit />
                </IconButton>
                <IconButton onClick={handleDelete} color="error">
                  <Delete />
                </IconButton>
              </>
            )}
          </Box>
        </CardActions>
        {showComments && <CommentSection postId={post.id} />}
      </Card>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent>
          <img
            src={`${baseUrl}${post.imageUrl}`}
            alt={post.description}
            style={{ width: '100%', height: 'auto' }}
          />
        </DialogContent>
      </Dialog>

      <PostForm
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        onSuccess={handleEditSuccess}
        post={post}
      />
    </>
  );
};
