import logo from "../../assets/ai_logo.jpeg";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import api from "../../api/axios";
import LoginLoading from "../../components/loader/login_loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "../../AuthContext/AuthContext";

const Login = () => {
  const { fetchUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", data);
      if (response.data.status === "success") {
        fetchUser();
        toast.success(response.data.message);
        setLoading(false);
        setTimeout(() => {
          navigate("/chat");
        }, 500);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.response?.data?.message);
      if (error.response.data.errors) {
        error.response.data.errors.forEach((error) => {
          switch (error.path) {
            case "email":
              setEmailError(error.msg);
              break;
            case "password":
              setPasswordError(error.msg);
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
      {loading && <LoginLoading />}
      <ToastContainer />
      <div className="flex flex-col w-full rounded-lg bg-white shadow-2xl justify-between items-center max-w-4xl mx-auto ">
        <div className="flex md:flex-row flex-col items-center w-full">
          {/* Form Section */}
          <div className="md:w-1/2  w-full flex flex-col p-8 h-full">
            <h1 className="font-bold text-left text-2xl sm:text-4xl bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text drop-shadow-lg hover:scale-105 transition-all duration-300">
              Welcome Back!
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Please sign in to continue
            </p>
            <form
              onSubmit={handleSubmit}
              className="mt-6 w-full text-sm text-gray-600"
            >
              <div className="flex flex-col text-md mb-4">
                <label htmlFor="email" className="text-sm font-semibold">
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className={`${
                    emailError ? "border-red-500" : "border-gray-300"
                  } p-3 rounded-lg bg-gray-100 border  focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm hover:shadow-md transition-all`}
                  placeholder="Enter your email"
                />
                {emailError && (
                  <span className="text-red-500 text-sm">
                    {emailError && emailError}
                  </span>
                )}
              </div>
              <div className="flex flex-col text-md">
                <label htmlFor="password" className="text-sm font-semibold">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                  className={` ${
                    passwordError ? "border-red-500" : "border-gray-300"
                  } p-3 rounded-lg bg-gray-100 border  focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm hover:shadow-md transition-all`}
                  placeholder="Enter your password"
                />
                {passwordError && (
                  <span className="text-red-500 text-sm">
                    {passwordError && passwordError}
                  </span>
                )}
              </div>
              <p className="text-sm text-right mt-2">
                <Link to={"/forgot-password"} className="text-blue-500 mt-2">
                  Forgot Password?
                </Link>
              </p>

              <button
                type="submit"
                disabled={loading}
                className={`${loading ? "cursor-not-allowed" : "cursor-pointer"}
                  mt-6 w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md hover:shadow-lg transition-all`}
              >
                Login
              </button>
              <p className="mt-4 text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <span className="text-blue-500 font-semibold">
                  <Link to={"/register"}>Register</Link>
                </span>
              </p>
            </form>
          </div>

          {/* Logo Section */}
          <div className="md:w-1/2 w-full mx-auto hidden md:block">
            <img src={logo} alt="logo" className="h-full w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
