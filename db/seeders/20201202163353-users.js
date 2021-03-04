"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", [
      {
        username: "Demo",
        email: "demo@demo.com",
        hashedPassword: await bcrypt.hash("password", 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "Patrice O'Neal",
        email: "patriceoneal@gmail.com",
        hashedPassword: await bcrypt.hash("patrice", 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "Barack Obama",
        email: "barack@gmail.com",
        hashedPassword: await bcrypt.hash("barack", 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
