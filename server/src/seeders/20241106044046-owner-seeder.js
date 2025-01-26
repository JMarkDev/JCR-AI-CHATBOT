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
     *
     */

    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    return queryInterface.bulkInsert("owners", [
      {
        id: 1,
        customerName: "Josiel Mark Seroy",
        customerPhone: "01234567789",
        customerAddress: "Pagadian City",
        animalId: 1,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 2,
        customerName: "Josiel Mark Seroy",
        customerPhone: "01234567789",
        customerAddress: "Pagadian City",
        animalId: 2,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 3,
        customerName: "Josiel Mark Seroy",
        customerPhone: "01234567789",
        customerAddress: "Pagadian City",
        animalId: 3,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 4,
        customerName: "Josiel Mark Seroy",
        customerPhone: "01234567789",
        customerAddress: "Pagadian City",
        animalId: 4,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 5,
        customerName: "Josiel Mark Seroy",
        customerPhone: "01234567789",
        customerAddress: "Pagadian City",
        animalId: 5,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 6,
        customerName: "Josiel Mark Seroy",
        customerPhone: "01234567789",
        customerAddress: "Pagadian City",
        animalId: 6,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 7,
        customerName: "Josiel Mark Seroy",
        customerPhone: "01234567789",
        customerAddress: "Pagadian City",
        animalId: 7,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 8,
        customerName: "Josiel Mark Seroy",
        customerPhone: "01234567789",
        customerAddress: "Pagadian City",
        animalId: 8,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 9,
        customerName: "Josiel Mark Seroy",
        customerPhone: "01234567789",
        customerAddress: "Pagadian City",
        animalId: 9,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 10,
        customerName: "Josiel Mark Seroy",
        customerPhone: "01234567789",
        customerAddress: "Pagadian City",
        animalId: 10,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 11,
        customerName: "Josiel Mark Seroy",
        customerPhone: "01234567789",
        customerAddress: "Pagadian City",
        animalId: 11,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 12,
        customerName: "Josiel Mark Seroy",
        customerPhone: "01234567789",
        customerAddress: "Pagadian City",
        animalId: 12,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 13,
        customerName: "Josiel Mark Seroy",
        customerPhone: "01234567789",
        customerAddress: "Pagadian City",
        animalId: 13,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 14,
        customerName: "Josiel Mark Seroy",
        customerPhone: "01234567789",
        customerAddress: "Pagadian City",
        animalId: 14,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 15,
        customerName: "Josiel Mark Seroy",
        customerPhone: "01234567789",
        customerAddress: "Pagadian City",
        animalId: 15,
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
  },
};
