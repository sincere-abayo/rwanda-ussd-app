'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Services', [
      // Healthcare services
      {
        name_en: 'King Faisal Hospital',
        name_rw: 'Ibitaro bya King Faisal',
        category: 'healthcare',
        description_en: 'Specialized hospital in Kigali',
        description_rw: 'Ibitaro byihariye biri i Kigali',
        contact: '078965412',
        location: 'Kigali',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name_en: 'CHUK',
        name_rw: 'CHUK',
        category: 'healthcare',
        description_en: 'University Teaching Hospital of Kigali',
        description_rw: 'Ibitaro bya Kaminuza i Kigali',
        contact: '0745698745',
        location: 'Kigali',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Education services
      {
        name_en: 'University of Rwanda',
        name_rw: 'Kaminuza y\'u Rwanda',
        category: 'education',
        description_en: 'Public university in Rwanda',
        description_rw: 'Kaminuza ya Leta mu Rwanda',
        contact: '0789654236',
        location: 'Multiple campuses',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name_en: 'AUCA',
        name_rw: 'AUCA',
        category: 'education',
        description_en: 'Adventist University of Central Africa',
        description_rw: 'Kaminuza y\'Abadivantisiti bo muri Afurika yo Hagati',
        contact: '078965412365',
        location: 'Kigali',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Transportation services
      {
        name_en: 'Yego Cab',
        name_rw: 'Yego Cab',
        category: 'transportation',
        description_en: 'Taxi service in Rwanda',
        description_rw: 'Serivisi ya Tagisi mu Rwanda',
        contact: '078654123658',
        location: 'Nationwide',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name_en: 'Move Rwanda',
        name_rw: 'Move Rwanda',
        category: 'transportation',
        description_en: 'Transportation service in Rwanda',
        description_rw: 'Serivisi yo gutwara abantu mu Rwanda',
        contact: '07896541236',
        location: 'Kigali',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name_en: 'Kigali Bus Service',
        name_rw: 'Serivisi ya Bisi ya Kigali',
        category: 'transportation',
        description_en: 'Public bus service in Kigali',
        description_rw: 'Serivisi ya bisi rusange mu Kigali',
        contact: '0789654125',
        location: 'Kigali',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Services', null, {});
  }
};
