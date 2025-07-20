import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material';
import { CalendarToday } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createPaymentSchedule } from '../../store/slices/paymentSlice';
import UTCTimeDisplay from '../../components/Common/UTCTimeDisplay';
import UserLoginInfo from '../../components/Common/UserLoginInfo';

const PaymentSchedule: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [deviceCode, setDeviceCode] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [installments, setInstallments] = useState('3');
  const [schedule, setSchedule] = useState<any[]>([]);
  const [error, setError] = useState('');

  const handleCreateSchedule = async () => {
    try {
      setError('');
      const result = await dispatch(createPaymentSchedule({
        deviceCode,
        totalAmount: Number(totalAmount),
        installments: Number(installments)
      })).unwrap();
      setSchedule(result.schedule);
    } catch (err: any) {
      setError(err.message || 'Failed to create payment schedule');
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">Payment Schedule</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <UserLoginInfo username={user?.name || 'Guest'} role={user?.role} />
            <UTCTimeDisplay />
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Device Code"
              value={deviceCode}
              onChange={(e) => setDeviceCode(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="number"
              label="Total Amount ($)"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="number"
              label="Number of Installments"
              value={installments}
              onChange={(e) => setInstallments(e.target.value)}
              InputProps={{ inputProps: { min: 1, max: 12 } }}
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          startIcon={<CalendarToday />}
          onClick={handleCreateSchedule}
          disabled={!deviceCode || !totalAmount || !installments}
          sx={{ mb: 3 }}
        >
          Create Schedule
        </Button>

        {schedule.length > 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Installment</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {schedule.map((payment, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>${payment.amount}</TableCell>
                    <TableCell>{new Date(payment.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Typography color="primary">Scheduled</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default PaymentSchedule;
