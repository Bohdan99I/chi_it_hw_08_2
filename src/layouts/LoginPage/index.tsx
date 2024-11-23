import React from 'react';
import { Container, Paper, Box, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { LoginForm } from '../../components/LoginForm/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <LoginForm />
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link component={RouterLink} to="/register" variant="body2">
              Don't have an account? Sign Up
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
