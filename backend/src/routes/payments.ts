import { Router } from 'express';
import { PaymentService } from '../services/PaymentService';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const paymentService = new PaymentService();

// Create payment schedule
router.post('/schedule', authMiddleware(['admin']), async (req, res) => {
  try {
    const { deviceCodeId, totalAmount, installments } = req.body;
    const schedule = await paymentService.createPaymentSchedule(
      deviceCodeId,
      totalAmount,
      installments
    );
    res.status(201).json(schedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Process payment
router.post('/:paymentId', authMiddleware(['admin']), async (req, res) => {
  try {
    const { amount } = req.body;
    const payment = await paymentService.processPayment(req.params.paymentId, amount);
    res.json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Check payment status
router.get('/device/:deviceId', authMiddleware(['admin', 'super_admin']), async (req, res) => {
  try {
    const status = await paymentService.checkPaymentStatus(req.params.deviceId);
    res.json(status);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
