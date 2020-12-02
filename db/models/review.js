'use strict';
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    body: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    laughId: DataTypes.INTEGER
  }, {});
  Review.associate = function(models) {
    Review.belongsTo(models.User, {foreignKey: "userId"});
    Review.belongsTo(models.Laugh, {foreignKey: "laughId"});
  };
  return Review;
};
