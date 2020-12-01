'use strict';

const manyToManyMapping = {
  through: 'LaughBoxLaugh',
  otherKey: 'laughBoxId',
  foreignKey: 'laughId'
};

module.exports = (sequelize, DataTypes) => {
  const Laugh = sequelize.define('Laugh', {
    body: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  Laugh.associate = function(models) {
    Laugh.belongsTo(models.User, { foreignKey: "userId" });
    Laugh.hasMany(models.Rating, { foreignKey: "laughId" });
    Laugh.hasMany(models.Review, { foreignKey: "laughId" });
    Laugh.belongsToMany(models.LaughBox, manyToManyMapping);
  };
  return Laugh;
};
