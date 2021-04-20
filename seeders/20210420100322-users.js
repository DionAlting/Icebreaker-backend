"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          username: "David Stephenson",
          password: "admin",
          isHost: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: "Dion Alting",
          isHost: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null, {});
  },
};
