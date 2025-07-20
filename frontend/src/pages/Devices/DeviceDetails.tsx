import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import TimeDisplay from '../../components/Common/TimeDisplay';

const DeviceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedDevice } = useAppSelector((state) => state.device);

  if (!selectedDevice) {
    return <Typography>Device not found</Typography>;
  }

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Device Details</Typography>
          <TimeDisplay />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Device Information</Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Device ID"
                    secondary={selectedDevice.deviceId}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Model"
                    secondary={selectedDevice.model}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Manufacturer"
                    secondary={selectedDevice.manufacturer}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Android Version"
                    secondary={selectedDevice.androidVersion}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Status"
                    secondary={
                      <Chip 
                        label={selectedDevice.status}
                        color={selectedDevice.status === 'active' ? 'success' : 'error'}
                        size="small"
                      />
                    }
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Device Code Information</Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Code"
                    secondary={selectedDevice.deviceCode.code}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Status"
                    secondary={selectedDevice.deviceCode.status}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Price"
                    secondary={`$${selectedDevice.deviceCode.price}`}
                  />
                </ListItem>
                {selectedDevice.deviceCode.soldTo && (
                  <ListItem>
                    <ListItemText 
                      primary="Sold To"
                      secondary={selectedDevice.deviceCode.soldTo}
                    />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default DeviceDetails;
