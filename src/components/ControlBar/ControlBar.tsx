import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { logout } from '../../store/slices/userSlice';

export const ControlBar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button color="inherit" onClick={() => navigate('/')}>
          All Posts
        </Button>
        <Typography variant="h6" component="div" sx={{ textAlign: 'center', flexGrow: 1 }}>
          {user ? `Hello ${user.username} !!!` : 'Blog App'}
        </Typography>
        <Box>
          {user ? (
            <>
              <Button color="inherit" onClick={() => navigate('/my-posts')}>
                My Posts
              </Button>
              <Button color="inherit" onClick={() => navigate('/new-post')}>
                New Post
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
