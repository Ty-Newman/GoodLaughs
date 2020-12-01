'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('LaughBoxLaughs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      laughId: {
        type: Sequelize.INTEGER,
        references: { model: "Laughs" }
      },
      laughBoxId: {
        type: Sequelize.INTEGER,
        references: { model: "LaughBoxes" }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('LaughBoxLaughs');
  }
};
