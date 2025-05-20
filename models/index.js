const sequelize = require('../config/database');
const User = require('./User');
const Session = require('./Session');
const Service = require('./Service');

// Define relationships
User.hasMany(Session, { foreignKey: 'phoneNumber', sourceKey: 'phoneNumber' });
Session.belongsTo(User, { foreignKey: 'phoneNumber', targetKey: 'phoneNumber' });

// Export all models
module.exports = {
  sequelize,
  User,
  Session,
  Service
};