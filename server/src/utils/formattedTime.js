const sequelize = require("../config/database");
const date = require("date-and-time");

// Get the current date and time
const dateNow = new Date();

// Format the current date
const formatedDate = date.format(dateNow, "YYYY/MM/DD HH:mm:ss");

// Create the 'createdAt' timestamp using the formatted date
const createdAt = sequelize.literal(`'${formatedDate}'`);

// Add 5 minutes to the current date and format it
const expiresDate = date.addMinutes(dateNow, 5);
const formatedExpiresDate = date.format(expiresDate, "YYYY/MM/DD HH:mm:ss");
const expiresAt = sequelize.literal(`'${formatedExpiresDate}'`);

module.exports = { createdAt, expiresAt };
