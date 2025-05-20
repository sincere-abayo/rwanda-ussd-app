require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ussdController = require('./controllers/ussdController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.post('/ussd', ussdController.handleUSSD);

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).send('USSD Service is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
