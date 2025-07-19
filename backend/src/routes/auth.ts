import { Router } from 'express';
import { AuthService } from '../services/AuthService';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const authService = new AuthService();

// Super Admin login
router.post('/super-admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.validateSuperAdmin(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// Admin login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.validateAdmin(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// Create admin (Super Admin only)
router.post('/admin', authMiddleware(['super_admin']), async (req, res) => {
  try {
    const { email, password, name, bankName } = req.body;
    const admin = await authService.createAdmin(email, password, name, bankName);
    res.status(201).json(admin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
