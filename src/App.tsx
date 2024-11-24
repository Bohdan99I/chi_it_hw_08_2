import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './store/store';
import { getCurrentUser } from './store/slices/userSlice';
import { ControlBar } from './components/ControlBar/ControlBar';
import { StripePage } from './layouts/StripePage';
import { HomePage } from './layouts/HomePage';
import { LoginPage } from './layouts/LoginPage';
import { RegisterPage } from './layouts/RegisterPage';
import { NewPostPage } from './layouts/NewPostPage';
import { Container } from '@mui/material';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {    
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  return (
    <Router>
      <ControlBar />
      <Container>
        <Routes>
          <Route path="/" element={<StripePage />} />
          <Route
            path="/my-posts"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/new-post"
            element={
              <ProtectedRoute>
                <NewPostPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
