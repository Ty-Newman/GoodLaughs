'use strict';

const manyToManyMapping = {
	through: "LaughBoxLaugh",
	otherKey: "laughId",
  foreignKey: "laughBoxId",
};

module.exports = (sequelize, DataTypes) => {
  const Laughbox = sequelize.define('LaughBox', {
    name: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  LaughBox.associate = function(models) {
    LaughBox.belongsTo(models.User, { foreignKey: 'userId' });
    LaughBox.belongsToMany(models.Laugh, manyToManyMapping);
  };
  return LaughBox;
};
