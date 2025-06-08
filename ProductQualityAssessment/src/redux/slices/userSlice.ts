import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/index';
import {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
  logoutUser,
  getCurrentUser,
  resetPassword
} from '../../api/firebase';

interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null
};

export const register = createAsyncThunk(
  'user/register',
  async ({ email, password, displayName }: { email: string; password: string; displayName: string }) => {
    return await registerWithEmail(email, password, displayName);
  }
);

export const login = createAsyncThunk(
  'user/login',
  async ({ email, password }: { email: string; password: string }) => {
    return await loginWithEmail(email, password);
  }
);

export const googleLogin = createAsyncThunk(
  'user/googleLogin',
  async () => {
    return await loginWithGoogle();
  }
);

export const logout = createAsyncThunk(
  'user/logout',
  async () => {
    await logoutUser();
    return null;
  }
);

export const checkAuth = createAsyncThunk(
  'user/checkAuth',
  async () => {
    return await getCurrentUser();
  }
);

export const passwordReset = createAsyncThunk(
  'user/passwordReset',
  async (email: string) => {
    await resetPassword(email);
    return email;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      
      // Google Login
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Google login failed';
      })
      
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.currentUser = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Logout failed';
      })
      
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Auth check failed';
      })
      
      // Password Reset
      .addCase(passwordReset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(passwordReset.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(passwordReset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Password reset failed';
      });
  }
});

export const { clearError, updateUser } = userSlice.actions;
export default userSlice.reducer; 