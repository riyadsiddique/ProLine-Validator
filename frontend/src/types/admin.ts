export interface Admin {
  id: string;
  name: string;
  email: string;
  bankName: string;
  role: 'admin' | 'super_admin';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  password?: string;
}
