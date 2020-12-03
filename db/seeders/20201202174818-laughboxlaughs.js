'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('LaughBoxLaughs', [{
      laughId: 1,
      laughBoxId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      laughId: 1,
      laughBoxId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      laughId: 5,
      laughBoxId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      laughId: 6,
      laughBoxId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      laughId: 7,
      laughBoxId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('LaughBoxLaughs', null, {});
  }
};
