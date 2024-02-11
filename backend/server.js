require('dotenv').config();

const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.AWS_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const express = require('express');
const bodyParser = require('body-parser');
const gamesRoutes = require('./src/api/routes/games');
const playerRoutes = require('./src/api/routes/players');
const signupRoutes = require('./src/api/routes/signups'); 
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json()); 
app.use('/games', gamesRoutes);
app.use('/players', playerRoutes);
app.use('/signups', signupRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
