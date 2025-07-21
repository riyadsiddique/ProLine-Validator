import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { CheckCircle, Error, Warning } from '@mui/icons-material';
import { validateDeviceCompliance } from '../../../services/deviceValidation';

interface ComplianceStepProps {
  deviceId: string;
  validationId: string;
  onComplete: (results: any) => void;
}

interface ComplianceCheck {
  category: string;
  status: 'pass' | 'fail' | 'warning';
  score: number;
  checks: {
    id: string;
    name: string;
    result: boolean;
    severity: 'high' | 'medium' | 'low';
    details: string;
  }[];
}

const ComplianceStep: React.FC<ComplianceStepProps> = ({
  deviceId,
  validationId,
  onComplete,
}) => {
  const [complianceData, setComplianceData] = useState<ComplianceCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overallScore, setOverallScore] = useState(0);

  useEffect(() => {
    const checkCompliance = async () => {
      try {
        setLoading(true);
        setError(null);

        const results = await validateDeviceCompliance(deviceId, validationId);
        setComplianceData(results);

        // Calculate overall compliance score
        const totalScore = results.reduce((acc, check) => acc + check.score, 0);
        const averageScore = totalScore / results.length;
        setOverallScore(averageScore);

        // Format results for parent component
        const formattedResults = {
          overallScore: averageScore,
          categories: results.reduce(
            (acc, category) => ({
              ...acc,
              [category.category]: {
                status: category.status,
                score: category.score,
                checks: category.checks.reduce(
                  (checkAcc, check) => ({
                    ...checkAcc,
                    [check.id]: {
                      result: check.result,
                      severity: check.severity,
                      details: check.details,
                    },
                  }),
                  {}
                ),
              },
            }),
            {}
          ),
        };

        onComplete(formattedResults);
      } catch (err) {
        setError(err.message || 'Failed to check compliance');
      } finally {
        setLoading(false);
      }
    };

    checkCompliance();
  }, [deviceId, validationId]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'success.main';
    if (score >= 70) return 'warning.main';
    return 'error.main';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Compliance Verification
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Overall Compliance Score
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ flex: 1, mr: 2 }}>
            <LinearProgress
              variant="determinate"
              value={overallScore}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getScoreColor(overallScore),
                },
              }}
            />
          </Box>
          <Typography
            variant="h6"
            sx={{ color: getScoreColor(overallScore) }}
          >
            {overallScore.toFixed(1)}%
          </Typography>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {complianceData.map((category) => (
          <Grid item xs={12} key={category.category}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {category.category}
                <Typography
                  component="span"
                  sx={{
                    ml: 2,
                    color: getScoreColor(category.score),
                  }}
                >
                  Score: {category.score.toFixed(1)}%
                </Typography>
              </Typography>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Check</TableCell>
                      <TableCell>Severity</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {category.checks.map((check) => (
                      <TableRow key={check.id}>
                        <TableCell>{check.name}</TableCell>
                        <TableCell>
                          <Typography
                            sx={{
                              color:
                                check.severity === 'high'
                                  ? 'error.main'
                                  : check.severity === 'medium'
                                  ? 'warning.main'
                                  : 'success.main',
                            }}
                          >
                            {check.severity.toUpperCase()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {check.result ? (
                            <CheckCircle color="success" />
                          ) : check.severity === 'high' ? (
                            <Error color="error" />
                          ) : (
                            <Warning color="warning" />
                          )}
                        </TableCell>
                        <TableCell>{check.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ComplianceStep;
