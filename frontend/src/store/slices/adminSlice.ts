import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Admin } from '../../types/admin';
import { apiService } from '../../services/api';

interface AdminState {
  admins: Admin[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  admins: [],
  loading: false,
  error: null,
};

export const fetchAdmins = createAsyncThunk(
  'admin/fetchAdmins',
  async () => {
    const response = await apiService.get('/admins');
    return response.data;
  }
);

export const createAdmin = createAsyncThunk(
  'admin/createAdmin',
  async (adminData: Partial<Admin>) => {
    const response = await apiService.post('/admins', adminData);
    return response.data;
  }
);

export const updateAdmin = createAsyncThunk(
  'admin/updateAdmin',
  async ({ id, ...adminData }: Partial<Admin>) => {
    const response = await apiService.put(`/admins/${id}`, adminData);
    return response.data;
  }
);

export const updateAdminStatus = createAsyncThunk(
  'admin/updateAdminStatus',
  async ({ adminId, status }: { adminId: string; status: string }) => {
    const response = await apiService.patch(`/admins/${adminId}/status`, { status });
    return response.data;
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = action.payload;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch admins';
      })
      .addCase(createAdmin.fulfilled, (state, action) => {
        state.admins.push(action.payload);
      })
      .addCase(updateAdmin.fulfilled, (state, action) => {
        const index = state.admins.findIndex(
          (admin) => admin.id === action.payload.id
        );
        if (index !== -1) {
          state.admins[index] = action.payload;
        }
      })
      .addCase(updateAdminStatus.fulfilled, (state, action) => {
        const index = state.admins.findIndex(
          (admin) => admin.id === action.payload.id
        );
        if (index !== -1) {
          state.admins[index] = action.payload;
        }
      });
  },
});

export default adminSlice.reducer;
