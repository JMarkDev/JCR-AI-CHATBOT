const sequelize = require("../config/database");
const userModel = require("../models/userModel");
const date = require("date-and-time");
const fs = require("fs");
const otpController = require("./otpController");
const bcrypt = require("bcryptjs");
const saltsRounds = 10;

const getUserByEmail = async (req, res) => {
  const { email } = req.query;
  try {
    const user = await userModel.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "No user found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ Error: "Get user by email error in server" });
  }
};

const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { image, name, birthDate, contactNumber } = req.body;
  try {
    const user = await userModel.findOne({ where: { id } });

    if (!user) {
      return res.status(400).json({
        message: "No user found",
      });
    }

    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    // upload image
    let newFileName = null;
    if (req.file) {
      let filetype = req.file.mimetype.split("/")[1];
      newFileName = req.file.filename + "." + filetype;
      fs.rename(
        `./uploads/${req.file.filename}`,
        `./uploads/${newFileName}`,
        async (err) => {
          if (err) throw err;
          console.log("uploaded successfully");
        }
      );
    }

    const updateUser = await userModel.update(
      {
        image: newFileName ? `/uploads/${newFileName}` : user.image,
        name: name,
        birthDate: birthDate,
        contactNumber: contactNumber,
        updatedAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        where: { id },
      }
    );

    return res.status(200).json({
      status: "success",
      updateUser,
      message: "User profile updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const updateEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const existUser = await userModel.findOne({
      where: {
        email: email,
      },
    });

    if (!email.trim()) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    if (existUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    await otpController.postOTP(email);
    return res.status(200).json({
      status: "success",
      message: `Verification OTP sent to ${email}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const updatePassword = async (req, res) => {
  const { id } = req.params;
  const { password, new_password, confirm_password } = req.body;

  try {
    const user = await userModel.findByPk(id);
    const createdAt = new Date();
    const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

    if (!password) {
      return res.status(404).json({ message: "Password is required" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (new_password.length < 8) {
      return res
        .status(400)
        .json({ message: "New password must be at least 8 characters" });
    }

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    if (new_password !== confirm_password) {
      return res
        .status(400)
        .json({ message: "New password and Confirm password do not match" });
    }

    const hashPassword = await bcrypt.hash(new_password, saltsRounds);

    await userModel.update(
      {
        password: hashPassword,
        updatedAt: sequelize.literal(`'${formattedDate}'`),
      },
      {
        where: { id },
      }
    );

    return res.status(200).json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const paidSubscription = async (req, res) => {
  const { userId, subscription } = req.query;

  // Validate userId
  if (!userId || isNaN(Number(userId))) {
    return res.status(400).json({ message: "Invalid or missing user ID." });
  }

  // Validate subscription type
  const validPlans = ["weekly", "monthly", "yearly"];
  if (!validPlans.includes(subscription)) {
    return res.status(400).json({ message: "Invalid subscription type." });
  }

  try {
    const expiryDate = new Date();
    switch (subscription) {
      case "weekly":
        expiryDate.setDate(expiryDate.getDate() + 7);
        break;
      case "monthly":
        expiryDate.setMonth(expiryDate.getMonth() + 1);
        break;
      case "yearly":
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        break;
    }

    // Format expiry date for MySQL (LOCAL time)
    const formattedExpiryDate = formatDate(expiryDate);

    const [updated] = await userModel.update(
      {
        subscriptionPlan: subscription,
        subscriptionExpiry: formattedExpiryDate,
      },
      { where: { id: userId } }
    );

    if (updated) {
      return res.status(200).json({
        message: `Subscription updated successfully to ${subscription}.`,
        subscriptionPlan: subscription,
        subscriptionExpiry: formattedExpiryDate, // Fixed timezone issue
      });
    } else {
      return res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const isSubscriptionActive = async (userId) => {
  const user = await userModel.findByPk(userId);
  if (
    !user.subscriptionExpiry ||
    new Date() > new Date(user.subscriptionExpiry)
  ) {
    await userModel.update(
      { subscriptionPlan: null, subscriptionExpiry: null },
      { where: { id: userId } }
    );
    return false;
  }
  return true;
};

module.exports = {
  getUserByEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  paidSubscription,
};
