import logo from "../../assets/ai_logo.jpeg";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen px-5 bg-gradient-to-br from-blue-100 via-blue-300 to-blue-400 flex flex-col items-center justify-center">
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
            <form className="mt-6 w-full text-gray-600">
              <div className="flex flex-col text-md mb-4">
                <label htmlFor="email" className="text-sm font-semibold">
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  className="p-3 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm hover:shadow-md transition-all"
                  placeholder="Enter your email"
                />
              </div>
              <div className="flex flex-col text-md">
                <label htmlFor="password" className="text-sm font-semibold">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="p-3 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm hover:shadow-md transition-all"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="mt-6 w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md hover:shadow-lg transition-all"
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
