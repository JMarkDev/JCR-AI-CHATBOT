import { Link } from "react-router-dom";

const AuthAlert = () => {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="p-8 w-full max-w-md bg-white rounded-2xl shadow-lg text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/295/295128.png"
          alt="Welcome Icon"
          className="w-16 h-16 mx-auto mb-4"
        />
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back! 🎉</h2>
        <p className="text-gray-600 mt-3">
          Log in or sign up to enjoy smarter responses.
        </p>

        <div className="mt-6 flex flex-col space-y-3">
          <Link
            to="/login"
            className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition duration-300 shadow-md"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="px-5 py-3 bg-gray-200 text-gray-900 font-semibold rounded-full hover:bg-gray-300 transition duration-300 shadow-md"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthAlert;
