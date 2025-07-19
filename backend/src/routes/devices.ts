import { Router } from 'express';
import { DeviceManagementService } from '../services/DeviceManagementService';
import { SecurityService } from '../services/SecurityService';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const deviceService = new DeviceManagementService();
const securityService = new SecurityService();

// Register new device
router.post('/register', async (req, res) => {
  try {
    const device = await deviceService.registerDevice(req.body);
    res.status(201).json(device);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Check device status
router.get('/:deviceId/status', async (req, res) => {
  try {
    const status = await deviceService.checkDeviceStatus(req.params.deviceId);
    res.json(status);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Security check
router.post('/:deviceId/security-check', async (req, res) => {
  try {
    const isSecure = await securityService.validateDeviceSecurity(
      req.params.deviceId,
      req.body
    );
    res.json({ isSecure });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Lock device (Admin only)
router.post('/:deviceId/lock', authMiddleware(['admin', 'super_admin']), async (req, res) => {
  try {
    const { reason } = req.body;
    const device = await deviceService.lockDevice(req.params.deviceId, reason);
    res.json(device);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Unlock device (Admin only)
router.post('/:deviceId/unlock', authMiddleware(['admin', 'super_admin']), async (req, res) => {
  try {
    const device = await deviceService.unlockDevice(req.params.deviceId);
    res.json(device);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
