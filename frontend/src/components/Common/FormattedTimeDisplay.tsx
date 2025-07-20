import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { AccessTime } from '@mui/icons-material';

const FormattedTimeDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toISOString()
        .replace('T', ' ')
        .slice(0, 19);
      setCurrentTime(formattedTime);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <AccessTime fontSize="small" color="primary" />
      <Typography variant="body2" fontFamily="monospace" sx={{ whiteSpace: 'nowrap' }}>
        UTC: {currentTime}
      </Typography>
    </Box>
  );
};

export default FormattedTimeDisplay;
