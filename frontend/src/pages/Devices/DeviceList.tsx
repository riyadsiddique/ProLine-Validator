import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Typography,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDevices, updateDeviceStatus } from '../../store/slices/deviceSlice';
import { AppDispatch, RootState } from '../../store';
import DeviceStatusBadge from '../../components/Devices/DeviceStatusBadge';
import DeviceDetailsDialog from '../../components/Devices/DeviceDetailsDialog';
import { Device } from '../../types/device';

const DeviceList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { devices, isLoading } = useSelector((state: RootState) => state.device);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  useEffect(() => {
    dispatch(fetchDevices());
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

  const handleRefresh = () => {
    dispatch(fetchDevices());
  };

  const handleDeviceAction = async (deviceId: string, action: 'lock' | 'unlock') => {
    try {
      await dispatch(updateDeviceStatus({ deviceId, status: action === 'lock' ? 'locked' : 'active' }));
      dispatch(fetchDevices());
    } catch (error) {
      console.error('Error updating device status:', error);
    }
  };

  const filteredDevices = devices.filter((device) =>
    Object.values(device).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredDevices.length) : 0;

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5" component="h1">
          Device Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setSelectedDevice({})}
        >
          Register New Device
        </Button>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search devices..."
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
          <IconButton onClick={handleRefresh} disabled={isLoading}>
            <RefreshIcon />
          </IconButton>
        </Box>

        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell>Device ID</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Manufacturer</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Validated</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDevices
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((device) => (
                  <TableRow key={device.id} hover>
                    <TableCell>{device.deviceId}</TableCell>
                    <TableCell>{device.model}</TableCell>
                    <TableCell>{device.manufacturer}</TableCell>
                    <TableCell>
                      <DeviceStatusBadge status={device.status} />
                    </TableCell>
                    <TableCell>
                      {new Date(device.lastValidation).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => setSelectedDevice(device)}
                        >
                          <EditIcon />
                        </IconButton>
                        {device.status === 'active' ? (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeviceAction(device.id, 'lock')}
                          >
                            <LockIcon />
                          </IconButton>
                        ) : (
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleDeviceAction(device.id, 'unlock')}
                          >
                            <UnlockIcon />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredDevices.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <DeviceDetailsDialog
        open={!!selectedDevice}
        device={selectedDevice}
        onClose={() => setSelectedDevice(null)}
        onSave={() => {
          setSelectedDevice(null);
          handleRefresh();
        }}
      />
    </Box>
  );
};

export default DeviceList;
