import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Person } from '@mui/icons-material';
import { useAppSelector } from '../../store/hooks';

const UserInfo: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Person fontSize="small" />
      <Typography variant="body2">
        {user?.name || 'Guest'}
      </Typography>
      <Chip
        label={user?.role || 'Unknown'}
        size="small"
        color={user?.role === 'super_admin' ? 'secondary' : 'primary'}
        variant="outlined"
      />
    </Box>
  );
};

export default UserInfo;
