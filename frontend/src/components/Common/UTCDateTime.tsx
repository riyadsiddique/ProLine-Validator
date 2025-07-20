import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { AccessTime, Person } from '@mui/icons-material';

interface UTCDateTimeProps {
  username: string;
}

const UTCDateTime: React.FC<UTCDateTimeProps> = ({ username }) => {
  const [dateTime, setDateTime] = useState<string>('');

  useEffect(() => {
    const formatDateTime = (date: Date): string => {
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      const seconds = String(date.getUTCSeconds()).padStart(2, '0');
      
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const updateTime = () => {
      setDateTime(formatDateTime(new Date()));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Paper
      elevation={2}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        p: 1.5,
        backgroundColor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Person fontSize="small" color="primary" />
        <Typography 
          variant="body1" 
          sx={{ 
            fontFamily: 'monospace',
            fontWeight: 500,
          }}
        >
          Current User's Login: {username}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccessTime fontSize="small" color="primary" />
        <Typography 
          variant="body1" 
          sx={{ 
            fontFamily: 'monospace',
            fontWeight: 500,
          }}
        >
          Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS): {dateTime}
        </Typography>
      </Box>
    </Paper>
  );
};

export default UTCDateTime;
