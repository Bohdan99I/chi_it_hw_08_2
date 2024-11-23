import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography
} from '@mui/material';
import { IPost } from '../../types';
import { exhibitActions } from '../../api/exhibitActions';

interface PostFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  post?: IPost;
}

export const PostForm: React.FC<PostFormProps> = ({
  open,
  onClose,
  onSuccess,
  post
}) => {
  const [description, setDescription] = useState(post?.description || '');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('description', description);
      if (image) {
        formData.append('image', image);
      }

      if (post) {
        await exhibitActions.updatePost(post.id, { description });
      } else {
        await exhibitActions.createPost(formData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save post:', error);
      setError('Failed to save post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{post ? 'Edit Post' : 'Create New Post'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Description"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            {!post && (
              <Box>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) setImage(file);
                  }}
                  style={{ display: 'none' }}
                  id="image-upload"
                  required
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                  >
                    Choose Image
                  </Button>
                </label>
                {image && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Selected: {image.name}
                  </Typography>
                )}
              </Box>
            )}
            {error && (
              <Box color="error.main" mt={1}>
                {error}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !description.trim() || (!post && !image)}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
