import { getRepository } from 'typeorm';
import { DeviceCode } from '../models/DeviceCode';
import crypto from 'crypto';

export class DeviceCodeService {
  private deviceCodeRepository = getRepository(DeviceCode);

  async generateCodes(quantity: number, price: number): Promise<DeviceCode[]> {
    const codes: DeviceCode[] = [];

    for (let i = 0; i < quantity; i++) {
      const code = new DeviceCode();
      code.code = this.generateSecureCode();
      code.price = price;
      code.status = 'available';
      codes.push(code);
    }

    return this.deviceCodeRepository.save(codes);
  }

  async sellCode(codeId: string, adminId: string): Promise<DeviceCode> {
    const code = await this.deviceCodeRepository.findOne({ where: { id: codeId, status: 'available' } });
    if (!code) {
      throw new Error('Code not available');
    }

    code.status = 'sold';
    code.soldTo = adminId;
    return this.deviceCodeRepository.save(code);
  }

  async getCodeDetails(code: string): Promise<DeviceCode> {
    const deviceCode = await this.deviceCodeRepository.findOne({ where: { code } });
    if (!deviceCode) {
      throw new Error('Device code not found');
    }
    return deviceCode;
  }

  private generateSecureCode(): string {
    return crypto.randomBytes(8).toString('hex').toUpperCase();
  }
}
