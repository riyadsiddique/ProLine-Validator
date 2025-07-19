import { getRepository } from 'typeorm';
import { Payment } from '../models/Payment';
import { Device } from '../models/Device';
import { DeviceCode } from '../models/DeviceCode';

export class PaymentService {
  private paymentRepository = getRepository(Payment);
  private deviceRepository = getRepository(Device);
  private deviceCodeRepository = getRepository(DeviceCode);

  async createPaymentSchedule(deviceCodeId: string, totalAmount: number, installments: number): Promise<Payment[]> {
    const payments: Payment[] = [];
    const installmentAmount = totalAmount / installments;
    const currentDate = new Date();

    for (let i = 0; i < installments; i++) {
      const payment = new Payment();
      payment.deviceCodeId = deviceCodeId;
      payment.amount = installmentAmount;
      payment.dueDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
      payment.status = 'pending';
      payments.push(payment);
    }

    return this.paymentRepository.save(payments);
  }

  async processPayment(paymentId: string, amount: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: ['deviceCode']
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status === 'completed') {
      throw new Error('Payment already completed');
    }

    if (amount < payment.amount) {
      throw new Error('Insufficient payment amount');
    }

    payment.status = 'completed';
    payment.paidDate = new Date();
    await this.paymentRepository.save(payment);

    // Check if all payments are completed
    const allPayments = await this.paymentRepository.find({
      where: { deviceCodeId: payment.deviceCodeId }
    });

    const allCompleted = allPayments.every(p => p.status === 'completed');
    if (allCompleted) {
      const device = await this.deviceRepository.findOne({
        where: { deviceCodeId: payment.deviceCodeId }
      });
      if (device) {
        device.status = 'unlocked';
        await this.deviceRepository.save(device);
      }
    }

    return payment;
  }

  async checkPaymentStatus(deviceId: string): Promise<{
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    nextDueDate: Date | null;
    isLocked: boolean;
  }> {
    const device = await this.deviceRepository.findOne({
      where: { deviceId },
      relations: ['deviceCode']
    });

    if (!device) {
      throw new Error('Device not found');
    }

    const payments = await this.paymentRepository.find({
      where: { deviceCodeId: device.deviceCodeId }
    });

    const totalAmount = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
    const paidAmount = payments
      .filter(payment => payment.status === 'completed')
      .reduce((sum, payment) => sum + Number(payment.amount), 0);
    const remainingAmount = totalAmount - paidAmount;

    const pendingPayments = payments
      .filter(payment => payment.status === 'pending')
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

    const nextDueDate = pendingPayments.length > 0 ? pendingPayments[0].dueDate : null;

    return {
      totalAmount,
      paidAmount,
      remainingAmount,
      nextDueDate,
      isLocked: device.status === 'locked'
    };
  }
}
