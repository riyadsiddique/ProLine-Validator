import { getRepository } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SuperAdmin } from '../models/SuperAdmin';
import { Admin } from '../models/Admin';

export class AuthService {
  private superAdminRepository = getRepository(SuperAdmin);
  private adminRepository = getRepository(Admin);

  async validateSuperAdmin(email: string, password: string): Promise<{ token: string; admin: SuperAdmin }> {
    const admin = await this.superAdminRepository.findOne({ where: { email } });
    if (!admin) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await compare(password, admin.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(admin.id, 'super_admin');
    return { token, admin };
  }

  async validateAdmin(email: string, password: string): Promise<{ token: string; admin: Admin }> {
    const admin = await this.adminRepository.findOne({ where: { email, status: 'active' } });
    if (!admin) {
      throw new Error('Invalid credentials or account suspended');
    }

    const isValidPassword = await compare(password, admin.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(admin.id, 'admin');
    return { token, admin };
  }

  async createSuperAdmin(email: string, password: string, name: string): Promise<SuperAdmin> {
    const existingAdmin = await this.superAdminRepository.findOne({ where: { email } });
    if (existingAdmin) {
      throw new Error('Email already registered');
    }

    const passwordHash = await hash(password, 10);
    const admin = this.superAdminRepository.create({
      email,
      name,
      passwordHash
    });

    return this.superAdminRepository.save(admin);
  }

  async createAdmin(email: string, password: string, name: string, bankName: string): Promise<Admin> {
    const existingAdmin = await this.adminRepository.findOne({ where: { email } });
    if (existingAdmin) {
      throw new Error('Email already registered');
    }

    const passwordHash = await hash(password, 10);
    const admin = this.adminRepository.create({
      email,
      name,
      bankName,
      passwordHash,
      status: 'active'
    });

    return this.adminRepository.save(admin);
  }

  private generateToken(userId: string, role: string): string {
    return sign(
      { userId, role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );
  }
}
