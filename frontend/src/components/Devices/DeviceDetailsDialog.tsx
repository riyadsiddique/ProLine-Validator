import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  CircularProgress,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { registerDevice, updateDevice } from '../../store/slices/deviceSlice';
import { Device } from '../../types/device';
import { AppDispatch } from '../../store';

interface DeviceDetailsDialogProps {
  open: boolean;
  device: Device | null;
  onClose: () => void;
  onSave: () => void;
}

const DeviceDetailsDialog: React.FC<DeviceDetailsDialogProps> = ({
  open,
  device,
  onClose,
  onSave,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<Partial<Device>>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (device) {
      setFormData(device);
    } else {
      setFormData({});
    }
    setErrors({});
  }, [device]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.deviceId) {
      newErrors.deviceId = 'Device ID is required';
    }
    if (!formData.model) {
      newErrors.model = 'Model is required';
    }
    if (!formData.manufacturer) {
      newErrors.manufacturer = 'Manufacturer is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (device?.id) {
        await dispatch(updateDevice({ id: device.id, ...formData }));
      } else {
        await dispatch(registerDevice(formData));
      }
      onSave();
    } catch (error) {
      console.error('Error saving device:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Device) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {device?.id ? 'Edit Device' : 'Register New Device'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Device ID"
              value={formData.deviceId || ''}
              onChange={handleChange('deviceId')}
              error={!!errors.deviceId}
              helperText={errors.deviceId}
              disabled={!!device?.id}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Model"
              value={formData.model || ''}
              onChange={handleChange('model')}
              error={!!errors.model}
              helperText={errors.model}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Manufacturer"
              value={formData.manufacturer || ''}
              onChange={handleChange('manufacturer')}
              error={!!errors.manufacturer}
              helperText={errors.manufacturer}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Android Version"
              value={formData.androidVersion || ''}
              onChange={handleChange('androidVersion')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="IMEI"
              value={formData.imei || ''}
              onChange={handleChange('imei')}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isRooted || false}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isRooted: e.target.checked,
                    })
                  }
                />
              }
              label="Device is Rooted"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {device?.id ? 'Update' : 'Register'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeviceDetailsDialog;
