import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import {
  QrCode,
  PhoneAndroid,
  Payment,
  Warning,
} from '@mui/icons-material';
import CurrentDateTime from '../../components/Common/CurrentDateTime';
import UserInfo from '../../components/Common/UserInfo';
import { useAppSelector } from '../../store/hooks';
import DashboardChart from './DashboardChart';
import RecentActivities from './RecentActivities';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { devices } = useAppSelector((state) => state.device);
  const { user } = useAppSelector((state) => state.auth);

  const stats = [
    {
      title: 'Total Device Codes',
      value: '156',
      icon: <QrCode />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Active Devices',
      value: '89',
      icon: <PhoneAndroid />,
      color: theme.palette.success.main,
    },
    {
      title: 'Pending Payments',
      value: '12',
      icon: <Payment />,
      color: theme.palette.warning.main,
    },
    {
      title: 'Locked Devices',
      value: '3',
      icon: <Warning />,
      color: theme.palette.error.main,
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Dashboard</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <UserInfo />
            <CurrentDateTime />
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4">{stat.value}</Typography>
                  </Box>
                  <Box sx={{ 
                    backgroundColor: `${stat.color}15`,
                    p: 1,
                    borderRadius: '50%'
                  }}>
                    {React.cloneElement(stat.icon as React.ReactElement, {
                      sx: { color: stat.color }
                    })}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Activity Overview
            </Typography>
            <DashboardChart />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <RecentActivities />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
