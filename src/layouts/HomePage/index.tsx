import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import Add from '@mui/icons-material/Add';
import { Post } from '../../components/Post/Post';
import { Pagination } from '../../components/Pagination/Pagination';
import { PostForm } from '../../components/PostForm/PostForm';
import { exhibitActions } from '../../api/exhibitActions';
import { IPost } from '../../types';

export const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await exhibitActions.getMyPosts(page);
      setPosts(response.posts);
      setTotalPages(Math.ceil(response.total / 10));
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const handleDeletePost = async (postId: number) => {
    try {
      await exhibitActions.deletePost(postId);
      fetchPosts();
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          My Posts
        </Typography>
        <Button
          variant="contained"
          onClick={() => setOpenCreateDialog(true)}
          startIcon={<Add />}
        >
          Create Post
        </Button>
      </Box>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          {posts.length === 0 ? (
            <Typography>You haven't created any posts yet.</Typography>
          ) : (
            posts.map((post) => (
              <Post
                key={post.id}
                post={post}
                onDelete={() => handleDeletePost(post.id)}
              />
            ))
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(value) => setPage(value)}
            />
          )}
        </>
      )}
      <PostForm
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSuccess={fetchPosts}
      />
    </Container>
  );
};
