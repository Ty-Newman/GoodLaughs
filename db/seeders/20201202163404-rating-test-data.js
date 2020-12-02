'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Ratings', [{
      bows: true,
      lols: 5,
      userId: 1,
      laughId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      bows: false,
      lols: 4,
      userId: 1,
      laughId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Ratings', null, {});
  }
};
