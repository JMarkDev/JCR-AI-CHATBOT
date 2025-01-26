const userModel = require("../models/userModel");
const otpModel = require("../models/otpModel");
const bcrypt = require("bcryptjs");
const { Sequelize } = require("sequelize");
const statusList = require("../constants/statusList");
const { sendOTP } = require("../utils/sendOTP");
const { createdAt } = require("../utils/formattedTime");
const { sendNotification } = require("../utils/emailNotifications");

const saltsRounds = 10;

const forgotPasswordOTP = async (req, res) => {
  const { email } = req.body;
  try {
    // if (!email) {
    //   return res.status(400).json({
    //     message: "Email is required",
    //   });
    // }
    const userExits = await userModel.findOne({
      where: {
        email: email,
        [Sequelize.Op.or]: [{ status: statusList.verified }],
      },
    });

    if (userExits) {
      await sendForgotOTP(email);

      return res.status(200).json({
        status: "success",
        message: `Verification OTP sent to ${email}`,
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "User not found. Please enter a valid email",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const sendForgotOTP = async (email) => {
  try {
    const createdOTP = await sendOTP({
      email: email,
      subject: "Slaughterhouse Management System forgot password OTP",
      message:
        "To reset your password, please verify you email with the code below:",
      duration: 5,
    });

    return createdOTP;
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!otp) {
      return res.status(400).json({
        message: "OTP is required",
      });
    }

    const otpRecord = await otpModel.findOne({
      where: {
        email: email,
      },
    });

    const expiresAt = otpRecord.expiresAt;

    if (expiresAt < new Date()) {
      return res.status(400).json({
        message: "OTP has expired. Please request a new OTP",
      });
    }

    if (otpRecord) {
      const isMatch = await bcrypt.compare(otp, otpRecord.otp);

      if (isMatch) {
        return res.status(200).json({
          status: "success",
          message: "OTP verified successfully",
        });
      } else {
        return res.status(400).json({
          status: "error",
          message: "Invalid OTP",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltsRounds);
    const updateUser = await userModel.update(
      {
        password: hashedPassword,
        updatedAt: createdAt,
      },
      {
        where: {
          email: email,
        },
      }
    );

    await otpModel.destroy({
      where: {
        email: email,
      },
    });

    await sendNotification({
      email: email,
      subject: "Slaughterhouse Management System Password Reset",
      message: "Congatulations! Your password has been reset successfully.",
    });

    return res.status(200).json({
      updateUser,
      status: "success",
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { forgotPasswordOTP, verifyOTP, resetPassword };
