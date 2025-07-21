export interface Device {
  id: string;
  deviceId: string;
  model: string;
  manufacturer: string;
  androidVersion: string;
  imei: string;
  isRooted: boolean;
  status: 'active' | 'locked' | 'pending' | 'warning';
  lastValidation: string;
  deviceCodeId?: string;
  createdAt?: string;
  updatedAt?: string;
}
