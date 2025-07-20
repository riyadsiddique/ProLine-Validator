import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Person } from '@mui/icons-material';

interface UserLoginInfoProps {
  username: string;
  role?: string;
}

const UserLoginInfo: React.FC<UserLoginInfoProps> = ({ username, role }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Person fontSize="small" color="primary" />
      <Typography variant="body2" fontFamily="monospace">
        {username}
      </Typography>
      {role && (
        <Chip
          label={role}
          size="small"
          color="primary"
          variant="outlined"
        />
      )}
    </Box>
  );
};

export default UserLoginInfo;
