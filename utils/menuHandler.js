const translations = require('./translations');
const Session = require('../models/Session');
const User = require('../models/User');
const Service = require('../models/Service');
const { Op } = require('sequelize');

class MenuHandler {
  constructor() {
    // We'll use the database for session management now
  }

  async handleMenu(sessionId, userInput, phoneNumber) {
    try {
      // Find or create session in database
      let [session, created] = await Session.findOrCreate({
        where: { sessionId },
        defaults: {
          phoneNumber,
          level: 'welcome',
          language: 'en',
          history: [],
          lastActivity: new Date()
        }
      });

      // Find or create user
      let [user, userCreated] = await User.findOrCreate({
        where: { phoneNumber },
        defaults: {
          language: 'en',
          lastAccessed: new Date()
        }
      });

      // If it's a new session but existing user, use the user's language preference
      if (created && !userCreated) {
        session.language = user.language;
        await session.save();
      }

      // Update session's last activity
      session.lastActivity = new Date();
      await session.save();

      // Update user's last accessed time
      user.lastAccessed = new Date();
      await user.save();

      const language = session.language;
      const level = session.level;
      const history = session.history;

      // First-time user with no input
      if (!userInput) {
        return {
          response: translations[language].welcome,
          endSession: false
        };
      }

      // Process user input based on current level
      let result;
      switch (level) {
        case 'welcome':
          result = await this.handleWelcomeMenu(session, userInput, user);
          break;
        case 'findServices':
          result = await this.handleFindServicesMenu(session, userInput);
          break;
        case 'contactUs':
          result = await this.handleContactUsMenu(session, userInput);
          break;
        case 'healthcare':
          result = await this.handleHealthcareMenu(session, userInput);
          break;
        case 'education':
          result = await this.handleEducationMenu(session, userInput);
          break;
        case 'transportation':
          result = await this.handleTransportationMenu(session, userInput);
          break;
        case 'findHospital':
        case 'emergencyNumbers':
        case 'schools':
        case 'universities':
        case 'publicTransport':
        case 'taxiServices':
          result = await this.handleSubMenu(session, userInput);
          break;
        default:
          result = {
            response: translations[language].welcome,
            endSession: false
          };
      }

      return result;
    } catch (error) {
      console.error('Error handling menu:', error);
      return {
        response: "Sorry, an error occurred. Please try again later.",
        endSession: true
      };
    }
  }

  async handleWelcomeMenu(session, userInput, user) {
    const language = session.language;
    
    switch (userInput) {
      case '1':
        session.level = 'findServices';
        session.history = [...session.history, 'welcome'];
        await session.save();
        return {
          response: translations[language].findServices,
          endSession: false
        };
      case '2':
        session.level = 'contactUs';
        session.history = [...session.history, 'welcome'];
        await session.save();
        return {
          response: translations[language].contactUs,
          endSession: false
        };
      case '3':
        // Toggle language
        const newLanguage = language === 'en' ? 'rw' : 'en';
        session.language = newLanguage;
        user.language = newLanguage;
        await session.save();
        await user.save();
        return {
          response: translations[newLanguage].welcome,
          endSession: false
        };
      default:
        return {
          response: translations[language].invalidOption + '\n' + translations[language].welcome,
          endSession: false
        };
    }
  }

