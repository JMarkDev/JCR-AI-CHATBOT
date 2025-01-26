const otpModel = require("../models/otpModel");
const { generatedOTP } = require("./generatedOTP");
const { sendEmail } = require("./sendEmail");
const { AUTH_EMAIL } = process.env;
const bcrypt = require("bcryptjs");
const saltRounds = 10;
// const { createdAt, expiresAt } = require("../utils/formattedTime");

const sendOTP = async ({ email, subject, message, duration = 1 }) => {
  try {
    if (!(email && subject && message)) {
      throw Error("Email, subject and message are required");
    }

    await otpModel.destroy({
      where: {
        email: email,
      },
    });

    //generate pin
    const generatedOtp = await generatedOTP();

    //send email
    const mailOptions = {
      from: AUTH_EMAIL,
      to: email,
      subject,
      html: `
            <p style="font-size: 18px; color: #333; margin-bottom: 10px;">${message}</p>

            <p style="color: tomato; font-size: 25px; letter-spacing: 2px; margin-bottom: 20px;"><b>${generatedOtp}</b></p>
        
            <p style="font-size: 16px; color: #555; margin-bottom: 10px;">Please note that this OTP is valid <b>for ${duration} minute(s)</b>.</p>
        
            <p style="font-size: 16px; color: #777; margin-top: 20px;">For security reasons, please do not share your OTP with anyone.</p>
            `,
    };

    await sendEmail(mailOptions);

    //save otp record
    const hashedOtp = await bcrypt.hash(generatedOtp.toString(), saltRounds);

    const createdAt = new Date(); // Change this line
    // 60000 number of milliseconds in 1 minute
    const expiresAt = new Date(createdAt.getTime() + 60000 * +duration); // Change this line

    const newOTP = await otpModel.create({
      email: email,
      otp: hashedOtp,
      createdAt: createdAt,
      expiresAt: expiresAt,
    });

    return newOTP;
  } catch (error) {
    throw error;
  }
};

module.exports = { sendOTP };
