import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userActions } from '../../api/userActions';
import { IUser, LoginCredentials, RegisterCredentials } from '../../types';

interface UserState {
  user: IUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'user/login',
  async (credentials: LoginCredentials) => {
    return await userActions.login(credentials);
  }
);

export const register = createAsyncThunk(
  'user/register',
  async (credentials: RegisterCredentials) => {
    return await userActions.register(credentials);
  }
);

export const getCurrentUser = createAsyncThunk(
  'user/getCurrentUser',
  async () => {
    return await userActions.getCurrentUser();
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      userActions.logout();
      state.user = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to login';
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to register';
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
      });
  },
});

export const { logout, clearError } = userSlice.actions;
export default userSlice.reducer;
