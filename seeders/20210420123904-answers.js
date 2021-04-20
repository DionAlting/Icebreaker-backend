"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "answers",
      [
        {
          questionId: 1,
          userId: 2,
          answer: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          questionId: 2,
          userId: 2,
          answer: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          questionId: 3,
          userId: 2,
          answer: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("answers", null, {});
  },
};
