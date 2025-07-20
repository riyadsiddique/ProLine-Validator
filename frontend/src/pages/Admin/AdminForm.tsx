import React from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '../../store/hooks';
import { createAdmin, updateAdmin } from '../../store/slices/adminSlice';

interface AdminFormProps {
  admin?: any;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters'),
  bankName: Yup.string().required('Bank name is required'),
  role: Yup.string().oneOf(['admin', 'super_admin']).required('Role is required'),
});

const AdminForm: React.FC<AdminFormProps> = ({ admin, onClose, onSubmitSuccess }) => {
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      name: admin?.name || '',
      email: admin?.email || '',
      password: '',
      bankName: admin?.bankName || '',
      role: admin?.role || 'admin',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (admin) {
          await dispatch(updateAdmin({ id: admin.id, ...values })).unwrap();
        } else {
          await dispatch(createAdmin(values)).unwrap();
        }
        onSubmitSuccess();
      } catch (error) {
        console.error('Failed to save admin:', error);
      }
    },
  });

  return (
    <>
      <DialogTitle>
        {admin ? 'Edit Admin' : 'Add New Admin'}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="name"
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="bankName"
                label="Bank Name"
                value={formik.values.bankName}
                onChange={formik.handleChange}
                error={formik.touched.bankName && Boolean(formik.errors.bankName)}
                helperText={formik.touched.bankName && formik.errors.bankName}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  label="Role"
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
          <Button type="submit" variant="contained" color="primary">
            {admin ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </>
  );
};

export default AdminForm;
