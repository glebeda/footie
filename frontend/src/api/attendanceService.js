import axios from './axios.js';

export const fetchAttendanceData = (startDate, endDate) => {
  return axios.get('/attendance/season', {
    params: {
      startDate,
      endDate,
    },
  })
    .then(response => response.data)
    .catch(error => {
      if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 400:
            throw new Error(data.error || 'Invalid date range.');
          case 404:
            throw new Error('Attendance data not found.');
          default:
            throw new Error(data.error || 'Error fetching attendance data.');
        }
      } else {
        throw new Error('Network error. Please try again.');
      }
    });
};
