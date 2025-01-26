import { useState, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import Loader from "../../components/loader/chatbot_loader/loadingBall";
import chatbotImg from "../../assets/chat_bot.png";
import { FaArrowDown } from "react-icons/fa6";
import { MdOutlineLogout } from "react-icons/md";
import LogoutModal from "../../components/loader/modal/LogoutModal";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hi! How can I assist you today? Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef(null); // To reference the end of the messages
  const messagesContainerRef = useRef(null); // To reference the messages container
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const checkScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // Check if the user is at the bottom
    const isAtBottom =
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - 10; // Adding a small buffer for precision

    // Show scroll button only if the user is not at the bottom and there is overflow
    setShowScrollButton(!isAtBottom);
  };

  useEffect(() => {
    const container = messagesContainerRef.current;

    const handleScroll = () => {
      checkScroll();
    };

    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  //   checkScroll(); // Recheck scroll visibility after scrolling
  // }, [messages]);

  const handleSend = () => {
    if (isLoading || !input.trim()) return;

    setMessages([...messages, { type: "user", text: input }]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "Thank you for your query! I'll look into it.",
        },
      ]);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <nav className="flex justify-between items-center py-4 px-8 shadow-lg bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-400 dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-700 dark:to-gray-900">
        <div className="text-2xl font-extrabold text-white dark:text-gray-100">
          JCR <span className="text-yellow-300">AI</span>
        </div>
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <label onChange={() => setDarkMode(!darkMode)} className="switch">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
          </div>
          <div className="relative group">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md text-blue-500 font-bold cursor-pointer dark:bg-gray-700 dark:text-gray-300">
              J
            </div>
            {/* <div className="absolute hidden group-hover:block top-12 right-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <ul className="text-gray-700 dark:text-gray-200">
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  Profile
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  Settings
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  Logout
                </li>
              </ul>
            </div> */}
          </div>
          <div>
            <MdOutlineLogout
              onClick={toggleModal}
              className="text-white dark:text-gray-100 text-2xl cursor-pointer"
            />
            <LogoutModal isOpen={isOpen} toggleModal={toggleModal} />
          </div>
        </div>
      </nav>

      <div
        ref={messagesContainerRef}
        className="flex-grow overflow-y-auto mb-24 md:px-20 p-6 space-y-4"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.type === "user"
                ? "justify-end pl-10"
                : "justify-start gap-4"
            }`}
          >
            {message.type === "bot" && (
              <div className="min-w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-100 shadow-md text-white font-bold">
                <img src={chatbotImg} alt="icon" className="w-8 h-8" />
              </div>
            )}

            <div
              className={`${
                message.type === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              } rounded-lg p-4 md:max-w-2xl shadow-md`}
            >
              {message.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center">
              <Loader />
            </div>
          </div>
        )}

        {showScrollButton && (
          <button
            onClick={() =>
              messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
            }
            className="absolute z-10 bottom-20 right-1/2 transform translate-x-1/2 bg-gray-200 dark:bg-gray-700 text-blue-400 dark:text-white p-2 rounded-full shadow-lg hover:bg-gray-300"
          >
            <FaArrowDown className="h-5 w-5" />
          </button>
        )}

        {/* This div will act as the scroll target */}
        <div ref={messagesEndRef} />
      </div>

      <div className="md:px-20 absolute bottom-0 w-full p-4 h-20 bg-white shadow-lg dark:bg-gray-800 flex items-center">
        <div className="relative flex-grow">
          <input
            type="text"
            className="w-full border rounded-full p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 text-xl dark:text-blue-400 dark:hover:text-blue-600"
          >
            <IoSend className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
