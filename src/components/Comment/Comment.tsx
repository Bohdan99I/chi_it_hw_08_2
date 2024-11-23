import React, { useState } from 'react';
import { Card, CardContent, CardActions, Typography, IconButton, TextField, Box } from '@mui/material';
import { Delete, Edit, Save, Cancel } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { IComment } from '../../types';

interface CommentProps {
  comment: IComment;
  onDelete: () => void;
  onEdit: (content: string) => void;
}

export const Comment: React.FC<CommentProps> = ({ comment, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.text);
  const user = useSelector((state: RootState) => state.user.user);
  const isOwner = user?.id === comment.user.id;

  const handleSave = () => {
    if (editContent.trim()) {
      onEdit(editContent);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditContent(comment.text);
    setIsEditing(false);
  };

  return (
    <Card sx={{ mb: 2, bgcolor: 'grey.100' }}>
      <CardContent>
        {isEditing ? (
          <Box>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <IconButton
                size="small"
                onClick={handleSave}
                disabled={!editContent.trim()}
                color="primary"
              >
                <Save fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleCancel}
                color="default"
              >
                <Cancel fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ) : (
          <>
            <Typography variant="body1">
              {comment.text}
            </Typography>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              By {comment.user.username} on {new Date(comment.createdAt).toLocaleDateString()}
            </Typography>
          </>
        )}
      </CardContent>
      {isOwner && !isEditing && (
        <CardActions>
          <Box sx={{ ml: 'auto' }}>
            <IconButton size="small" color="primary" onClick={() => setIsEditing(true)}>
              <Edit fontSize="small" />
            </IconButton>
            <IconButton size="small" color="error" onClick={onDelete}>
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        </CardActions>
      )}
    </Card>
  );
};
