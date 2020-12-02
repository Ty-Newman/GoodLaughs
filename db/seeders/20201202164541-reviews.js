'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Review', [{
          body: 'Insert review test here',
          userId: 1,
          laughId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          body: 'It would have been fun to have quirky and funny reviews in our seeder but I\'m not much of a comic',
          userId: 2,
          laughId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          body: 'Additional review text',
          userId: 2,
          laughId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ], {});
  },

  down: (queryInterface, Sequelize) => {
     return queryInterface.bulkDelete('Review', null, {});
  }
};
