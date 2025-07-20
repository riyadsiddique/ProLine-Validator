import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Person, AccessTime } from '@mui/icons-material';

interface SessionInfoProps {
  username: string;
}

const SessionInfo: React.FC<SessionInfoProps> = ({ username }) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utcString = now.toISOString().slice(0, 19).replace('T', ' ');
      setCurrentTime(utcString);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Person fontSize="small" color="primary" />
        <Typography variant="body2">
          {username}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccessTime fontSize="small" color="primary" />
        <Typography variant="body2">
          UTC: {currentTime}
        </Typography>
      </Box>
    </Box>
  );
};

export default SessionInfo;
