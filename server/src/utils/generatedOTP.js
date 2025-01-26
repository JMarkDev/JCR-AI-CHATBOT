const generatedOTP = async () => {
  try {
    const generate = (otp = `${Math.floor(1000 + Math.random() * 9000)}`);
    // console.log(generate);
    return generate;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generatedOTP,
};
