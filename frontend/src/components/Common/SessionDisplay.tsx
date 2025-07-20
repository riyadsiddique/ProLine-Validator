import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { AccessTime, Person } from '@mui/icons-material';

interface SessionDisplayProps {
  username: string;
}

const SessionDisplay: React.FC<SessionDisplayProps> = ({ username }) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const year = now.getUTCFullYear();
      const month = String(now.getUTCMonth() + 1).padStart(2, '0');
      const day = String(now.getUTCDate()).padStart(2, '0');
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      
      setCurrentTime(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 2,
      backgroundColor: 'background.paper',
      padding: '4px 12px',
      borderRadius: 1,
      boxShadow: 1
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Person fontSize="small" color="primary" />
        <Typography variant="body2" fontFamily="monospace">
          {username}
        </Typography>
      </Box>
      <Divider orientation="vertical" flexItem />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccessTime fontSize="small" color="primary" />
        <Typography variant="body2" fontFamily="monospace">
          UTC: {currentTime}
        </Typography>
      </Box>
    </Box>
  );
};

export default SessionDisplay;
