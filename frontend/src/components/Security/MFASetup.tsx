import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Grid,
  Alert,
  CircularProgress,
  Dialog,
} from '@mui/material';
import QRCode from 'qrcode.react';
import { useDispatch } from 'react-redux';
import { setupMFA, verifyMFAToken } from '../../store/slices/securitySlice';
import { AppDispatch } from '../../store';

interface MFASetupProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const MFASetup: React.FC<MFASetupProps> = ({ open, onClose, onComplete }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeStep, setActiveStep] = useState(0);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && activeStep === 0) {
      initializeMFA();
    }
  }, [open]);

  const initializeMFA = async () => {
    try {
      setLoading(true);
      const result = await dispatch(setupMFA()).unwrap();
      setQrCode(result.qrCode);
      setSecret(result.secret);
    } catch (err) {
      setError('Failed to initialize MFA setup');
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async () => {
    if (!verificationCode.match(/^\d{6}$/)) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await dispatch(verifyMFAToken({ token: verificationCode, secret })).unwrap();
      onComplete();
    } catch (err) {
      setError('Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Generate Secret', 'Scan QR Code', 'Verify Setup'];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Setup Two-Factor Authentication
            </Typography>
            <Typography color="text.secondary" paragraph>
              Two-factor authentication adds an extra layer of security to your account.
              Follow these steps to set it up:
            </Typography>
            <Alert severity="info">
              You'll need an authenticator app like Google Authenticator or Authy
              to complete this setup.
            </Alert>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Scan QR Code
            </Typography>
            <Box sx={{ mb: 3 }}>
              <QRCode value={qrCode} size={200} level="H" />
            </Box>
            <Alert severity="warning" sx={{ mb: 2, textAlign: 'left' }}>
              If you can't scan the QR code, use this secret key instead:
              <Typography component="div" sx={{ mt: 1, fontFamily: 'monospace' }}>
                {secret}
              </Typography>
            </Alert>
            <Typography color="text.secondary">
              Scan this QR code with your authenticator app
            </Typography>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Verify Setup
            </Typography>
            <Typography color="text.secondary" paragraph>
              Enter the 6-digit code from your authenticator app to verify the setup
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Verification Code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  error={!!error}
                  helperText={error}
                  inputProps={{
                    maxLength: 6,
                    pattern: '[0-9]*',
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Paper>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          renderStepContent(activeStep)
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleVerification}
              disabled={loading || !verificationCode}
            >
              Verify
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Dialog>
  );
};

export default MFASetup;
