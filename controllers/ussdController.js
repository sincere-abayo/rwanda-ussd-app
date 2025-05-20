const menuHandler = require('../utils/menuHandler');

exports.handleUSSD = (req, res) => {
  // Get the parameters from the request
  const {
    sessionId,
    serviceCode,
    phoneNumber,
    text
  } = req.body;

  // Process the USSD request
  // For Africa's Talking, we need to get the latest input from the text
  // The text format is like "1*2*1" where each number is a menu selection
  let userInput = '';
  
  if (text) {
    // If there's text input, get the most recent selection
    const textArray = text.split('*');
    userInput = textArray[textArray.length - 1];
  }

  const result = menuHandler.handleMenu(sessionId, userInput, phoneNumber);

  // Format the response as expected by Africa's Talking
  let response = '';
  
  if (result.endSession) {
    // End the session
    response = `END ${result.response}`;
  } else {
    // Continue the session
    response = `CON ${result.response}`;
  }

  // Send the response
  res.contentType('text/plain');
  res.send(response);
  
  // Periodically clean up expired sessions
  if (Math.random() < 0.1) { // 10% chance to run cleanup on each request
    menuHandler.cleanupSessions();
  }
};
