"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Reviews",
      [
        {
          body: "My favorite joke about the color red!",
          userId: 1,
          laughId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          body:
            "It would be fun to have quirky and funny reviews in our seeder but I'm not much of a comic",
          userId: 2,
          laughId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          body: "I'm not a doctor, and I love this joke",
          userId: 2,
          laughId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Review", null, {});
  },
};
