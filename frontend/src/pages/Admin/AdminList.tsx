import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  Chip,
  Dialog,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAdmins, deleteAdmin } from '../../store/slices/adminSlice';
import FormattedTimeDisplay from '../../components/Common/FormattedTimeDisplay';
import AdminForm from './AdminForm';

const AdminList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { admins, total, loading } = useAppSelector((state) => state.admin);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchAdmins({ page: page + 1, pageSize: rowsPerPage }));
  }, [dispatch, page, rowsPerPage]);

  const handleAddAdmin = () => {
    setSelectedAdmin(null);
    setOpenDialog(true);
  };

  const handleEditAdmin = (admin: any) => {
    setSelectedAdmin(admin);
    setOpenDialog(true);
  };

  const handleDeleteAdmin = async (adminId: string) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        await dispatch(deleteAdmin(adminId)).unwrap();
        dispatch(fetchAdmins({ page: page + 1, pageSize: rowsPerPage }));
      } catch (error) {
        console.error('Failed to delete admin:', error);
      }
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">Admin Management</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormattedTimeDisplay />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddAdmin}
            >
              Add Admin
            </Button>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Bank Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.bankName}</TableCell>
                  <TableCell>
                    <Chip
                      label={admin.role}
                      color={admin.role === 'super_admin' ? 'secondary' : 'primary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(admin.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleEditAdmin(admin)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteAdmin(admin.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <AdminForm
          admin={selectedAdmin}
          onClose={() => setOpenDialog(false)}
          onSubmitSuccess={() => {
            setOpenDialog(false);
            dispatch(fetchAdmins({ page: page + 1, pageSize: rowsPerPage }));
          }}
        />
      </Dialog>
    </Box>
  );
};

export default AdminList;
