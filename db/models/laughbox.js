'use strict';

const manyToManyMapping = {
	through: "LaughBoxLaugh",
	otherKey: "laughId",
  foreignKey: "laughboxId",
};

module.exports = (sequelize, DataTypes) => {
  const Laughbox = sequelize.define('Laughbox', {
    name: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  Laughbox.associate = function(models) {
    Laughbox.belongsTo(models.User, { foreignKey: 'userId' });
    Laughbox.belongsToMany(models.Laugh, manyToManyMapping);
  };
  return Laughbox;
};
