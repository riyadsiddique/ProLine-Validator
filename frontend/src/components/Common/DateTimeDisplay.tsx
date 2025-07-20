import React from 'react';
import { Typography } from '@mui/material';
import { format } from 'date-fns';

interface DateTimeDisplayProps {
  date?: string | Date;
  format?: string;
  variant?: 'body1' | 'body2' | 'caption';
}

const DateTimeDisplay: React.FC<DateTimeDisplayProps> = ({
  date = new Date(),
  format: dateFormat = 'yyyy-MM-dd HH:mm:ss',
  variant = 'body2',
}) => {
  const formattedDate = format(typeof date === 'string' ? new Date(date) : date, dateFormat);

  return <Typography variant={variant}>{formattedDate}</Typography>;
};

export default DateTimeDisplay;
