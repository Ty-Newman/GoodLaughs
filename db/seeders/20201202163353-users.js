'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.bulkInsert('Users', [{
     username: 'Patrice O\'Neal',
     email: 'patriceoneal@gmail.com',
     hashedPassword: 'patrice',
     createdAt: new Date(),
     updatedAt: new Date()
   }, 
   {
    username: 'Barack Obama',
    email: 'barack@gmail.com',
    hashedPassword: 'barack',
    createdAt: new Date(),
    updatedAt: new Date()
   }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
};
