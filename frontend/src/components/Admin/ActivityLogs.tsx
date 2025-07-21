import React, { useState, useEffect } from 'react';
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
  TextField,
  MenuItem,
  Stack,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivityLogs } from '../../store/slices/adminSlice';
import { AppDispatch, RootState } from '../../store';
import { formatDistanceToNow } from 'date-fns';
import ActivityDetailsDialog from './ActivityDetailsDialog';

const activityTypes = [
  'login',
  'logout',
  'create_admin',
  'update_admin',
  'delete_admin',
  'update_permissions',
  'device_validation',
  'system_config',
];

const ActivityLogs: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { activityLogs, loading } = useSelector((state: RootState) => state.admin);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    type: '',
    user: '',
    dateFrom: '',
    dateTo: '',
  });
  const [selectedLog, setSelectedLog] = useState<any>(null);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilters({ ...filters, [field]: event.target.value });
    setPage(0);
  };

  const getActivityColor = (type: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (type) {
      case 'login':
      case 'logout':
        return 'info';
      case 'create_admin':
        return 'success';
      case 'delete_admin':
        return 'error';
      case 'update_permissions':
        return 'warning';
      case 'device_validation':
        return 'primary';
      default:
        return 'default';
    }
  };

  useEffect(() => {
    dispatch(fetchActivityLogs(filters));
  }, [dispatch, filters]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Activity Logs
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField
            select
            label="Activity Type"
            value={filters.type}
            onChange={handleFilterChange('type')}
            size="small"
            sx={{ width: 200 }}
          >
            <MenuItem value="">All Types</MenuItem>
            {activityTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type.replace('_', ' ').toUpperCase()}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="User"
            value={filters.user}
            onChange={handleFilterChange('user')}
            size="small"
            sx={{ width: 200 }}
          />

          <TextField
            type="date"
            label="From Date"
            value={filters.dateFrom}
            onChange={handleFilterChange('dateFrom')}
            size="small"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            type="date"
            label="To Date"
            value={filters.dateTo}
            onChange={handleFilterChange('dateTo')}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Stack>

        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Activity</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activityLogs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <TimeIcon fontSize="small" color="action" />
                        <Box>
                          <Typography variant="body2">
                            {new Date(log.timestamp).toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>
                      <Chip
                        label={log.activity}
                        size="small"
                        color={getActivityColor(log.type)}
                      />
                    </TableCell>
                    <TableCell>{log.ipAddress}</TableCell>
                    <TableCell>
                      <Chip
                        label={log.status}
                        size="small"
                        color={log.status === 'success' ? 'success' : 'error'}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => setSelectedLog(log)}
                        title="View Details"
                      >
                        <ViewIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={activityLogs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <ActivityDetailsDialog
        open={!!selectedLog}
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </Box>
  );
};

export default ActivityLogs;
