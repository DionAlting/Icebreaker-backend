"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "questions",
      [
        {
          question: "Do you like mountains",
          targetNumber: 10,
          groupName: "yellow",
          isAnswered: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          question: "Do you have a cat",
          targetNumber: 20,
          groupName: "blue",
          isAnswered: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          question: "Are you vegetarian",
          targetNumber: 15,
          groupName: "red",
          isAnswered: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("questions", null, {});
  },
};
