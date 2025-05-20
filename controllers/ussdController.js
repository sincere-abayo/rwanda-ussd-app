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
  const result = menuHandler.handleMenu(sessionId, text, phoneNumber);

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
