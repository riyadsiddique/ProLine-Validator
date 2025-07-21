import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Collapse,
  Alert,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Security,
  Lock,
  Warning,
} from '@mui/icons-material';
import { validateDeviceSecurity } from '../../../services/deviceValidation';

interface SecurityCheckStepProps {
  deviceId: string;
  validationId: string;
  onComplete: (results: any) => void;
}

interface SecurityCheck {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  details?: string;
}

const SecurityCheckStep: React.FC<SecurityCheckStepProps> = ({
  deviceId,
  validationId,
  onComplete,
}) => {
  const [checks, setChecks] = useState<SecurityCheck[]>([
    {
      id: 'root',
      name: 'Root Status Check',
      description: 'Verifying device root status',
      status: 'pending',
    },
    {
      id: 'bootloader',
      name: 'Bootloader Status',
      description: 'Checking bootloader lock status',
      status: 'pending',
    },
    {
      id: 'integrity',
      name: 'System Integrity',
      description: 'Verifying system integrity',
      status: 'pending',
    },
    {
      id: 'safetynet',
      name: 'SafetyNet Attestation',
      description: 'Validating SafetyNet status',
      status: 'pending',
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const runSecurityChecks = async () => {
      try {
        setLoading(true);
        setError(null);

        for (const check of checks) {
          // Update status to show progress
          setChecks((prev) =>
            prev.map((c) =>
              c.id === check.id ? { ...c, status: 'pending' } : c
            )
          );

          // Perform the actual check
          const result = await validateDeviceSecurity(deviceId, validationId, check.id);

          // Update the check status
          setChecks((prev) =>
            prev.map((c) =>
              c.id === check.id
                ? {
                    ...c,
                    status: result.status,
                    details: result.details,
                  }
                : c
            )
          );

          // Small delay between checks
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        // Get final results
        const results = checks.reduce(
          (acc, check) => ({
            ...acc,
            [check.id]: {
              status: check.status,
              details: check.details,
            },
          }),
          {}
        );

        onComplete(results);
      } catch (err) {
        setError(err.message || 'Failed to complete security checks');
      } finally {
        setLoading(false);
      }
    };

    runSecurityChecks();
  }, [deviceId, validationId]);

  const getStatusIcon = (status: SecurityCheck['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle color="success" />;
      case 'error':
        return <Error color="error" />;
      case 'warning':
        return <Warning color="warning" />;
      default:
        return <CircularProgress size={24} />;
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Security Validation
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <List>
        {checks.map((check) => (
          <React.Fragment key={check.id}>
            <ListItem>
              <ListItemIcon>{getStatusIcon(check.status)}</ListItemIcon>
              <ListItemText
                primary={check.name}
                secondary={check.description}
              />
            </ListItem>
            {check.details && (
              <Collapse in={true}>
                <Alert
                  severity={
                    check.status === 'error'
                      ? 'error'
                      : check.status === 'warning'
                      ? 'warning'
                      : 'info'
                  }
                  sx={{ ml: 7, mb: 1 }}
                >
                  {check.details}
                </Alert>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default SecurityCheckStep;
