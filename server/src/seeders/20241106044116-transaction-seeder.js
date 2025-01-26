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

    return queryInterface.bulkInsert("transactions", [
      {
        id: 1,
        amountPaid: 20000.0,
        balance: 0.0,
        status: "Paid",
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 2,
        amountPaid: 0.0,
        balance: 0.0,
        status: "Unpaid",
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 3,
        amountPaid: 20000.0,
        balance: 0.0,
        status: "Partial",
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 4,
        amountPaid: 20000.0,
        balance: 0.0,
        status: "Paid",
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 5,
        amountPaid: 10000.0,
        balance: 10000.0,
        status: "Partial",
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 6,
        amountPaid: 20000.0,
        balance: 0.0,
        status: "Paid",
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 15,
        amountPaid: 20000.0,
        balance: 0.0,
        status: "Paid",
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 7,
        amountPaid: 20000.0,
        balance: 0.0,
        status: "Paid",
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 8,
        amountPaid: 20000.0,
        balance: 0.0,
        status: "Paid",
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 9,
        amountPaid: 20000.0,
        balance: 0.0,
        status: "Paid",
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 10,
        amountPaid: 20000.0,
        balance: 0.0,
        status: "Paid",
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 11,
        amountPaid: 20000.0,
        balance: 0.0,
        status: "Paid",
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 12,
        amountPaid: 20000.0,
        balance: 0.0,
        status: "Paid",
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 13,
        amountPaid: 20000.0,
        balance: 0.0,
        status: "Paid",
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 14,
        amountPaid: 20000.0,
        balance: 0.0,
        status: "Paid",
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
    return queryInterface.bulkDelete("transactions", null, {});
  },
};
