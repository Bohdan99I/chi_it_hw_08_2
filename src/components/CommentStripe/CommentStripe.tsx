import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { Comment } from '../Comment/Comment';
import { Pagination } from '../Pagination/Pagination';
import { commentActions } from '../../api/commentActions';
import { IComment } from '../../types';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface CommentStripeProps {
  postId: number;
}

export const CommentStripe: React.FC<CommentStripeProps> = ({ postId }) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.user.user);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await commentActions.getComments(postId, page);
      setComments(response.comments);
      setTotalPages(Math.ceil(response.total / 10));
      setError(null);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId, page]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      await commentActions.createComment(postId, newComment.trim());
      setNewComment('');
      await fetchComments();
      setError(null);
    } catch (error) {
      console.error('Failed to add comment:', error);
      setError('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      setLoading(true);
      await commentActions.deleteComment(postId, commentId);
      await fetchComments();
      setError(null);
    } catch (error) {
      console.error('Failed to delete comment:', error);
      setError('Failed to delete comment');
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = async (commentId: number, content: string) => {
    try {
      setLoading(true);
      await commentActions.updateComment(postId, commentId, content);
      await fetchComments();
      setError(null);
    } catch (error) {
      console.error('Failed to edit comment:', error);
      setError('Failed to edit comment');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography>Please log in to view and add comments.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Comments
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={loading}
          sx={{ mb: 1 }}
        />
        <Button
          variant="contained"
          onClick={handleAddComment}
          disabled={loading || !newComment.trim()}
        >
          {loading ? <CircularProgress size={20} /> : 'Post Comment'}
        </Button>
      </Box>

      {loading && comments.length === 0 ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : comments.length === 0 ? (
        <Typography color="text.secondary">No comments yet.</Typography>
      ) : (
        <>
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onDelete={() => handleDeleteComment(comment.id)}
              onEdit={(content: string) => handleEditComment(comment.id, content)}
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
    </Box>
  );
};
