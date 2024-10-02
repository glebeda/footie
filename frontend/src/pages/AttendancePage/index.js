import React, { useState, useEffect } from 'react';
import { fetchAttendanceData } from '../../api/attendanceService'; 
import DateRangeSelector from '../../components/DateRangeSelector';
import AttendanceTable from '../../components/AttendanceTable';
import Spinner from '../../components/Spinner';
import ErrorMessage from '../../components/ErrorMessage';
import PageLayout from '../../components/PageLayout';
import { Typography, Box, useMediaQuery, useTheme } from '@mui/material';

const dateRanges = {
    '2023-24': { startDate: '2023-08-01', endDate: '2024-07-31' },
    '2024-25': { startDate: '2024-08-01', endDate: '2025-07-31' },
    'All Time': { startDate: '2022-01-01', endDate: '2028-12-31' },
  };

const AttendancePage = () => {
  const [dateRange, setDateRange] = useState('2024-25'); 
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const { startDate, endDate } = dateRanges[dateRange];
    setLoading(true);
    setError(null);

    fetchAttendanceData(startDate, endDate)
      .then((data) => {
        setAttendanceData(data);
      })
      .catch((err) => {
        console.error('Error fetching attendance data:', err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dateRange]);

  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  return (
    <PageLayout>
      <Typography variant='h4' component='h1' gutterBottom>
        Attendance
      </Typography>

      {/* Responsive Container */}
      <Box
        sx={{
          width: '100%',
          maxWidth: isMobile ? '100%' : '600px', // Adjust '600px' to your table's width if necessary
          margin: '0 auto',
        }}
      >
        {/* DateRangeSelector */}
        <Box sx={{ marginBottom: 2 }}>
          <DateRangeSelector
            dateRange={dateRange}
            onChange={handleDateRangeChange}
            options={Object.keys(dateRanges)}
            fullWidth
          />
        </Box>

        {/* Content */}
        {loading ? (
          <Spinner />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <AttendanceTable data={attendanceData} />
        )}
      </Box>
    </PageLayout>
  );
};

export default AttendancePage;
