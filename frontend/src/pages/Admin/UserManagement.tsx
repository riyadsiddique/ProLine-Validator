import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as ActiveIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAdmins,
  updateAdminStatus,
} from '../../store/slices/adminSlice';
import { AppDispatch, RootState } from '../../store';
import AdminDialog from '../../components/Admin/AdminDialog';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import { Admin } from '../../types/admin';

const UserManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { admins, loading, error } = useSelector(
    (state: RootState) => state.admin
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    action: () => void;
  }>({
    open: false,
    title: '',
    message: '',
    action: () => {},
  });

  useEffect(() => {
    dispatch(fetchAdmins());
  }, [dispatch]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleStatusChange = (admin: Admin) => {
    const newStatus = admin.status === 'active' ? 'inactive' : 'active';
    const message = `Are you sure you want to ${
      newStatus === 'active' ? 'activate' : 'deactivate'
    } this admin account?`;

    setConfirmDialog({
      open: true,
      title: `${newStatus === 'active' ? 'Activate' : 'Deactivate'} Admin`,
      message,
      action: () => {
        dispatch(updateAdminStatus({ adminId: admin.id, status: newStatus }));
        setConfirmDialog({ ...confirmDialog, open: false });
      },
    });
  };

  const filteredAdmins = admins.filter((admin) =>
    Object.values(admin).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5" component="h1">
          Admin Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setSelectedAdmin({})}
        >
          Add New Admin
        </Button>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search admins..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          <IconButton onClick={() => dispatch(fetchAdmins())}>
            <RefreshIcon />
          </IconButton>
        </Box>

        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Bank Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAdmins
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((admin) => (
                  <TableRow key={admin.id} hover>
                    <TableCell>{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{admin.bankName}</TableCell>
                    <TableCell>
                      <Chip
                        label={admin.role}
                        size="small"
                        color={admin.role === 'super_admin' ? 'secondary' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={admin.status}
                        size="small"
                        color={admin.status === 'active' ? 'success' : 'error'}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => setSelectedAdmin(admin)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleStatusChange(admin)}
                          color={admin.status === 'active' ? 'error' : 'success'}
                        >
                          {admin.status === 'active' ? (
                            <BlockIcon />
                          ) : (
                            <ActiveIcon />
                          )}
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredAdmins.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <AdminDialog
        open={!!selectedAdmin}
        admin={selectedAdmin}
        onClose={() => setSelectedAdmin(null)}
        onSuccess={() => {
          setSelectedAdmin(null);
          dispatch(fetchAdmins());
        }}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.action}
        onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
      />
    </Box>
  );
};

export default UserManagement;
