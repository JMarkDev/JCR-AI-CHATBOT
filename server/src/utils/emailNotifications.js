const { sendEmail } = require("./sendEmail");

const sendNotification = async ({ email, subject, message }) => {
  try {
    if (!email && subject && message) {
      throw Error("Email, subject and message are required");
    }

    const mailOptions = {
      from: "wmsuesudocumenttracker@gmail.com",
      to: email,
      subject,
      html: `<p style="font-size: 18px; color: #333; margin-bottom: 10px;">${message}</p>`,
    };

    return await sendEmail(mailOptions);
  } catch (error) {
    throw error;
  }
};

module.exports = { sendNotification };
