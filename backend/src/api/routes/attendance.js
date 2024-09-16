const express = require('express');
const router = express.Router();
const attendanceService = require('../../services/attendanceService');

router.get('/season', async (req, res) => {
  try {
    const seasonStartDate = req.query.startDate;
    const seasonEndDate = req.query.endDate;

    const attendanceData = await attendanceService.getSeasonAttendance(seasonStartDate, seasonEndDate);
    res.status(200).json(attendanceData);
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
