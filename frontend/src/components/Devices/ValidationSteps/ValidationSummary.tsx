import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Warning,
  Security,
  Settings,
  Gavel,
  SaveAlt,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import { generateValidationReport } from '../../../store/slices/deviceValidationSlice';

interface ValidationSummaryProps {
  deviceId: string;
  validationId: string;
  results: {
    security: any;
    configuration: any;
    compliance: any;
  };
}

const ValidationSummary: React.FC<ValidationSummaryProps> = ({
  deviceId,
  validationId,
  results,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [downloading, setDownloading] = React.useState(false);

  const handleDownloadReport = async () => {
    try {
      setDownloading(true);
      await dispatch(generateValidationReport({ deviceId, validationId }));
    } finally {
      setDownloading(false);
    }
  };

  const getOverallStatus = () => {
    const hasErrors =
      results.security.some((check: any) => check.status === 'error') ||
      Object.values(results.configuration).some(
        (cat: any) => cat.status === 'error'
      ) ||
      results.compliance.overallScore < 70;

    const hasWarnings =
      results.security.some((check: any) => check.status === 'warning') ||
      Object.values(results.configuration).some(
        (cat: any) => cat.status === 'warning'
      ) ||
      results.compliance.overallScore < 90;

    return hasErrors ? 'error' : hasWarnings ? 'warning' : 'success';
  };

  const overallStatus = getOverallStatus();

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {overallStatus === 'success' ? (
            <CheckCircle color="success" sx={{ fontSize: 40, mr: 2 }} />
          ) : overallStatus === 'warning' ? (
            <Warning color="warning" sx={{ fontSize: 40, mr: 2 }} />
          ) : (
            <Error color="error" sx={{ fontSize: 40, mr: 2 }} />
          )}
          <Typography variant="h5">
            Validation {overallStatus === 'success' ? 'Passed' : 'Needs Attention'}
          </Typography>
        </Box>

        <Alert severity={overallStatus as any} sx={{ mb: 3 }}>
          {overallStatus === 'success'
            ? 'All validation checks have passed successfully.'
            : overallStatus === 'warning'
            ? 'Some checks require attention but no critical issues found.'
            : 'Critical issues detected that need immediate attention.'}
        </Alert>

        <Button
          variant="contained"
          startIcon={<SaveAlt />}
          onClick={handleDownloadReport}
          disabled={downloading}
        >
          Download Detailed Report
        </Button>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              <Security sx={{ mr: 1 }} />
              Security Checks
            </Typography>
            <List dense>
              {results.security.map((check: any) => (
                <ListItem key={check.id}>
                  <ListItemIcon>
                    {check.status === 'success' ? (
                      <CheckCircle color="success" />
                    ) : check.status === 'error' ? (
                      <Error color="error" />
                    ) : (
                      <Warning color="warning" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={check.name}
                    secondary={check.details}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              <Settings sx={{ mr: 1 }} />
              Configuration Status
            </Typography>
            <List dense>
              {Object.entries(results.configuration).map(([key, value]: [string, any]) => (
                <ListItem key={key}>
                  <ListItemIcon>
                    {value.status === 'success' ? (
                      <CheckCircle color="success" />
                    ) : value.status === 'error' ? (
                      <Error color="error" />
                    ) : (
                      <Warning color="warning" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={key}
                    secondary={`Score: ${value.score}%`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              <Gavel sx={{ mr: 1 }} />
              Compliance Overview
            </Typography>
            <Typography variant="h4" gutterBottom>
              {results.compliance.overallScore.toFixed(1)}%
            </Typography>
            <Divider sx={{ my: 2 }} />
            <List dense>
              {Object.entries(results.compliance.categories).map(([key, value]: [string, any]) => (
                <ListItem key={key}>
                  <ListItemIcon>
                    {value.score >= 90 ? (
                      <CheckCircle color="success" />
                    ) : value.score >= 70 ? (
                      <Warning color="warning" />
                    ) : (
                      <Error color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={key}
                    secondary={`Score: ${value.score.toFixed(1)}%`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ValidationSummary;
