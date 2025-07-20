import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../../types';
import { apiService } from '../../services/api';
import { LOCAL_STORAGE_KEYS } from '../../config/constants';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER) || 'null'),
  token: localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN),
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, role }: { email: string; password: string; role: 'admin' | 'super_admin' }) => {
    const response = await apiService.post(`/auth/${role}/login`, { email, password });
    return response;
  }
);

export const createAdmin = createAsyncThunk(
  'auth/createAdmin',
  async (data: { email: string; password: string; name: string; bankName: string }) => {
    const response = await apiService.post('/auth/admin', data);
    return response;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
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
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, action.payload.token);
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
