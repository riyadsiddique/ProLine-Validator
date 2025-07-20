import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert
} from '@mui/material';
import TimeDisplay from '../../components/Common/TimeDisplay';

const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    validationTimeout: 30,
    maxRetries: 3,
    notifyOnFailure: true,
    autoLockThreshold: 5,
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'checkbox' 
      ? event.target.checked 
      : Number(event.target.value);
    
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      // Add your save logic here
      await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      setSaved(true);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  return (
    <Box>
      <TimeDisplay />
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          System Settings
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Validation Timeout (seconds)"
              type="number"
              value={settings.validationTimeout}
              onChange={handleChange('validationTimeout')}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Max Retry Attempts"
              type="number"
              value={settings.maxRetries}
              onChange={handleChange('maxRetries')}
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Auto-Lock Threshold"
              type="number"
              value={settings.autoLockThreshold}
              onChange={handleChange('autoLockThreshold')}
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifyOnFailure}
                  onChange={handleChange('notifyOnFailure')}
                  color="primary"
                />
              }
              label="Notify on Validation Failure"
            />
          </Grid>
        </Grid>

        {saved && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Settings saved successfully
          </Alert>
        )}

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saved}
        >
          Save Settings
        </Button>
      </Paper>
    </Box>
  );
};

export default SystemSettings;
