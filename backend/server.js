require('dotenv').config();

const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.AWS_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const express = require('express');
const camelCaseMiddleware = require('./src/middleware/camelCaseMiddleware');
const cors = require('cors');
const app = express();

// In development, use the scheduler
// In production (Vercel), we use Vercel Cron Jobs instead
if (process.env.NODE_ENV !== 'production') {
  const { scheduleGameStatusUpdate } = require('./src/services/scheduler');
  scheduleGameStatusUpdate();
}

app.use(cors({
  // React app
  origin: process.env.NODE_ENV === 'production' 
    ? (process.env.FRONTEND_URL || 'https://www.playfootie.net') 
    : 'http://localhost:3001',
}));
app.use(express.json());
app.use(camelCaseMiddleware);

const gamesRoutes = require('./src/api/routes/games');
const playerRoutes = require('./src/api/routes/players');
const signupRoutes = require('./src/api/routes/signups'); 
const attendanceRoutes = require('./src/api/routes/attendance');

app.use('/api/games', gamesRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/signups', signupRoutes);
app.use('/api/attendance', attendanceRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running in development mode on http://localhost:${port}`);
  });
}

// Export for Vercel serverless functions
module.exports = app;
