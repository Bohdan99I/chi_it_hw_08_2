import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { Comment } from '../Comment/Comment';
import { exhibitActions } from '../../api/exhibitActions';
import { IComment } from '../../types';

interface CommentSectionProps {
  postId: number;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      const response = await exhibitActions.getComments(postId);
      setComments(response);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      setError('Failed to load comments');
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await exhibitActions.addComment(postId, newComment);
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Failed to add comment:', error);
      setError('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await exhibitActions.deleteComment(postId, commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment:', error);
      setError('Failed to delete comment');
    }
  };

  const handleEditComment = async (commentId: number, content: string) => {
    try {
      await exhibitActions.updateComment(postId, commentId, content);
      setComments(comments.map(comment =>
        comment.id === commentId ? { ...comment, content } : comment
      ));
    } catch (error) {
      console.error('Failed to update comment:', error);
      setError('Failed to update comment');
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Comments
      </Typography>

      <form onSubmit={handleAddComment}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !newComment.trim()}
          >
            Post
          </Button>
        </Box>
      </form>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          onDelete={() => handleDeleteComment(comment.id)}
          onEdit={(content) => handleEditComment(comment.id, content)}
        />
      ))}
    </Box>
  );
};
