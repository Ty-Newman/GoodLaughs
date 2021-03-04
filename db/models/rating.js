"use strict";
module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define(
    "Rating",
    {
      bows: DataTypes.BOOLEAN,
      lols: {
        type: DataTypes.NUMERIC,
        allowNull: true,
      },
      userId: DataTypes.INTEGER,
      laughId: DataTypes.INTEGER,
    },
    {}
  );
  Rating.associate = function (models) {
    Rating.belongsTo(models.User, { foreignKey: "userId" });
    Rating.belongsTo(models.Laugh, { foreignKey: "laughId" });
  };
  return Rating;
};
