"use strict";

const bcrypt = require("bcryptjs");
const saltsRounds = 10;
const rolesList = require("../constants/rolesList");
const statusList = require("../constants/statusList");
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
     *
     */

    // Generate hashed password
    const hashPassword = await bcrypt.hash("password", saltsRounds);

    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    return queryInterface.bulkInsert("users", [
      {
        id: 1,
        firstName: "Josiel Mark",
        lastName: "Seroy",
        middleInitial: "M",
        email: "jmseroy@gmail.com",
        contactNumber: "01234567789",
        address: "Pagadian City",
        role: rolesList.admin,
        password: hashPassword,
        status: statusList.verified,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 2,
        firstName: " Mark",
        lastName: "Seroy",
        middleInitial: "M",
        email: "jmseroy2001@gmail.com",
        contactNumber: "01234567789",
        address: "Pagadian City",
        role: rolesList.admin,
        password: hashPassword,
        status: statusList.verified,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 3,
        firstName: " Mark",
        lastName: "Seroy",
        middleInitial: "M",
        email: "jmseroy1@gmail.com",
        contactNumber: "01234567789",
        address: "Pagadian City",
        role: rolesList.supervisor,
        password: hashPassword,
        status: statusList.verified,
        createdAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        id: 4,
        firstName: " Mark",
        lastName: "Seroy",
        middleInitial: "M",
        email: "jmseroy2@gmail.com",
        contactNumber: "01234567789",
        address: "Pagadian City",
        role: rolesList.supervisor,
        password: hashPassword,
        status: statusList.verified,
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
    return queryInterface.bulkDelete("users", null, {});
  },
};
