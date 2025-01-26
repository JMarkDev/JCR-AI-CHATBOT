import logo from "../../assets/ai_logo.jpeg";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="min-h-screen px-5 bg-gradient-to-br from-blue-100 via-blue-300 to-blue-400 flex flex-col items-center justify-center">
      <div className="flex flex-col rounded-md w-full bg-white shadow-xl justify-between items-center max-w-4xl mx-auto">
        <div className="flex md:flex-row flex-col justify-between  w-full">
          <div className="md:w-1/2 w-full p-6">
            <h1 className="font-bold text-left text-2xl sm:text-4xl bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text drop-shadow-lg hover:scale-105 transition-all duration-300">
              Create an Account!
            </h1>

            <form
              action="
        "
              className="mt-5 text-gray-600"
            >
              <div className="flex flex-col text-md text-gray-600 mb-4">
                <label htmlFor="name" className="text-md font-semibold">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="p-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                  placeholder="Enter your name"
                />
              </div>
              <div className="flex flex-col text-md text-gray-600 mb-4">
                <label htmlFor="email" className="text-md font-semibold">
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  className="p-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                  placeholder="Enter your email"
                />
              </div>
              <div className="flex flex-col text-md text-gray-600 mb-4">
                <label htmlFor="password" className="text-md font-semibold">
                  Password
                </label>
                <input
                  type="text"
                  id="password"
                  className="p-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                  placeholder="Enter your password"
                />
              </div>
              <div className="flex flex-col text-md text-gray-600 ">
                <label
                  htmlFor="confirmPassword"
                  className="text-md font-semibold"
                >
                  Confirm Password
                </label>
                <input
                  type="text"
                  id="confirmPassword"
                  className="p-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                  placeholder="Confirm your password"
                />
              </div>
              <button
                type="submit"
                className="mt-6 w-full p-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md hover:shadow-lg transition-all"
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
