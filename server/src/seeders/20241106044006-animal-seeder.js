"use strict";

const date = require("date-and-time");
const sequelize = require("../config/database");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    return queryInterface.bulkInsert("animals", [
      {
        id: 1,
        type: "Cattle",
        weight: 100,
        pricePerKg: 200.0,
        total: 20000.0,
        slaughterDate: "2021-11-06",
        slaughterhouseId: 1,
        transactionId: 1,
        // ownerId: 1,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 2,
        type: "Cattle",
        weight: 100,
        pricePerKg: 200.0,
        total: 20000.0,
        slaughterDate: "2021-11-06",
        slaughterhouseId: 1,
        transactionId: 2,
        // ownerId: 1,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 3,
        type: "Cattle",
        weight: 100,
        pricePerKg: 200.0,
        total: 20000.0,
        slaughterDate: "2021-11-06",
        slaughterhouseId: 1,
        transactionId: 3,
        // ownerId: 1,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 4,
        type: "Cattle",
        weight: 100,
        pricePerKg: 200.0,
        total: 20000.0,
        slaughterDate: "2021-11-06",
        slaughterhouseId: 1,
        transactionId: 4,
        // ownerId: 1,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 5,
        type: "Cattle",
        weight: 100,
        pricePerKg: 200.0,
        total: 20000.0,
        slaughterDate: "2021-11-06",
        slaughterhouseId: 1,
        transactionId: 5,
        // ownerId: 1,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 6,
        type: "Pigs",
        weight: 100,
        pricePerKg: 200.0,
        total: 20000.0,
        slaughterDate: "2021-11-06",
        slaughterhouseId: 1,
        transactionId: 6,
        // ownerId: 1,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 7,
        type: "Pigs",
        weight: 100,
        pricePerKg: 200.0,
        total: 20000.0,
        slaughterDate: "2021-11-06",
        slaughterhouseId: 1,
        transactionId: 7,
        // ownerId: 1,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 8,
        type: "Pigs",
        weight: 100,
        pricePerKg: 200.0,
        total: 20000.0,
        slaughterDate: "2021-11-06",
        slaughterhouseId: 1,
        transactionId: 8,
        // ownerId: 1,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 9,
        type: "Pigs",
        weight: 100,
        pricePerKg: 200.0,
        total: 20000.0,
        slaughterDate: "2021-11-06",
        slaughterhouseId: 1,
        transactionId: 9,
        // ownerId: 1,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 10,
        type: "Pigs",
        weight: 100,
        pricePerKg: 200.0,
        total: 20000.0,
        slaughterDate: "2021-11-06",
        slaughterhouseId: 1,
        transactionId: 10,
        // ownerId: 1,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 11,
        type: "Goats",
        weight: 100,
        pricePerKg: 200.0,
        total: 20000.0,
        slaughterDate: "2021-11-06",
        slaughterhouseId: 1,
        transactionId: 11,
        // ownerId: 1,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 12,
        type: "Goats",
        weight: 100,
        pricePerKg: 200.0,
        total: 20000.0,
        slaughterDate: "2021-11-06",
        slaughterhouseId: 1,
        transactionId: 12,
        // ownerId: 1,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 13,
        type: "Goats",
        weight: 100,
        pricePerKg: 200.0,
        total: 20000.0,
        slaughterDate: "2021-11-06",
        slaughterhouseId: 1,
        transactionId: 13,
        // ownerId: 1,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 14,
        type: "Goats",
        weight: 100,
        pricePerKg: 200.0,
        total: 20000.0,
        slaughterDate: "2021-11-06",
        slaughterhouseId: 1,
        transactionId: 14,
        // ownerId: 1,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 15,
        type: "Goats",
        weight: 100,
        pricePerKg: 200.0,
        total: 20000.0,
        slaughterDate: "2021-11-06",
        slaughterhouseId: 1,
        transactionId: 15,
        // ownerId: 1,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("animals", null, {});
  },
};
