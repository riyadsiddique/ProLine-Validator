// Add to existing admin.ts
export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  activity: string;
  type: string;
  ipAddress: string;
  status: 'success' | 'error';
  details: any;
}

export interface AdminPermission {
  id: string;
  name: string;
  description: string;
  category: string;
}
