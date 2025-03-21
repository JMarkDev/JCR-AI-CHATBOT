import { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import propTypes from "prop-types";

const SuccessPayment = ({ onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(false); // Automatically closes the modal after 5 seconds
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md relative">
        <FaCheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold text-gray-800">
          Payment Successful! 🎉
        </h2>
        <p className="text-gray-600 mt-2">
          Thank you for your purchase. Your subscription is now active.
        </p>
        <p className="text-gray-500 text-sm mt-4">
          This window will close in 5 seconds...
        </p>
        <button
          onClick={() => onClose(false)}
          className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

SuccessPayment.propTypes = {
  onClose: propTypes.func,
};

export default SuccessPayment;
