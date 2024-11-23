import React, { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Box } from '@mui/material';
import { Post } from '../../components/Post/Post';
import { Pagination } from '../../components/Pagination/Pagination';
import { exhibitActions } from '../../api/exhibitActions';
import { IPost } from '../../types';

export const StripePage: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await exhibitActions.getAllPosts(page);
      console.log('Fetched posts:', response);
      setPosts(response.posts);
      setTotalPages(Math.ceil(response.total / 10));
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setError('Failed to load posts. Please try again later.');
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
      setError('Failed to delete post. Please try again later.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        All Posts
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center" my={4}>
          {error}
        </Typography>
      ) : posts.length === 0 ? (
        <Typography align="center" my={4}>
          No posts found.
        </Typography>
      ) : (
        <>
          {posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              onDelete={handleDeletePost}
            />
          ))}
          {totalPages > 1 && (
            <Box mt={4} display="flex" justifyContent="center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};
