'use strict';
module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    bows: DataTypes.BOOLEAN,
    lols: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    laughId: DataTypes.INTEGER
  }, {});
  Rating.associate = function(models) {
    Rating.belongsTo(models.Users, {foreignKey: "userId"});
    Rating.belongsTo(models.Laughs, {foreignKey: "laughId"});
  };
  return Rating;
};
