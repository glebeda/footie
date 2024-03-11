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
const { scheduleGameStatusUpdate } = require('./src/services/scheduler');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  // React app
  origin: process.env.NODE_ENV === 'production' ? 'http://footie-frontend.s3-website.eu-west-2.amazonaws.com' : 'http://localhost:3001',
}));
app.use(express.json());
app.use(camelCaseMiddleware);

const gamesRoutes = require('./src/api/routes/games');
const playerRoutes = require('./src/api/routes/players');
const signupRoutes = require('./src/api/routes/signups'); 

app.use('/games', gamesRoutes);
app.use('/players', playerRoutes);
app.use('/signups', signupRoutes);
scheduleGameStatusUpdate();

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  const environment = process.env.NODE_ENV || 'dev';
  const host = environment === 'production' ? 'production URL' : `http://localhost:${port}`;
  console.log(`Server running in ${environment} mode on ${host}`);
});
