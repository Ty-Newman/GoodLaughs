'use strict';
module.exports = (sequelize, DataTypes) => {
  const LaughBoxLaugh = sequelize.define('LaughBoxLaugh', {
    laughId: DataTypes.INTEGER,
    laughBoxId: DataTypes.INTEGER
  }, {});
  LaughBoxLaugh.associate = function(models) {
    LaughBoxLaugh.belongsTo(models.Laugh, {foreignKey: "laughId"})
    LaughBoxLaugh.belongsTo(models.LaughBox, {foreignKey: "laughBoxId"})
  };
  return LaughBoxLaugh;
};
