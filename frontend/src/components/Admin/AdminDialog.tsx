import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { createAdmin, updateAdmin } from '../../store/slices/adminSlice';
import { AppDispatch } from '../../store';
import { Admin } from '../../types/admin';

interface AdminDialogProps {
  open: boolean;
  admin: Admin | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  bankName?: string;
}

const AdminDialog: React.FC<AdminDialogProps> = ({
  open,
  admin,
  onClose,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<Partial<Admin>>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (admin) {
      setFormData({
        ...admin,
        password: '', // Clear password field for security
      });
    } else {
      setFormData({});
    }
    setErrors({});
    setApiError(null);
  }, [admin]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!admin?.id && !formData.password?.trim()) {
      newErrors.password = 'Password is required';
    } else if (
      formData.password &&
      formData.password.length < 8
    ) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.bankName?.trim()) {
      newErrors.bankName = 'Bank name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setApiError(null);

    try {
      if (admin?.id) {
        await dispatch(updateAdmin({ id: admin.id, ...formData })).unwrap();
      } else {
        await dispatch(createAdmin(formData)).unwrap();
      }
      onSuccess();
    } catch (error) {
      setApiError(error.message || 'Failed to save admin');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Admin) => (
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
        {admin?.id ? 'Edit Admin' : 'Create New Admin'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {apiError && (
            <Grid item xs={12}>
              <Alert severity="error">{apiError}</Alert>
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name || ''}
              onChange={handleChange('name')}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange('email')}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bank Name"
              value={formData.bankName || ''}
              onChange={handleChange('bankName')}
              error={!!errors.bankName}
              helperText={errors.bankName}
            />
          </Grid>
          {(!admin?.id || formData.password) && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={admin?.id ? 'New Password' : 'Password'}
                type="password"
                value={formData.password || ''}
                onChange={handleChange('password')}
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role || 'admin'}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as string })
                }
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="super_admin">Super Admin</MenuItem>
              </Select>
            </FormControl>
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
          {admin?.id ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminDialog;
