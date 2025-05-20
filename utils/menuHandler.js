const translations = require('./translations');

class MenuHandler {
  constructor() {
    this.sessions = {};
  }

  handleMenu(sessionId, userInput, phoneNumber) {
    // Initialize session if it doesn't exist
    if (!this.sessions[sessionId]) {
      this.sessions[sessionId] = {
        language: 'en',
        level: 'welcome',
        history: []
      };
    }

    const session = this.sessions[sessionId];
    const { language, level } = session;

    // First-time user with no input
    if (!userInput) {
      return {
        response: translations[language].welcome,
        endSession: false
      };
    }

    // Process user input based on current level
    switch (level) {
      case 'welcome':
        return this.handleWelcomeMenu(session, userInput);
      case 'findServices':
        return this.handleFindServicesMenu(session, userInput);
      case 'contactUs':
        return this.handleContactUsMenu(session, userInput);
      case 'healthcare':
        return this.handleHealthcareMenu(session, userInput);
      case 'education':
        return this.handleEducationMenu(session, userInput);
      case 'transportation':
        return this.handleTransportationMenu(session, userInput);
      case 'findHospital':
      case 'emergencyNumbers':
      case 'schools':
      case 'universities':
      case 'publicTransport':
      case 'taxiServices':
        return this.handleSubMenu(session, userInput);
      default:
        return {
          response: translations[language].welcome,
          endSession: false
        };
    }
  }

  handleWelcomeMenu(session, userInput) {
    const { language } = session;
    
    switch (userInput) {
      case '1':
        session.level = 'findServices';
        session.history.push('welcome');
        return {
          response: translations[language].findServices,
          endSession: false
        };
      case '2':
        session.level = 'contactUs';
        session.history.push('welcome');
        return {
          response: translations[language].contactUs,
          endSession: false
        };
      case '3':
        // Toggle language
        session.language = language === 'en' ? 'rw' : 'en';
        return {
          response: translations[session.language].welcome,
          endSession: false
        };
      default:
        return {
          response: translations[language].invalidOption + '\n' + translations[language].welcome,
          endSession: false
        };
    }
  }

  handleFindServicesMenu(session, userInput) {
    const { language } = session;
    
    switch (userInput) {
      case '1':
        session.level = 'healthcare';
        session.history.push('findServices');
        return {
          response: translations[language].healthcare,
          endSession: false
        };
      case '2':
        session.level = 'education';
        session.history.push('findServices');
        return {
          response: translations[language].education,
          endSession: false
        };
      case '3':
        session.level = 'transportation';
        session.history.push('findServices');
        return {
          response: translations[language].transportation,
          endSession: false
        };
      case '4':
        // Back to main menu
        session.level = 'welcome';
        session.history = [];
        return {
          response: translations[language].welcome,
          endSession: false
        };
      default:
        return {
          response: translations[language].invalidOption + '\n' + translations[language].findServices,
          endSession: false
        };
    }
  }

  handleContactUsMenu(session, userInput) {
    const { language } = session;
    
    if (userInput === '1') {
      session.level = 'welcome';
      session.history = [];
      return {
        response: translations[language].welcome,
        endSession: false
      };
    } else {
      return {
        response: translations[language].invalidOption + '\n' + translations[language].contactUs,
        endSession: false
      };
    }
  }

  handleHealthcareMenu(session, userInput) {
    const { language } = session;
    
    switch (userInput) {
      case '1':
        session.level = 'findHospital';
        session.history.push('healthcare');
        return {
          response: translations[language].findHospital,
          endSession: false
        };
      case '2':
        session.level = 'emergencyNumbers';
        session.history.push('healthcare');
        return {
          response: translations[language].emergencyNumbers,
          endSession: false
        };
      case '3':
        // Go back
        return this.goBack(session);
      default:
        return {
          response: translations[language].invalidOption + '\n' + translations[language].healthcare,
          endSession: false
        };
    }
  }

  handleEducationMenu(session, userInput) {
    const { language } = session;
    
    switch (userInput) {
      case '1':
        session.level = 'schools';
        session.history.push('education');
        return {
          response: translations[language].schools,
          endSession: false
        };
      case '2':
        session.level = 'universities';
        session.history.push('education');
        return {
          response: translations[language].universities,
          endSession: false
        };
      case '3':
        // Go back
        return this.goBack(session);
      default:
        return {
          response: translations[language].invalidOption + '\n' + translations[language].education,
          endSession: false
        };
    }
  }

  handleTransportationMenu(session, userInput) {
    const { language } = session;
    
    switch (userInput) {
      case '1':
        session.level = 'publicTransport';
        session.history.push('transportation');
        return {
          response: translations[language].publicTransport,
          endSession: false
        };
      case '2':
        session.level = 'taxiServices';
        session.history.push('transportation');
        return {
          response: translations[language].taxiServices,
          endSession: false
        };
      case '3':
        // Go back
        return this.goBack(session);
      default:
        return {
          response: translations[language].invalidOption + '\n' + translations[language].transportation,
          endSession: false
        };
    }
  }

  handleSubMenu(session, userInput) {
    // For all leaf menus, option 3 is "Back"
    if (userInput === '3' || userInput === '1') {
      return this.goBack(session);
    } else {
      const { language, level } = session;
      return {
        response: translations[language].invalidOption + '\n' + translations[language][level],
        endSession: false
      };
    }
  }

  goBack(session) {
    const { language, history } = session;
    
    if (history.length > 0) {
      const previousLevel = history.pop();
      session.level = previousLevel;
      return {
        response: translations[language][previousLevel],
        endSession: false
      };
    } else {
      session.level = 'welcome';
      return {
        response: translations[language].welcome,
        endSession: false
      };
    }
  }

  // Clean up expired sessions
  cleanupSessions() {
    const now = Date.now();
    Object.keys(this.sessions).forEach(sessionId => {
      if (now - this.sessions[sessionId].lastActivity > 30 * 60 * 1000) { // 30 minutes
        delete this.sessions[sessionId];
      }
    });
  }
}

module.exports = new MenuHandler();
