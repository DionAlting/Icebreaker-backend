"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      question.hasMany(models.answer);
    }
  }
  question.init(
    {
      targetNumber: DataTypes.INTEGER,
      groupName: DataTypes.STRING,
      isAnswered: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "question",
    }
  );
  return question;
};
