'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING(30),
    email: DataTypes.STRING(100),
    hashedPassword: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Laugh, { foreignKey: 'userId' })
    User.hasMany(models.LaughBox, { foreignKey: 'userId' })
    User.hasMany(models.Review, { foreignKey: 'userId' })
    User.hasMany(models.Rating, { foreignKey: 'userId' })
  };
  return User;
};
