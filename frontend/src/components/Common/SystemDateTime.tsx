import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';

const SystemDateTime: React.FC = () => {
  const [displayText, setDisplayText] = useState<string>('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const year = now.getUTCFullYear();
      const month = String(now.getUTCMonth() + 1).padStart(2, '0');
      const day = String(now.getUTCDate()).padStart(2, '0');
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      
      const formattedDateTime = `Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): ${year}-${month}-${day} ${hours}:${minutes}:${seconds}\nCurrent User's Login: riyadsiddique`;
      setDisplayText(formattedDateTime);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Paper elevation={0} sx={{ p: 2, backgroundColor: 'transparent' }}>
      <Typography
        component="pre"
        sx={{
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          m: 0
        }}
      >
        {displayText}
      </Typography>
    </Paper>
  );
};

export default SystemDateTime;
