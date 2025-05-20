require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ussdController = require('./controllers/ussdController');
const { initDatabase } = require('./utils/dbInit');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
initDatabase().then(() => {
  console.log('Database initialized');
}).catch(err => {
  console.error('Database initialization failed:', err);
});

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
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle process termination gracefully
process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
