import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Lock as LockIcon,
  ArrowBack as ArrowBackIcon,
  VpnKey as VpnKeyIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface UnauthorizedPageProps {
  requiredPermissions?: string[];
}

const UnauthorizedPage: React.FC<UnauthorizedPageProps> = ({
  requiredPermissions = [],
}) => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 600,
          width: '90%',
          textAlign: 'center',
        }}
      >
        <LockIcon
          sx={{ fontSize: 64, color: 'error.main', mb: 2 }}
        />
        
        <Typography variant="h4" gutterBottom>
          Access Denied
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          You don't have the required permissions to access this page.
        </Typography>

        {requiredPermissions.length > 0 && (
          <Box sx={{ mt: 3, mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Required Permissions:
            </Typography>
            <List>
              {requiredPermissions.map((permission) => (
                <ListItem key={permission}>
                  <ListItemIcon>
                    <VpnKeyIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText primary={permission} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {user && (
          <Box sx={{ mt: 2, mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Your Current Permissions:
            </Typography>
            <List>
              {user.permissions.map((permission) => (
                <ListItem key={permission}>
                  <ListItemIcon>
                    <VpnKeyIcon
                      color={
                        requiredPermissions.includes(permission)
                          ? 'success'
                          : 'disabled'
                      }
                    />
                  </ListItemIcon>
                  <ListItemText primary={permission} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Paper>
    </Box>
  );
};

export default UnauthorizedPage;
