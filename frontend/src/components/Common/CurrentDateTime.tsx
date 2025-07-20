import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { format } from 'date-fns';

const CurrentDateTime: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="body2" color="textSecondary">
        UTC: {format(currentTime, 'yyyy-MM-dd HH:mm:ss')}
      </Typography>
    </Box>
  );
};

export default CurrentDateTime;
