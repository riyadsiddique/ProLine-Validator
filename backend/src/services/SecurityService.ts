import { getRepository } from 'typeorm';
import { Device } from '../models/Device';
import crypto from 'crypto';

export class SecurityService {
  private deviceRepository = getRepository(Device);

  async validateDeviceSecurity(deviceId: string, securityData: {
    rootStatus: boolean;
    bootloaderStatus: boolean;
    safetyNetStatus: boolean;
  }): Promise<boolean> {
    const device = await this.deviceRepository.findOne({ where: { deviceId } });
    
    if (!device) {
      throw new Error('Device not found');
    }

    // Check for root status change
    if (device.isRooted !== securityData.rootStatus) {
      await this.lockDevice(device, 'Root status changed');
      return false;
    }

    // Check bootloader status
    if (!securityData.bootloaderStatus) {
      await this.lockDevice(device, 'Bootloader unlocked');
      return false;
    }

    // Check SafetyNet attestation
    if (!securityData.safetyNetStatus) {
      await this.lockDevice(device, 'SafetyNet check failed');
      return false;
    }

    return true;
  }

  private async lockDevice(device: Device, reason: string): Promise<void> {
    device.status = 'locked';
    await this.deviceRepository.save(device);
  }

  generateDeviceToken(deviceId: string): string {
    const timestamp = Date.now();
    const data = `${deviceId}:${timestamp}`;
    return crypto
      .createHmac('sha256', process.env.DEVICE_SECRET!)
      .update(data)
      .digest('hex');
  }

  validateDeviceToken(deviceId: string, token: string): boolean {
    // TODO: Implement proper token validation with timestamp checking
    return true;
  }
}
