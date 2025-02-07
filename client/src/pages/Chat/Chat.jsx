import { useState, useEffect, useRef, useContext } from "react";
import { IoSend } from "react-icons/io5";
import Loader from "../../components/loader/chatbot_loader/loadingBall";
import chatbotImg from "../../assets/chat_bot.png";
import { FaArrowDown } from "react-icons/fa6";
import { MdOutlineLogout } from "react-icons/md";
import LogoutModal from "../../components/modal/LogoutModal";
import axios from "../../api/axios";
import DOMPurify from "dompurify";
import { AuthContext } from "../../AuthContext/AuthContext";

const Chat = () => {
  const { userData } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef(null); // To reference the end of the messages
  const messagesContainerRef = useRef(null); // To reference the messages container
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handlePrompt = async () => {
    if (isLoading || !input.trim()) return;

    setMessages([...messages, { type: "user", text: input }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post("/chatbot/prompt", { prompt: input });

      setMessages([
        ...messages,
        { type: "user", text: input },
        { type: "bot", text: response.data.response }, // Properly formatted HTML response
      ]);
    } catch (error) {
      console.error("Error sending message:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

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
  const formatResponse = (text) => {
    return DOMPurify.sanitize(text); // Sanitize to prevent XSS attacks
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
              {userData?.name && userData.name[0].toUpperCase()}
            </div>
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
        className="flex-grow overflow-y-auto relative mb-24 md:px-20 p-6 space-y-4"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center absolute inset-0">
            <div className="p-8 text-center max-w-lg">
              <h1 className="text-4xl font-extrabold mb-4 text-gray-800 dark:text-gray-100">
                Welcome to <span className="text-blue-500">JCR</span>{" "}
                <span className="text-gray-800 dark:text-gray-200">AI</span>
              </h1>
              <h2 className="text-lg text-gray-600 dark:text-gray-300">
                How can I assist you today?
              </h2>
            </div>
          </div>
        )}

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
              dangerouslySetInnerHTML={{
                __html: formatResponse(message.text),
              }}
            >
              {/* <ReactMarkdown>{message.text}</ReactMarkdown> */}
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

        {/* This div will act as the scroll target */}
        <div ref={messagesEndRef} />
      </div>

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

      <div className="md:px-20 absolute bottom-0 w-full p-4 h-20 bg-white shadow-lg dark:bg-gray-800 flex items-center">
        <div className="relative flex-grow">
          <input
            type="text"
            className="w-full border rounded-full p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePrompt()}
          />
          <button
            onClick={handlePrompt}
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
