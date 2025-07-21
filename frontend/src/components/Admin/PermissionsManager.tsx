import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  FormControlLabel,
  Checkbox,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
  SecurityOutlined as SecurityIcon,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { updateAdminPermissions } from '../../store/slices/adminSlice';
import { AppDispatch } from '../../store';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface PermissionGroup {
  category: string;
  permissions: Permission[];
}

const permissionGroups: PermissionGroup[] = [
  {
    category: 'Device Management',
    permissions: [
      { id: 'device.view', name: 'View Devices', description: 'View device list and details', category: 'Device Management' },
      { id: 'device.create', name: 'Create Devices', description: 'Register new devices', category: 'Device Management' },
      { id: 'device.edit', name: 'Edit Devices', description: 'Modify device information', category: 'Device Management' },
      { id: 'device.delete', name: 'Delete Devices', description: 'Remove devices from system', category: 'Device Management' },
    ],
  },
  {
    category: 'Validation',
    permissions: [
      { id: 'validation.run', name: 'Run Validation', description: 'Execute device validation', category: 'Validation' },
      { id: 'validation.view', name: 'View Results', description: 'View validation results', category: 'Validation' },
      { id: 'validation.export', name: 'Export Reports', description: 'Export validation reports', category: 'Validation' },
    ],
  },
  {
    category: 'User Management',
    permissions: [
      { id: 'user.view', name: 'View Users', description: 'View user list and details', category: 'User Management' },
      { id: 'user.create', name: 'Create Users', description: 'Create new users', category: 'User Management' },
      { id: 'user.edit', name: 'Edit Users', description: 'Modify user information', category: 'User Management' },
      { id: 'user.delete', name: 'Delete Users', description: 'Remove users from system', category: 'User Management' },
    ],
  },
  {
    category: 'System Settings',
    permissions: [
      { id: 'settings.view', name: 'View Settings', description: 'View system settings', category: 'System Settings' },
      { id: 'settings.edit', name: 'Edit Settings', description: 'Modify system settings', category: 'System Settings' },
      { id: 'settings.security', name: 'Security Settings', description: 'Modify security settings', category: 'System Settings' },
    ],
  },
];

interface PermissionsManagerProps {
  adminId: string;
  currentPermissions: string[];
  onSuccess?: () => void;
}

const PermissionsManager: React.FC<PermissionsManagerProps> = ({
  adminId,
  currentPermissions,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | false>(false);

  useEffect(() => {
    setSelectedPermissions(currentPermissions);
  }, [currentPermissions]);

  const handlePermissionChange = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleCategoryChange = (category: string, permissions: Permission[]) => {
    const categoryPermissionIds = permissions.map((p) => p.id);
    const allSelected = permissions.every((p) =>
      selectedPermissions.includes(p.id)
    );

    setSelectedPermissions((prev) =>
      allSelected
        ? prev.filter((id) => !categoryPermissionIds.includes(id))
        : [...new Set([...prev, ...categoryPermissionIds])]
    );
  };

  const handleAccordionChange = (category: string) => (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? category : false);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(
        updateAdminPermissions({
          adminId,
          permissions: selectedPermissions,
        })
      ).unwrap();
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Failed to update permissions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <SecurityIcon color="primary" />
        <Typography variant="h6">Permissions Management</Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 2 }}>
        {permissionGroups.map((group) => (
          <Accordion
            key={group.category}
            expanded={expanded === group.category}
            onChange={handleAccordionChange(group.category)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Typography>{group.category}</Typography>
                <Chip
                  size="small"
                  label={`${
                    group.permissions.filter((p) =>
                      selectedPermissions.includes(p.id)
                    ).length
                  }/${group.permissions.length}`}
                  color="primary"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={group.permissions.every((p) =>
                        selectedPermissions.includes(p.id)
                      )}
                      indeterminate={
                        group.permissions.some((p) =>
                          selectedPermissions.includes(p.id)
                        ) &&
                        !group.permissions.every((p) =>
                          selectedPermissions.includes(p.id)
                        )
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryChange(group.category, group.permissions);
                      }}
                    />
                  }
                  label="Select All"
                  onClick={(e) => e.stopPropagation()}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {group.permissions.map((permission) => (
                  <Grid item xs={12} sm={6} key={permission.id}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedPermissions.includes(permission.id)}
                          onChange={() => handlePermissionChange(permission.id)}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2">
                            {permission.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="textSecondary"
                          >
                            {permission.description}
                          </Typography>
                        </Box>
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
          onClick={handleSave}
          disabled={loading}
        >
          Save Permissions
        </Button>
      </Box>
    </Box>
  );
};

export default PermissionsManager;
