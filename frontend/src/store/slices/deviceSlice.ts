import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Device, DeviceCode, PaginatedResponse } from '../../types';
import { apiService } from '../../services/api';

interface DeviceState {
  devices: Device[];
  deviceCodes: DeviceCode[];
  selectedDevice: Device | null;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
}

const initialState: DeviceState = {
  devices: [],
  deviceCodes: [],
  selectedDevice: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  pageSize: 10,
};

export const fetchDevices = createAsyncThunk(
  'device/fetchDevices',
  async ({ page, pageSize }: { page: number; pageSize: number }) => {
    const response = await apiService.get<PaginatedResponse<Device>>('/devices', { page, pageSize });
    return response;
  }
);

export const generateDeviceCodes = createAsyncThunk(
  'device/generateCodes',
  async ({ quantity, price }: { quantity: number; price: number }) => {
    const response = await apiService.post('/device-codes/generate', { quantity, price });
    return response;
  }
);

export const registerDevice = createAsyncThunk(
  'device/register',
  async (deviceData: Partial<Device>) => {
    const response = await apiService.post('/devices/register', deviceData);
    return response;
  }
);

const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    setSelectedDevice: (state, action) => {
      state.selectedDevice = action.payload;
    },
    clearSelectedDevice: (state) => {
      state.selectedDevice = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch devices';
      });
  },
});

export const { setSelectedDevice, clearSelectedDevice } = deviceSlice.actions;
export default deviceSlice.reducer;
