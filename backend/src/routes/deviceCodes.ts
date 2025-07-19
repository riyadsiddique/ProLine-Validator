import { Router } from 'express';
import { DeviceCodeService } from '../services/DeviceCodeService';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const deviceCodeService = new DeviceCodeService();

// Generate new device codes (Super Admin only)
router.post('/generate', authMiddleware(['super_admin']), async (req, res) => {
  try {
    const { quantity, price } = req.body;
    const codes = await deviceCodeService.generateCodes(quantity, price);
    res.status(201).json(codes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Sell device code to admin
router.post('/:codeId/sell', authMiddleware(['super_admin']), async (req, res) => {
  try {
    const { codeId } = req.params;
    const { adminId } = req.body;
    const code = await deviceCodeService.sellCode(codeId, adminId);
    res.json(code);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get device code details
router.get('/:code', authMiddleware(['admin', 'super_admin']), async (req, res) => {
  try {
    const code = await deviceCodeService.getCodeDetails(req.params.code);
    res.json(code);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
