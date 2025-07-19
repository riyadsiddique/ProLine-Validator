import { AuthService } from '../../services/AuthService';
import { SuperAdmin } from '../../models/SuperAdmin';
import { Admin } from '../../models/Admin';
import { getRepository } from 'typeorm';
import { hash } from 'bcrypt';

jest.mock('typeorm', () => ({
  getRepository: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  
  beforeEach(() => {
    authService = new AuthService();
  });

  describe('validateSuperAdmin', () => {
    it('should validate super admin credentials and return token', async () => {
      const mockSuperAdmin = new SuperAdmin();
      mockSuperAdmin.id = '123';
      mockSuperAdmin.email = 'super@admin.com';
      mockSuperAdmin.passwordHash = await hash('password123', 10);

      (getRepository as jest.Mock).mockReturnValue({
        findOne: jest.fn().mockResolvedValue(mockSuperAdmin),
      });

      const result = await authService.validateSuperAdmin('super@admin.com', 'password123');

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('admin');
      expect(result.admin.email).toBe('super@admin.com');
    });
  });
});
