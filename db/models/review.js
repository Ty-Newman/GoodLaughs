'use strict';
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    body: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    laughId: DataTypes.INTEGER
  }, {});
  Review.associate = function(models) {
    Review.belongsTo(models.Users, {foreignKey: "userId"});
    Review.belongsTo(models.Laughs, {foreignKey: "laughId"});
  };
  return Review;
};
