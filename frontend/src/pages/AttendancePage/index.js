import React, { useState, useEffect } from 'react';
import { fetchAttendanceData } from '../../api/attendanceService'; 
import DateRangeSelector from '../../components/DateRangeSelector';
import AttendanceTable from '../../components/AttendanceTable';
import Spinner from '../../components/Spinner';
import ErrorMessage from '../../components/ErrorMessage';
import PageLayout from '../../components/PageLayout';
import { Typography } from '@mui/material';

const dateRanges = {
    '2023-24': { startDate: '2023-08-01', endDate: '2024-07-31' },
    '2022-23': { startDate: '2022-08-01', endDate: '2023-07-31' },
    'All Time': { startDate: '2022-01-01', endDate: '2024-12-31' },
  };

const AttendancePage = () => {
  const [dateRange, setDateRange] = useState('2023-24'); 
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      <DateRangeSelector
        dateRange={dateRange}
        onChange={handleDateRangeChange}
        options={Object.keys(dateRanges)}
      />
      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <AttendanceTable data={attendanceData} />
      )}
    </PageLayout>
  );
};

export default AttendancePage;
