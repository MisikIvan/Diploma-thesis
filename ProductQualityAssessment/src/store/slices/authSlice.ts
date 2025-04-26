import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../../types';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const signInWithEmail = createAsyncThunk(
  'auth/signInWithEmail',
  async ({ email, password }: { email: string; password: string }) => {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    const userData = await firestore().collection('users').doc(userCredential.user.uid).get();
    return userData.data() as User;
  }
);

export const signUpWithEmail = createAsyncThunk(
  'auth/signUpWithEmail',
  async ({ email, password, name }: { email: string; password: string; name: string }) => {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const user: User = {
      id: userCredential.user.uid,
      email,
      name,
      role: 'user',
      status: 'active',
      authMethod: 'email',
      createdAt: new Date().toISOString(),
    };
    await firestore().collection('users').doc(user.id).set(user);
    return user;
  }
);

export const signInWithGoogle = createAsyncThunk(
  'auth/signInWithGoogle',
  async () => {
    // Implement Google Sign-In logic here
    throw new Error('Google Sign-In not implemented yet');
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async () => {
    await auth().signOut();
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signInWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to sign in';
      })
      .addCase(signUpWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signUpWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to sign up';
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer; 