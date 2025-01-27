import PropTypes from "prop-types";
import "./otp.css";
import sentImage from "../../assets/undraw_mail-sent_ujev.svg";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import LoginLoading from "../../components/loader/login_loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpdatePassword from "../Auth/UpdatePassword";

const ForgotPasswordOTP = ({ email, closeOTP, closeModal }) => {
  const [countDown, setCountDown] = useState(0);
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showUpdatePass, setShowUpdatePass] = useState(false);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]?$/.test(value)) {
      // Ensuring only digits are entered
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      // Automatically focus the next input if a digit is entered
      if (value && index < 3) {
        document.getElementById(`otp-input${index + 2}`).focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    setErrorMessage("");
    setLoading(true);
    e.preventDefault();

    const data = {
      email: email,
      otp: otp.join(""),
    };
    try {
      const response = await api.post("/auth/verify-otp-forgot", data, {
        withCredentials: true,
      });

      if (response.data.status === "success") {
        setShowUpdatePass(true);
        // closeOTP();
        // closeModal(false);
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
      console.log(error.response);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      const response = await api.post("/auth/resend-otp", { email: email });
      if (response.data.status === "success") {
        toast.success(response.data.message);
        setCountDown(60);
        setLoading(false);
        setErrorMessage("");
        setOtp(new Array(4).fill(""));
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (countDown > 0) {
      setTimeout(() => setCountDown(countDown - 1), 1000);
    }
  }, [countDown]);

  const disableSubmit = otp.includes("") || otp.length < 4;
  return (
    <>
      <div className=" px-5 flex items-center justify-center w-full h-screen bg-gradient-to-br from-blue-100 via-blue-300 to-blue-400">
        <ToastContainer />
        {loading && <LoginLoading />}

        {showUpdatePass ? (
          <UpdatePassword closeModal={closeModal} email={email} />
        ) : (
          <form className="otp-Form" onSubmit={handleSubmit}>
            <span className="mainHeading">Enter OTP</span>
            <img src={sentImage} alt="" className="w-32" />
            <p className="otpSubheading">
              Please enter the 4 digit OTP sent to <span>{email}</span>
            </p>
            <div className="inputContainer">
              {otp?.map((digit, index) => (
                <input
                  key={index}
                  required
                  maxLength="1"
                  type="text"
                  className="otp-input"
                  id={`otp-input${index + 1}`}
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                />
              ))}
            </div>
            {errorMessage && (
              <span className="text-red-600 text-sm">{errorMessage}</span>
            )}

            <button
              disabled={disableSubmit ? true : false}
              className={`verifyButton bg-blue-500 ${
                disableSubmit ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              type="submit"
            >
              Verify
            </button>
            <button className="exitBtn" type="button" onClick={closeOTP}>
              ×
            </button>
            <p className="resendNote text-gray-700 ">
              Didn&apos;t receive the code?{" "}
              <button
                onClick={handleResend}
                className={`resendBtn text-blue-500  ${
                  countDown > 0 ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                type="button"
                disabled={countDown > 0}
              >
                {`${
                  countDown > 0 ? `Resend code in ${countDown}s` : "Resend Code"
                }`}
              </button>
            </p>
          </form>
        )}
      </div>
    </>
  );
};

ForgotPasswordOTP.propTypes = {
  email: PropTypes.string.isRequired,
  closeOTP: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default ForgotPasswordOTP;
