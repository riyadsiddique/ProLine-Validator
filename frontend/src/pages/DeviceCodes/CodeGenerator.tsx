import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
} from '@mui/material';
import { QrCode } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { generateDeviceCodes } from '../../store/slices/deviceSlice';
import SessionInfo from '../../components/Common/SessionInfo';

const CodeGenerator: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.device);
  const { user } = useAppSelector((state) => state.auth);

  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(100);
  const [generatedCodes, setGeneratedCodes] = useState<any[]>([]);

  const handleGenerate = async () => {
    try {
      const result = await dispatch(generateDeviceCodes({ quantity, price })).unwrap();
      setGeneratedCodes(result.codes);
    } catch (err) {
      console.error('Failed to generate codes:', err);
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">Generate Device Codes</Typography>
          <SessionInfo username={user?.name || 'Guest'} />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            type="number"
            label="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            InputProps={{ inputProps: { min: 1 } }}
            sx={{ width: 200 }}
          />
          <TextField
            type="number"
            label="Price ($)"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            InputProps={{ inputProps: { min: 0 } }}
            sx={{ width: 200 }}
          />
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <QrCode />}
            onClick={handleGenerate}
            disabled={loading || quantity < 1}
          >
            Generate Codes
          </Button>
        </Box>

        {generatedCodes.length > 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {generatedCodes.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell>
                      <Typography variant="mono">{code.code}</Typography>
                    </TableCell>
                    <TableCell>${code.price}</TableCell>
                    <TableCell>{code.status}</TableCell>
                    <TableCell>
                      {new Date(code.createdAt).toLocaleString()}
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

export default CodeGenerator;
