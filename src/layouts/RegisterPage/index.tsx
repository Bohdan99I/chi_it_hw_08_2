import React from 'react';
import { Container, Paper, Box, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { RegisterForm } from '../../components/RegisterForm/RegisterForm';

export const RegisterPage: React.FC = () => {
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
          <RegisterForm />
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link component={RouterLink} to="/login" variant="body2">
              Already have an account? Sign In
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
