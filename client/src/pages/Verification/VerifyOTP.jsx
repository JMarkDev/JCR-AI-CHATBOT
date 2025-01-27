import LoginLoading from "../../components/loader/login_loader/Loader";
import sentImage from "../../assets/undraw_mail-sent_ujev.svg";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "./otp.css";
import { IoReturnUpBackOutline } from "react-icons/io5";

const VerifyOTP = () => {
  const location = useLocation();
  const email = location.state?.email;
  console.log(email);
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [countDown, setCountDown] = useState(0);

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
      const response = await api.post("/auth/verify-otp", data, {
        withCredentials: true,
      });

      if (response.data.status === "success") {
        const accessToken = response.data?.accessToken;

        toast.success(response.data.message);
        if (accessToken) {
          Cookies.set("accessToken", accessToken, { expires: 1 });
          // Set the access token in the axios headers
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;

          navigate("/chat");
        }
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
        {loading && <LoginLoading />}
        <ToastContainer />

        <form className="otp-Form" onSubmit={handleSubmit}>
          <div className="flex relative items-center justify-center w-full">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="left-0 absolute text-2xl font-bold "
            >
              <IoReturnUpBackOutline />
            </button>
            <span className="mainHeading">Enter OTP</span>
          </div>

          <img src={sentImage} alt="" className="w-32" />
          <p className="otpSubheading text-gray-700">
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
            className={`verifyButton bg-blue-500 hover:bg-blue-700 ${
              disableSubmit ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            type="submit"
          >
            Verify
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
      </div>
    </>
  );
};

export default VerifyOTP;
