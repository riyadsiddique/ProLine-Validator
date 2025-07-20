
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin';
  bankName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceCode {
  id: string;
  code: string;
  price: number;
  status: 'available' | 'sold' | 'activated';
  soldTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Device {
  id: string;
  deviceId: string;
  model: string;
  manufacturer: string;
  androidVersion: string;
  imei: string;
  isRooted: boolean;
  status: 'active' | 'locked' | 'unlocked';
  deviceCodeId: string;
  deviceCode: DeviceCode;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  dueDate: string;
  paidDate?: string;
  deviceCodeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
