import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
} from '@mui/material';
import { AddPhotoAlternate } from '@mui/icons-material';
import { exhibitActions } from '../../api/exhibitActions';

export const NewPostPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setError('Please select an image file');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage || !description.trim()) {
      setError('Please select an image and add a description');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('description', description.trim());

      await exhibitActions.createPost(formData);
      navigate('/my-posts');
    } catch (err) {
      console.error('Failed to create post:', err);
      setError('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Post
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleImageSelect}
        />

        <Card 
          sx={{ 
            mb: 2, 
            p: 2, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          {previewUrl ? (
            <CardMedia
              component="img"
              image={previewUrl}
              alt="Selected image"
              sx={{ 
                width: '100%',
                maxHeight: 400,
                objectFit: 'contain'
              }}
            />
          ) : (
            <Box 
              sx={{ 
                p: 4, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                color: 'text.secondary'
              }}
            >
              <AddPhotoAlternate sx={{ fontSize: 48, mb: 2 }} />
              <Typography>Click to select an image</Typography>
            </Box>
          )}
        </Card>

        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          required
          multiline
          rows={4}
          disabled={loading}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading || !selectedImage || !description.trim()}
          sx={{ mt: 3 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Create Post'}
        </Button>
      </Box>
    </Container>
  );
};
