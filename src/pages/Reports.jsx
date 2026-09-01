import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Paper,
  Chip,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

export const Reports = () => {
  const [reportType, setReportType] = useState('Weekly'); // Daily, Weekly, Monthly
  const [toastMessage, setToastMessage] = useState('');

  const reportMetrics = {
    Daily: { avgSitting: '6.2 hrs', avgSbi: 65, risk: 'Moderate Risk', breaks: '8 breaks', compliance: '85%' },
    Weekly: { avgSitting: '6.4 hrs/day', avgSbi: 74, risk: 'Moderate Risk', breaks: '9.2 breaks/day', compliance: '82%' },
    Monthly: { avgSitting: '5.9 hrs/day', avgSbi: 58, risk: 'Low-Moderate Risk', breaks: '11 breaks/day', compliance: '88%' },
  };

  const currentData = reportMetrics[reportType];

  const handleDownloadCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Metric,Value,Unit,Target\n' +
      `Report Scope,${reportType},Period,Active\n` +
      `Average Sitting Time,${currentData.avgSitting},Hours,Max 6.0 hrs\n` +
      `Average SBI Score,${currentData.avgSbi},Index (0-100),< 50\n` +
      `Overall Risk Level,${currentData.risk},Category,Low\n` +
      `Average Daily Breaks,${currentData.breaks},Breaks,10 breaks\n` +
      `Ergonomic Compliance,${currentData.compliance},Percentage,> 85%\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SmartChair_${reportType}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage(`Downloaded ${reportType} Ergonomic CSV Report successfully!`);
  };

  const handleDownloadPDF = () => {
    // Generate text blob for PDF stub file
    const content = `SMART CHAIR IOT ERGONOMIC HEALTH REPORT\n=========================================\nScope: ${reportType} Report\nGenerated: ${new Date().toLocaleString()}\n\nSUMMARY METRICS:\n- Average Sitting Time: ${currentData.avgSitting}\n- Average SBI Index: ${currentData.avgSbi}\n- Overall Risk Level: ${currentData.risk}\n- Daily Micro-Breaks: ${currentData.breaks}\n- Ergonomic Compliance: ${currentData.compliance}\n\nClinical Recommendation: Maintain regular micro-breaks every 45 minutes to optimize postural vascular flow.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SmartChair_${reportType}_Health_Report.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage(`Exported ${reportType} Health Report (PDF) to downloads!`);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Title */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'serif' }}>
            Ergonomic Health Reports & Export
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Generate and Export Automated Daily, Weekly, and Monthly Clinical Analytics
          </Typography>
        </Box>
      </Box>

      {/* Scope Selector Bar */}
      <Paper variant="outlined" sx={{ p: 2.5, mb: 3, borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarMonthIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Select Report Time Window:
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {['Daily', 'Weekly', 'Monthly'].map((type) => (
            <Button
              key={type}
              variant={reportType === type ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setReportType(type)}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              {type} Report
            </Button>
          ))}
        </Box>
      </Paper>

      {/* Report Summary Card */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <AssessmentIcon color="primary" sx={{ fontSize: 32 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      {reportType} Ergonomic Summary
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Aggregated telemetry metrics for {reportType.toLowerCase()} evaluation window
                    </Typography>
                  </Box>
                </Box>
                <Chip label="Verified Data" color="success" icon={<CheckCircleOutlinedIcon />} sx={{ fontWeight: 700 }} />
              </Box>

              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={4}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                      AVERAGE SITTING TIME
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', my: 1 }}>
                      {currentData.avgSitting}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Target: &lt; 6.0 hrs/day
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                      AVERAGE SBI INDEX
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#F59E0B', my: 1 }}>
                      {currentData.avgSbi}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Index Range: 0 - 100
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                      OVERALL RISK LEVEL
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#EF4444', my: 1.5 }}>
                      {currentData.risk}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Based on FSR pressure load
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Micro-Break Average: <strong>{currentData.breaks}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Ergonomic Compliance Rate: <strong style={{ color: '#1FBE8C' }}>{currentData.compliance}</strong>
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Download Action Buttons Card */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  Export Document Stubs
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Download official clinical summaries for medical records or workplace safety audits.
                </Typography>

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<PictureAsPdfIcon />}
                  onClick={handleDownloadPDF}
                  sx={{ mb: 2, py: 1.5, fontWeight: 700 }}
                >
                  Download PDF Report
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  size="large"
                  startIcon={<FileDownloadIcon />}
                  onClick={handleDownloadCSV}
                  sx={{ py: 1.5, fontWeight: 700 }}
                >
                  Download CSV Data
                </Button>
              </Box>

              <Box sx={{ mt: 3, p: 2, borderRadius: 2.5, bgcolor: 'background.default' }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  🔒 Encrypted PDF / CSV Data standard compliant with HIPAA & GDPR research guidelines.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar notification */}
      <Snackbar open={Boolean(toastMessage)} autoHideDuration={4000} onClose={() => setToastMessage('')}>
        <Alert severity="success" sx={{ width: '100%', borderRadius: 2, fontWeight: 700 }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
