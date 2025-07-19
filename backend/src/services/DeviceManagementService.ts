import { getRepository } from 'typeorm';
import { Device } from '../models/Device';
import { DeviceCode } from '../models/DeviceCode';
import { Payment } from '../models/Payment';

export class DeviceManagementService {
  private deviceRepository = getRepository(Device);
  private deviceCodeRepository = getRepository(DeviceCode);
  private paymentRepository = getRepository(Payment);

  async registerDevice(registrationData: {
    deviceId: string;
    model: string;
    manufacturer: string;
    androidVersion: string;
    imei: string;
    isRooted: boolean;
    deviceCode: string;
  }): Promise<Device> {
    const { deviceCode: code, ...deviceData } = registrationData;

    // Validate device code
    const codeEntity = await this.deviceCodeRepository.findOne({
      where: { code, status: 'sold' }
    });

    if (!codeEntity) {
      throw new Error('Invalid or unused device code');
    }

    // Check if device is already registered
    const existingDevice = await this.deviceRepository.findOne({
      where: { deviceId: deviceData.deviceId }
    });

    if (existingDevice) {
      throw new Error('Device already registered');
    }

    // Create device entry
    const device = this.deviceRepository.create({
      ...deviceData,
      deviceCodeId: codeEntity.id,
      status: 'active'
    });

    // Update device code status
    codeEntity.status = 'activated';
    await this.deviceCodeRepository.save(codeEntity);

    return this.deviceRepository.save(device);
  }

  async checkDeviceStatus(deviceId: string): Promise<{
    status: string;
    lockReason?: string;
    nextPaymentDate?: Date;
  }> {
    const device = await this.deviceRepository.findOne({
      where: { deviceId },
      relations: ['deviceCode']
    });

    if (!device) {
      throw new Error('Device not found');
    }

    const pendingPayments = await this.paymentRepository.find({
      where: { deviceCodeId: device.deviceCodeId, status: 'pending' },
      order: { dueDate: 'ASC' }
    });

    if (pendingPayments.length > 0) {
      const nextPayment = pendingPayments[0];
      const now = new Date();
      
      if (nextPayment.dueDate < now) {
        device.status = 'locked';
        await this.deviceRepository.save(device);
      }

      return {
        status: device.status,
        nextPaymentDate: nextPayment.dueDate
      };
    }

    return { status: device.status };
  }

  async lockDevice(deviceId: string, reason: string): Promise<Device> {
    const device = await this.deviceRepository.findOne({ where: { deviceId } });
    if (!device) {
      throw new Error('Device not found');
    }

    device.status = 'locked';
    return this.deviceRepository.save(device);
  }

  async unlockDevice(deviceId: string): Promise<Device> {
    const device = await this.deviceRepository.findOne({ where: { deviceId } });
    if (!device) {
      throw new Error('Device not found');
    }

    device.status = 'unlocked';
    return this.deviceRepository.save(device);
  }
}
