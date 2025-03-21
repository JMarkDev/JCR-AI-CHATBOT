import propTypes from "prop-types";

export default function WelcomeModal({ isOpen, onClose, freeQuestions }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <svg
            className="w-16 h-16 text-green-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2a10 10 0 1 0 10 10A10.02 10.02 0 0 0 12 2Zm5 8.59-6.41 6.42a1 1 0 0 1-1.42 0l-2.59-2.6a1 1 0 0 1 1.42-1.42l1.89 1.89 5.71-5.7a1 1 0 0 1 1.4 1.42Z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold">Welcome to Our Chatbot! 🎉</h2>
        <p className="mt-2 text-gray-600">
          You have{" "}
          <span className="font-bold text-green-500">{freeQuestions} FREE</span>{" "}
          questions to ask! Enjoy exploring the chatbot&apos;s features.
        </p>
        <button
          onClick={() => onClose(false)}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg mt-4 w-full"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}

WelcomeModal.propTypes = {
  isOpen: propTypes.bool,
  onClose: propTypes.func,
  freeQuestions: propTypes.number,
};
