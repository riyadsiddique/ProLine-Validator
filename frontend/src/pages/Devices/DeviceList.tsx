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
  Chip,
  IconButton,
  Button,
  Tooltip,
} from '@mui/material';
import {
  Lock,
  LockOpen,
  Visibility,
  Add as AddIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchDevices } from '../../store/slices/deviceSlice';
import TimeDisplay from '../../components/Common/TimeDisplay';
import { Device } from '../../types';

const DeviceList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { devices, loading, total } = useAppSelector((state) => state.device);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchDevices({ page: page + 1, pageSize: rowsPerPage }));
  }, [dispatch, page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusChipColor = (status: Device['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'locked':
        return 'error';
      case 'unlocked':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Device Management</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TimeDisplay />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {/* Handle add device */}}
            >
              Add Device
            </Button>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Device ID</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Manufacturer</TableCell>
                <TableCell>Android Version</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {devices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell>{device.deviceId}</TableCell>
                  <TableCell>{device.model}</TableCell>
                  <TableCell>{device.manufacturer}</TableCell>
                  <TableCell>{device.androidVersion}</TableCell>
                  <TableCell>
                    <Chip 
                      label={device.status}
                      color={getStatusChipColor(device.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(device.updatedAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton size="small" onClick={() => {/* Handle view */}}>
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {device.status === 'active' ? (
                      <Tooltip title="Lock Device">
                        <IconButton size="small" color="error" onClick={() => {/* Handle lock */}}>
                          <Lock fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Unlock Device">
                        <IconButton size="small" color="success" onClick={() => {/* Handle unlock */}}>
                          <LockOpen fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default DeviceList;
