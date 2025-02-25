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
import Sidebar from "../../components/Sidebar";
import LoginRegisterModel from "../../components/modal/LoginRegisterModal";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const generateSessionId = () => {
    return `session-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  const [sessionId, setSessionId] = useState(
    localStorage.getItem("sessionId") || generateSessionId()
  );

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(
          `/chatbot/get-by-session?userId=${userData?.id}`
        );

        setChatHistory(response.data.userSessions);
      } catch (error) {
        console.error("Error fetching chat history:", error.message);
      }
    };
    fetchChatHistory();
  }, [messages, sessionId, userData?.id]);

  const handleHistoryClick = async (sessionId) => {
    try {
      const response = await axios.get(
        `/chatbot/history?userId=${userData?.id}&sessionId=${sessionId}`
      );
      setMessages(response.data.chatHistory);
      setSessionId(sessionId);
    } catch (error) {
      console.error("Error fetching chat history:", error.message);
    }
  };

  const handleNewSession = () => {
    const newSession = generateSessionId();
    setMessages([]);
    setSessionId(newSession); // Update session ID
  };

  const handleDelete = async (session) => {
    try {
      await axios.delete(
        `/chatbot/delete-session?userId=${userData?.id}&sessionId=${session}`
      );

      // Remove deleted session from history
      setChatHistory((prevHistory) =>
        prevHistory.filter((chat) => chat.sessionId !== session)
      );

      // If the deleted session is the current one, reset it
      if (session === sessionId) {
        const newSession = generateSessionId();
        setSessionId(newSession);
        setMessages([]); // Clear messages only if it's the current session
        setChatHistory([]);
      } else {
        // Otherwise, update the messages
        const response = await axios.get(
          `/chatbot/history?userId=${userData?.id}&sessionId=${sessionId}`
        );
        setMessages(response.data.chatHistory);
      }
    } catch (error) {
      console.error("Error deleting session:", error.message);
    }
  };

  useEffect(() => {
    localStorage.setItem("sessionId", sessionId);
  }, [sessionId]);

  const handlePrompt = async () => {
    if (isLoading || !input.trim()) return;

    setMessages([...messages, { type: "user", text: input }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post("/chatbot/prompt", {
        prompt: input,
        userId: userData?.id,
        sessionId: sessionId,
      });

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
  const formatResponse = (text) => {
    return DOMPurify.sanitize(text); // Sanitize to prevent XSS attacks
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    checkScroll(); // Recheck scroll visibility after scrolling
  }, [messages]);
  return (
    <div className="flex justify-between h-screen">
      {!userData && <LoginRegisterModel />}

      {userData && (
        <Sidebar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          handleNewSession={handleNewSession}
          chatHistory={chatHistory}
          handleHistoryClick={handleHistoryClick}
          handleDelete={handleDelete}
        />
      )}

      <div
        className={`flex w-full ${
          userData && "md:w-[calc(100%-280px)]"
        } flex-col h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800`}
      >
        <nav className="flex justify-between items-center h-14 py-2 px-8 shadow-lg bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-400 dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-700 dark:to-gray-900">
          <div className="flex gap-5">
            <button
              onClick={toggleSidebar}
              aria-controls="sidebar"
              type="button"
              className="md:hidden block text-white dark:text-gray-100"
              // className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                ></path>
              </svg>
            </button>
            <div className="text-2xl font-extrabold text-white dark:text-gray-100">
              JCR <span className="text-yellow-300">AI</span>
            </div>
          </div>
          {userData && userData?.name ? (
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <label
                  onChange={() => setDarkMode(!darkMode)}
                  className="switch"
                >
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
          ) : (
            <ul className="flex gap-5 items-center">
              <li className="bg-blue-500 p-2 px-6 rounded-full">
                <a href="/login" className="text-white dark:text-gray-100 ">
                  Login
                </a>
              </li>
              <li className="bg-blue-500 p-2 px-6 rounded-full">
                <a href="/register" className="text-white dark:text-gray-100 ">
                  Register
                </a>
              </li>
            </ul>
          )}
        </nav>

        <div
          ref={messagesContainerRef}
          className="flex-grow overflow-y-auto relative mb-24 md:px-20 p-6 space-y-4"
        >
          {messages?.length === 0 && (
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
              ></div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center">
                <Loader />
              </div>
            </div>
          )}

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

        <div className="md:px-20 w-full md:w-[calc(100%-280px)] absolute bottom-0  p-4 h-20 bg-white shadow-lg dark:bg-gray-800 flex items-center">
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
    </div>
  );
};

export default Chat;
