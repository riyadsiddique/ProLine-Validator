import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { AccessTime, Person } from '@mui/icons-material';

interface PreciseTimeDisplayProps {
  username: string;
}

const PreciseTimeDisplay: React.FC<PreciseTimeDisplayProps> = ({ username }) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const formatTime = (date: Date): string => {
      return date.toISOString()
        .replace('T', ' ')
        .slice(0, 19);
    };

    const updateTime = () => {
      setCurrentTime(formatTime(new Date()));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Paper
      elevation={1}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        p: 1,
        px: 2,
        backgroundColor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Person fontSize="small" color="primary" />
        <Typography 
          variant="body2" 
          sx={{ 
            fontFamily: 'monospace',
            fontWeight: 'medium',
          }}
        >
          {username}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccessTime fontSize="small" color="primary" />
        <Typography 
          variant="body2" 
          sx={{ 
            fontFamily: 'monospace',
            whiteSpace: 'nowrap',
          }}
        >
          UTC - {currentTime}
        </Typography>
      </Box>
    </Paper>
  );
};

export default PreciseTimeDisplay;
