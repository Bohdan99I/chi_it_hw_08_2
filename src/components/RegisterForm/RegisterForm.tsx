import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { register, clearError } from '../../store/slices/userSlice';
import { RootState, AppDispatch } from '../../store/store';

interface ValidationErrors {
  username?: string;
  password?: string;
}

export const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state: RootState) => state.user);

  useEffect(() => {   
    dispatch(clearError());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    // Username validation
    if (!username) {
      errors.username = 'Username is required';
      isValid = false;
    } else if (username.length < 3) {
      errors.username = 'Username must be at least 3 characters long';
      isValid = false;
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await dispatch(register({ username, password }));
      if (register.fulfilled.match(result)) {
        navigate('/');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
        Create Account
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        autoComplete="username"
        autoFocus
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={!!validationErrors.username}
        helperText={validationErrors.username}
        disabled={loading || isSubmitting}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        id="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!validationErrors.password}
        helperText={validationErrors.password}
        disabled={loading || isSubmitting}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleTogglePasswordVisibility}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading || isSubmitting}
      >
        {(loading || isSubmitting) ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CircularProgress size={24} sx={{ mr: 1 }} />
            Creating Account...
          </Box>
        ) : (
          'Create Account'
        )}
      </Button>
    </Box>
  );
};
