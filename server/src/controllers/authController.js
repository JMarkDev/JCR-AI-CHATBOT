const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const saltsRounds = 10;
const sequelize = require("../config/database");
require("dotenv").config();
const date = require("date-and-time");
const { setTokens } = require("../helpers/tokenHelpers");
const statusList = require("../constants/statusList");
const otpController = require("./otpController");

const handleRegister = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  console.log(req.body);

  try {
    const user = await userModel.findOne({
      where: {
        email: email,
        status: statusList.verified,
      },
    });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    await userModel.destroy({
      where: {
        email: email,
        status: statusList.pending,
      },
    });

    // send OTP to email
    await otpController.postOTP(email);

    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    const hashPassword = await bcrypt.hash(password, saltsRounds);

    await userModel.create({
      name,
      email,
      status: statusList.pending,
      password: hashPassword,
      createdAt: sequelize.literal(`'${formattedDate}'`),
    });

    return res.status(201).json({
      status: "success",
      message: `Verification OTP sent to ${email}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({
      where: {
        email: email,
        status: statusList.verified,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (matchPassword) {
      //  generate tokens
      const tokens = setTokens(res, { email });
      accessToken = tokens.accessToken;

      return res.status(200).json({
        status: "success",
        message: "Login successful",
        accessToken: accessToken,
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "Invalid password",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ Error: "Login error in server" });
  }
};

const handleLogout = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ status: "success", message: "Logout successful" });
};

module.exports = {
  handleRegister,
  handleLogin,
  handleLogout,
};
