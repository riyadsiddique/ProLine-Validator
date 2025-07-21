import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Settings,
  Warning,
} from '@mui/icons-material';
import { validateDeviceConfiguration } from '../../../services/deviceValidation';

interface ConfigurationStepProps {
  deviceId: string;
  validationId: string;
  onComplete: (results: any) => void;
}

interface ConfigCheck {
  category: string;
  items: {
    id: string;
    name: string;
    value: string;
    status: 'success' | 'error' | 'warning';
    expected?: string;
  }[];
}

const ConfigurationStep: React.FC<ConfigurationStepProps> = ({
  deviceId,
  validationId,
  onComplete,
}) => {
  const [configChecks, setConfigChecks] = useState<ConfigCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateConfig = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const results = await validateDeviceConfiguration(deviceId, validationId);
        setConfigChecks(results);
        
        const formattedResults = results.reduce(
          (acc, category) => ({
            ...acc,
            [category.category]: category.items.reduce(
              (itemAcc, item) => ({
                ...itemAcc,
                [item.id]: {
                  status: item.status,
                  value: item.value,
                  expected: item.expected,
                },
              }),
              {}
            ),
          }),
          {}
        );

        onComplete(formattedResults);
      } catch (err) {
        setError(err.message || 'Failed to validate configuration');
      } finally {
        setLoading(false);
      }
    };

    validateConfig();
  }, [deviceId, validationId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Configuration Verification
      </Typography>

      <Grid container spacing={3}>
        {configChecks.map((category) => (
          <Grid item xs={12} md={6} key={category.category}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {category.category}
              </Typography>
              <List dense>
                {category.items.map((item) => (
                  <ListItem key={item.id}>
                    <ListItemIcon>
                      {item.status === 'success' ? (
                        <CheckCircle color="success" />
                      ) : item.status === 'error' ? (
                        <Error color="error" />
                      ) : (
                        <Warning color="warning" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      secondary={
                        <>
                          Current: {item.value}
                          {item.expected && (
                            <>
                              <br />
                              Expected: {item.expected}
                            </>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ConfigurationStep;
