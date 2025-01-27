import PropTypes from "prop-types";
import { useState } from "react";
import api from "../../api/axios";
import LoginLoading from "../../components/loader/login_loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FiEyeOff, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const UpdatePassword = ({ email }) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassError, setConfirmPassError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    setLoading(true);
    setPasswordError("");
    setErrorMessage("");
    setConfirmPassError("");
    e.preventDefault();
    try {
      const data = {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      };

      const response = await api.put("/auth/reset-password", data, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.status === "success") {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);

        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      if (error.response.data.errors) {
        error.response.data.errors.forEach((error) => {
          if (error.path === "password") {
            setPasswordError(error.msg);
          } else if (error.path === "confirmPassword") {
            setConfirmPassError(error.msg);
          }
        });
      }
      setErrorMessage(error.response.data.message);
      console.log(error);
    }
  };

  const handleShowPass = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className=" px-5 flex items-center justify-center w-full h-screen bg-gradient-to-br from-blue-100 via-blue-300 to-blue-400">
        {" "}
        <ToastContainer />
        {isLoading && <LoginLoading />}
        <div className="relative w-full max-w-lg  max-h-full">
          <div className="relative text-gray-800 bg-white rounded-xl shadow-lg ">
            <div className="p-6 py-8 space-y-4 text-sm text-[#221f1f]">
              <div className="flex gap-5 rounded-t">
                <button
                  onClick={() => navigate(-1)}
                  className="text-2xl font-bold"
                >
                  <IoMdArrowRoundBack />
                </button>
                <h1 className="md:text-2xl font-bold text-lg ">New Password</h1>
              </div>
              <h3 className="text-sm md:text-[16px] text-gray-700">
                Please enter your new password below
              </h3>
              <form onSubmit={handleLogin}>
                <label
                  htmlFor="password"
                  className="block mb-2 mt-4 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <div className="flex relative">
                  <span className="absolute h-full inline-flex   items-center px-3 text-sm text-gray-900 ">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 2a4 4 0 00-4 4v4H5a3 3 0 00-3 3v5a3 3 0 003 3h10a3 3 0 003-3v-5a3 3 0 00-3-3h-1V6a4 4 0 00-4-4zm-3 6V6a3 3 0 016 0v4H7zm3 4a1 1 0 100 2 1 1 0 000-2z" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className={`rounded-lg pl-12 bg-gray-50 border  ${
                      passwordError || errorMessage
                        ? "border-red-500 "
                        : "border-gray-300 "
                    } text-gray-900 focus:ring-blue-500 focus:border-blue-100 block flex-1 min-w-0 w-full text-sm p-2.5 `}
                    placeholder="Enter password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    onClick={handleShowPass}
                    className="absolute right-0 text-lg m-3 text-gray-700"
                  >
                    {" "}
                    {showPassword ? <FiEye /> : <FiEyeOff />}
                  </span>
                </div>
                {passwordError && (
                  <span className="text-red-500 text-sm">{passwordError}</span>
                )}
                <label
                  htmlFor="password"
                  className="block mb-2 mt-4 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm Password
                </label>
                <div className="flex relative">
                  <span className="absolute h-full inline-flex   items-center px-3 text-sm text-gray-900 ">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 2a4 4 0 00-4 4v4H5a3 3 0 00-3 3v5a3 3 0 003 3h10a3 3 0 003-3v-5a3 3 0 00-3-3h-1V6a4 4 0 00-4-4zm-3 6V6a3 3 0 016 0v4H7zm3 4a1 1 0 100 2 1 1 0 000-2z" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    className={`rounded-lg pl-12 bg-gray-50 border  ${
                      confirmPassError || errorMessage
                        ? "border-red-500 "
                        : "border-gray-300 "
                    } text-gray-900 focus:ring-blue-500 focus:border-blue-100 block flex-1 min-w-0 w-full text-sm p-2.5 `}
                    placeholder="Enter confirm password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <span
                    onClick={handleShowPass}
                    className="absolute right-0 text-lg m-3 text-gray-700"
                  >
                    {" "}
                    {showPassword ? <FiEye /> : <FiEyeOff />}
                  </span>
                </div>
                {confirmPassError && (
                  <span className="text-red-500 text-sm">
                    {confirmPassError}
                  </span>
                )}
                {errorMessage && (
                  <span className="text-red-500 text-sm">{errorMessage}</span>
                )}

                <button
                  type="submit"
                  disabled={isLoading ? true : false}
                  className={` ${
                    isLoading ? "cursor-not-allowed" : "cursor-pointer"
                  } w-full  mt-6 p-2 bg-blue-500 hover:bg-blue-700  text-[#fff] md:text-lg text-sm rounded-lg`}
                >
                  Continue
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

UpdatePassword.propTypes = {
  modal: PropTypes.bool,
  closeModal: PropTypes.func,
  email: PropTypes.string.isRequired,
};

export default UpdatePassword;
