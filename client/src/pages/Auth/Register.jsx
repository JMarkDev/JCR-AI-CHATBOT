import logo from "../../assets/ai_logo.jpeg";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import LoginLoading from "../../components/loader/login_loader/Loader";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/register", data);
      if (response.data.status === "success") {
        toast.success(response.data.message);
        navigate("/verify-otp", { state: { email: data.email } });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
      if (error.response.data.errors) {
        error.response.data.errors.forEach((error) => {
          switch (error.path) {
            case "name":
              setNameError(error.msg);
              break;
            case "email":
              setEmailError(error.msg);
              break;
            case "password":
              setPasswordError(error.msg);
              break;
            case "confirmPassword":
              setConfirmPasswordError(error.msg);
              break;
            default:
              toast.error(error.message);
          }
        });
      }
    }
  };
  return (
    <div className="min-h-screen px-5 bg-gradient-to-br from-blue-100 via-blue-300 to-blue-400 flex flex-col items-center justify-center">
      <ToastContainer />
      {loading && <LoginLoading />}
      <div className="flex flex-col rounded-md w-full bg-white shadow-xl justify-between items-center max-w-4xl mx-auto">
        <div className="flex md:flex-row flex-col justify-between  w-full">
          <div className="md:w-1/2 w-full p-6">
            <h1 className="font-bold text-left text-2xl sm:text-4xl bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text drop-shadow-lg hover:scale-105 transition-all duration-300">
              Create an Account!
            </h1>

            <form
              action="
        "
              onSubmit={handleRegister}
              className="mt-5 text-gray-600 text-sm"
            >
              <div className="flex flex-col text-md text-gray-600 mb-4">
                <label htmlFor="name" className="text-md font-semibold">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  className={` ${
                    nameError ? "border-red-500" : "border-gray-300"
                  } p-2  rounded-lg bg-gray-100 border  focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm`}
                  placeholder="Enter your name"
                />
                {nameError && (
                  <span className="text-red-500 text-sm">{nameError}</span>
                )}
              </div>
              <div className="flex flex-col text-md text-gray-600 mb-4">
                <label htmlFor="email" className="text-md font-semibold">
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className={`${
                    emailError ? "border-red-500" : "border-gray-300"
                  } p-2 rounded-lg bg-gray-100 border  focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm`}
                  placeholder="Enter your email"
                />
                {emailError && (
                  <span className="text-red-500 text-sm">{emailError}</span>
                )}
              </div>
              <div className="flex flex-col text-md text-gray-600 mb-4">
                <label htmlFor="password" className="text-md font-semibold">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                  className={`${
                    passwordError ? "border-red-500 " : "border-gray-300"
                  } p-2 rounded-lg bg-gray-100 border  focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm`}
                  placeholder="Enter your password"
                />
                {passwordError && (
                  <span className="text-red-500 text-sm">
                    {passwordError && passwordError}
                  </span>
                )}
              </div>
              <div className="flex flex-col text-md text-gray-600 ">
                <label
                  htmlFor="confirmPassword"
                  className="text-md font-semibold"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  onChange={(e) =>
                    setData({ ...data, confirmPassword: e.target.value })
                  }
                  className={` ${
                    confirmPasswordError ? "border-red-500" : "border-gray-300 "
                  } p-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm`}
                  placeholder="Confirm your password"
                />
                {confirmPasswordError && (
                  <span className="text-red-500 text-sm">
                    {confirmPasswordError}
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className={` ${
                  loading ? "cursor-not-allowed" : "cursor-pointer"
                } mt-6 w-full p-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md hover:shadow-lg transition-all`}
              >
                Register
              </button>
              <p className="mt-5 text-sm">
                Already have an account?{" "}
                <span className="text-blue-500 font-semibold">
                  <Link to={"/login"}>Login</Link>
                </span>
              </p>
            </form>
          </div>
          <div className="md:w-1/2 w-full mx-auto hidden md:block">
            <img src={logo} alt="logo" className="h-full w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
