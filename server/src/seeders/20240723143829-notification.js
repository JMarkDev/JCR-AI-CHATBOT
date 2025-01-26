"use strict";
const date = require("date-and-time");
const sequelize = require("../config/database");

module.exports = {
  async up(queryInterface, Sequelize) {
    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    return queryInterface.bulkInsert("notifications", [
      {
        id: 1,
        transactionId: 1,
        message: "New transaction created for animal type Cattle",
        ownerId: 1, // Refers to the owner with ID 13
        user_id: 1, // Replace with valid slaughterhouse ID if needed
        is_read: 0,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 2,
        transactionId: 1,
        message: "New transaction created for animal type Cattle",
        ownerId: 1, // Refers to the owner with ID 13
        user_id: 1, // Replace with valid slaughterhouse ID if needed
        is_read: 0,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 3,
        transactionId: 1,
        message: "New transaction created for animal type Cattle",
        ownerId: 1, // Refers to the owner with ID 13
        user_id: 1, // Replace with valid slaughterhouse ID if needed
        is_read: 0,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 4,
        transactionId: 1,
        message: "New transaction created for animal type Cattle",
        ownerId: 1, // Refers to the owner with ID 13
        user_id: 1, // Replace with valid slaughterhouse ID if needed
        is_read: 0,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 5,
        transactionId: 1,
        message: "New transaction created for animal type Cattle",
        ownerId: 1, // Refers to the owner with ID 13
        user_id: 1, // Replace with valid slaughterhouse ID if needed
        is_read: 0,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 6,
        transactionId: 1,
        message: "New transaction created for animal type Cattle",
        ownerId: 1, // Refers to the owner with ID 13
        user_id: 1, // Replace with valid slaughterhouse ID if needed
        is_read: 0,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("notifications", null, {});
  },
};
