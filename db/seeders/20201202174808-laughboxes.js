'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('LaughBoxes', [{
      name: 'big box of laughs',
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'little box of laughs',
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'barry-o\'s laugh box',
      userId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('LaughBoxes', null, {});
  }
};
