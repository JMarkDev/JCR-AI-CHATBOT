const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "30d" });
};

const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN, { expiresIn: "3d" });
};

const setTokens = (res, user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Set secure HTTP-only cookies
  res.cookie("accessToken", accessToken, {
    // httpOnly: true,
    // maxAge: 30 * 60 * 1000, // 30 minutes
    maxAge: 30 * 24 * 60 * 60 * 1000, // 1 month
  }); // 30 minutes
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    // maxAge: 30 * 60 * 1000, // 30 minutes
    maxAge: 30 * 24 * 60 * 60 * 1000, // 1 month
  }); // 60 minutes

  return { accessToken, refreshToken };
};

module.exports = { generateAccessToken, generateRefreshToken, setTokens };
