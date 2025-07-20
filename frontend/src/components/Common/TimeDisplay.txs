import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { AccessTime } from '@mui/icons-material';

const TimeDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatUTC = (date: Date) => {
    return date.toISOString().replace('T', ' ').substring(0, 19);
  };

  return (
    <Paper elevation={0} sx={{ p: 1, display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      <AccessTime fontSize="small" color="primary" />
      <Typography variant="body2">
        UTC: {formatUTC(currentTime)}
      </Typography>
    </Box>
  );
};

export default TimeDisplay;
