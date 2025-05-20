const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a separate connection to create the database if it doesn't exist
const createDatabaseIfNotExists = async () => {
  const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;
  
  try {
    // Create a connection without specifying a database
    const connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT || 3306,
      user: DB_USER,
      password: DB_PASSWORD
    });
    
    // Create the database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
    console.log(`Database ${DB_NAME} created or already exists`);
    
    // Close the connection
    await connection.end();
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  }
};

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: console.log, // Enable logging to see SQL queries
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Initialize database and seed data
const initDatabase = async () => {
  try {
    // First, create the database if it doesn't exist
    await createDatabaseIfNotExists();
    
    // Test the connection
    await sequelize.authenticate();
    console.log('Connection to database has been established successfully.');
    
    // Import models here to avoid circular dependencies
    const Service = require('../models/Service');
    const User = require('../models/User');
    const Session = require('../models/Session');
    
    // Define relationships
    User.hasMany(Session, { foreignKey: 'phoneNumber', sourceKey: 'phoneNumber' });
    Session.belongsTo(User, { foreignKey: 'phoneNumber', targetKey: 'phoneNumber' });
    
    // Sync all models with database - force:true will drop tables if they exist
    await sequelize.sync({ force: true });
    console.log('All models were synchronized successfully.');

    // Verify that the tables exist
    const [results] = await sequelize.query("SHOW TABLES");
    console.log('Tables in database:', results);

    // Check if Services table exists
    if (results.length === 0 || !results.some(r => Object.values(r)[0].toLowerCase() === 'services')) {
      console.error('Services table was not created properly');
      
      // Try to create the table manually
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS Services (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name_en VARCHAR(255) NOT NULL,
          name_rw VARCHAR(255) NOT NULL,
          category ENUM('healthcare', 'education', 'transportation') NOT NULL,
          description_en TEXT,
          description_rw TEXT,
          contact VARCHAR(255),
          location VARCHAR(255),
          createdAt DATETIME NOT NULL,
          updatedAt DATETIME NOT NULL
        )
      `);
      console.log('Manually created Services table');
    }

    // Seed services data
    await Service.bulkCreate([
      // Healthcare services
      {
        name_en: 'King Faisal Hospital',
        name_rw: 'Ibitaro bya King Faisal',
        category: 'healthcare',
        description_en: 'Specialized hospital in Kigali',
        description_rw: 'Ibitaro byihariye biri i Kigali',
        contact: '0786729283',
        location: 'Kigali'
      },
      {
        name_en: 'CHUK',
        name_rw: 'CHUK',
        category: 'healthcare',
        description_en: 'University Teaching Hospital of Kigali',
        description_rw: 'Ibitaro bya Kaminuza i Kigali',
        contact: '078247895',
        location: 'Kigali'
      },
      
      // Education services
      {
        name_en: 'University of Rwanda',
        name_rw: 'Kaminuza y\'u Rwanda',
        category: 'education',
        description_en: 'Public university in Rwanda',
        description_rw: 'Kaminuza ya Leta mu Rwanda',
        contact: '0789542645',
        location: 'Multiple campuses'
      },
      {
        name_en: 'AUCA',
        name_rw: 'AUCA',
        category: 'education',
        description_en: 'Adventist University of Central Africa',
        description_rw: 'Kaminuza y\'Abadivantisiti bo muri Afurika yo Hagati',
        contact: '07896541358',
        location: 'Kigali'
      },
      
      // Transportation services
      {
        name_en: 'Yego Cab',
        name_rw: 'Yego Cab',
        category: 'transportation',
        description_en: 'Taxi service in Rwanda',
        description_rw: 'Serivisi ya Tagisi mu Rwanda',
        contact: '07854123698',
        location: 'Nationwide'
      },
      {
        name_en: 'Move Rwanda',
        name_rw: 'Move Rwanda',
        category: 'transportation',
        description_en: 'Transportation service in Rwanda',
        description_rw: 'Serivisi yo gutwara abantu mu Rwanda',
        contact: '125698745623',
        location: 'Kigali'
      }
    ]);
    
    // Verify that data was inserted
    const servicesCount = await Service.count();
    console.log(`Database seeded with ${servicesCount} services`);
    
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

module.exports = { initDatabase, sequelize };