  async handleFindServicesMenu(session, userInput) {
    const language = session.language;
    
    switch (userInput) {
      case '1':
        session.level = 'healthcare';
        session.history = [...session.history, 'findServices'];
        await session.save();
        return {
          response: translations[language].healthcare,
          endSession: false
        };
      case '2':
        session.level = 'education';
        session.history = [...session.history, 'findServices'];
        await session.save();
        return {
          response: translations[language].education,
          endSession: false
        };
      case '3':
        session.level = 'transportation';
        session.history = [...session.history, 'findServices'];
        await session.save();
        return {
          response: translations[language].transportation,
          endSession: false
        };
      case '4':
        // Back to main menu
        session.level = 'welcome';
        session.history = [];
        await session.save();
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

  async handleContactUsMenu(session, userInput) {
    const language = session.language;
    
    if (userInput === '1') {
      session.level = 'welcome';
      session.history = [];
      await session.save();
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

  async handleHealthcareMenu(session, userInput) {
    const language = session.language;
    
    switch (userInput) {
      case '1':
        session.level = 'findHospital';
        session.history = [...session.history, 'healthcare'];
        await session.save();
        
        // Fetch hospitals from database
        const hospitals = await Service.findAll({
          where: { category: 'healthcare' }
        });
        
        // Build response
        let response = language === 'en' ? 'Nearby hospitals:\n' : 'Ibitaro biri hafi:\n';
        hospitals.forEach((hospital, index) => {
          response += `${index + 1}. ${language === 'en' ? hospital.name_en : hospital.name_rw}\n`;
        });
        response += language === 'en' ? '3. Back' : '3. Gusubira Inyuma';
        
        return {
          response,
          endSession: false
        };
        
      case '2':
        session.level = 'emergencyNumbers';
        session.history = [...session.history, 'healthcare'];
        await session.save();
        return {
          response: translations[language].emergencyNumbers,
          endSession: false
        };
      case '3':
        // Go back
        return await this.goBack(session);
      default:
        return {
          response: translations[language].invalidOption + '\n' + translations[language].healthcare,
          endSession: false
        };
    }
  }

  async handleEducationMenu(session, userInput) {
    const language = session.language;
    
    switch (userInput) {
      case '1':
        session.level = 'schools';
        session.history = [...session.history, 'education'];
        await session.save();
        
        // Fetch schools from database
        const schools = await Service.findAll({
          where: { 
            category: 'education',
            name_en: { [Op.like]: '%School%' }
          }
        });
        
        // Build response
        let response = language === 'en' ? 'Schools in Rwanda:\n' : 'Amashuri mu Rwanda:\n';
        if (schools.length > 0) {
          schools.forEach((school, index) => {
            response += `${index + 1}. ${language === 'en' ? school.name_en : school.name_rw}\n`;
          });
        } else {
          response += language === 'en' ? '1. Primary Schools\n2. Secondary Schools\n' : '1. Amashuri Abanza\n2. Amashuri Yisumbuye\n';
        }
        response += language === 'en' ? '3. Back' : '3. Gusubira Inyuma';
        
        return {
          response,
          endSession: false
        };
        
      case '2':
        session.level = 'universities';
        session.history = [...session.history, 'education'];
        await session.save();
        
        // Fetch universities from database
        const universities = await Service.findAll({
          where: { 
            category: 'education',
            [Op.or]: [
              { name_en: { [Op.like]: '%University%' } },
              { name_en: { [Op.like]: '%College%' } }
            ]
          }
        });
        
        // Build response
        let uniResponse = language === 'en' ? 'Universities in Rwanda:\n' : 'Za Kaminuza mu Rwanda:\n';
        if (universities.length > 0) {
          universities.forEach((uni, index) => {
            uniResponse += `${index + 1}. ${language === 'en' ? uni.name_en : uni.name_rw}\n`;
          });
        } else {
          uniResponse += language === 'en' ? '1. University of Rwanda\n2. AUCA\n' : '1. Kaminuza y\'u Rwanda\n2. AUCA\n';
        }
        uniResponse += language === 'en' ? '3. Back' : '3. Gusubira Inyuma';
        
        return {
          response: uniResponse,
          endSession: false
        };
        
      case '3':
        // Go back
        return await this.goBack(session);
      default:
        return {
          response: translations[language].invalidOption + '\n' + translations[language].education,
          endSession: false
        };
    }
  }
  async handleTransportationMenu(session, userInput) {
    const language = session.language;
    
    switch (userInput) {
      case '1':
        session.level = 'publicTransport';
        session.history = [...session.history, 'transportation'];
        await session.save();
        
        // Fetch public transport options from database
        const publicTransport = await Service.findAll({
          where: { 
            category: 'transportation',
            [Op.or]: [
              { name_en: { [Op.like]: '%Bus%' } },
              { name_en: { [Op.like]: '%Public%' } }
            ]
          }
        });
        
        // Build response
        let response = language === 'en' ? 'Public transport options:\n' : 'Uburyo bwo gutwara abantu:\n';
        if (publicTransport.length > 0) {
          publicTransport.forEach((transport, index) => {
            response += `${index + 1}. ${language === 'en' ? transport.name_en : transport.name_rw}\n`;
          });
        } else {
          response += language === 'en' ? '1. Bus Services\n2. Moto Taxi\n' : '1. Serivisi za Bisi\n2. Moto\n';
        }
        response += language === 'en' ? '3. Back' : '3. Gusubira Inyuma';
        
        return {
          response,
          endSession: false
        };
        
      case '2':
        session.level = 'taxiServices';
        session.history = [...session.history, 'transportation'];
        await session.save();
        
        // Fetch taxi services from database
        const taxiServices = await Service.findAll({
          where: { 
            category: 'transportation',
            [Op.or]: [
              { name_en: { [Op.like]: '%Taxi%' } },
              { name_en: { [Op.like]: '%Cab%' } }
            ]
          }
        });
        
        // Build response
        let taxiResponse = language === 'en' ? 'Taxi services:\n' : 'Serivisi za tagisi:\n';
        if (taxiServices.length > 0) {
          taxiServices.forEach((taxi, index) => {
            taxiResponse += `${index + 1}. ${language === 'en' ? taxi.name_en : taxi.name_rw}\n`;
          });
        } else {
          taxiResponse += language === 'en' ? '1. Yego Cab\n2. Move Rwanda\n' : '1. Yego Cab\n2. Move Rwanda\n';
        }
        taxiResponse += language === 'en' ? '3. Back' : '3. Gusubira Inyuma';
        
        return {
          response: taxiResponse,
          endSession: false
        };
        
      case '3':
        // Go back
        return await this.goBack(session);
      default:
        return {
          response: translations[language].invalidOption + '\n' + translations[language].transportation,
          endSession: false
        };
    }
  }

  async handleSubMenu(session, userInput) {
    const language = session.language;
    const level = session.level;
    
    // For all leaf menus, option 1 shows details and option 3 is "Back"
    if (userInput === '3') {
      return await this.goBack(session);
    } else if (userInput === '1' || userInput === '2') {
      // Get the category based on current level
      let category;
      if (['findHospital', 'emergencyNumbers'].includes(level)) {
        category = 'healthcare';
      } else if (['schools', 'universities'].includes(level)) {
        category = 'education';
      } else if (['publicTransport', 'taxiServices'].includes(level)) {
        category = 'transportation';
      }
      
      // Fetch the specific service
      const services = await Service.findAll({ where: { category } });
      const serviceIndex = parseInt(userInput) - 1;
      
      if (services && services[serviceIndex]) {
        const service = services[serviceIndex];
        const name = language === 'en' ? service.name_en : service.name_rw;
        const description = language === 'en' ? service.description_en : service.description_rw;
        
        const response = `${name}\n${description}\nContact: ${service.contact}\nLocation: ${service.location}\n\n${language === 'en' ? '3. Back' : '3. Gusubira Inyuma'}`;
        
        return {
          response,
          endSession: false
        };
      }
    }
    
    // Default response for invalid options
    return {
      response: translations[language].invalidOption + '\n' + translations[language][level],
      endSession: false
    };
  }

  async goBack(session) {
    const language = session.language;
    const history = session.history;
    
    if (history.length > 0) {
      const previousLevel = history.pop();
      session.level = previousLevel;
      await session.save();
      return {
        response: translations[language][previousLevel],
        endSession: false
      };
    } else {
      session.level = 'welcome';
      await session.save();
      return {
        response: translations[language].welcome,
        endSession: false
      };
    }
  }

  // Clean up expired sessions
  async cleanupSessions() {
    try {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      await Session.destroy({
        where: {
          lastActivity: {
            [Op.lt]: thirtyMinutesAgo
          }
        }
      });
      console.log('Expired sessions cleaned up');
    } catch (error) {
      console.error('Error cleaning up sessions:', error);
    }
  }

}