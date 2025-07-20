import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';

const DateTime: React.FC = () => {
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
      
      setDisplayText(
`Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): ${year}-${month}-${day} ${hours}:${minutes}:${seconds}
Current User's Login: riyadsiddique`
      );
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        component="pre"
        sx={{
          fontFamily: 'monospace',
          whiteSpace: 'pre-line',
          margin: 0
        }}
      >
        {displayText}
      </Typography>
    </Box>
  );
};

export default DateTime;
