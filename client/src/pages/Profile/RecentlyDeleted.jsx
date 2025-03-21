import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../AuthContext/AuthContext";
import axios from "../../api/axios";
import { toast, ToastContainer } from "react-toastify";
// import { format } from 'date-fns'; // For date formatting

const RecentlyDeleted = () => {
  const { userData } = useContext(AuthContext);
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      let status = "archived";
      try {
        const response = await axios.get(
          `/chatbot/get-by-session?userId=${userData?.id}&status=${status}`
        );
        setChatHistory(response.data.userSessions);
      } catch (error) {
        console.error("Error fetching chat history:", error.message);
      }
    };
    fetchChatHistory();
  }, [userData?.id]);

  const handleRestore = async (sessionId) => {
    try {
      let status = "active";
      const response = await axios.put(
        `/chatbot/archive-session?userId=${userData?.id}&sessionId=${sessionId}&status=${status}`
      );
      setChatHistory((prev) =>
        prev.filter((chat) => chat.sessionId !== sessionId)
      );
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error restoring session:", error.message);
    }
  };

  const handleDelete = async (sessionId) => {
    try {
      const response = await axios.delete(
        `/chatbot/delete-session?userId=${userData?.id}&sessionId=${sessionId}`
      );

      toast.success(response.data.message);
      setChatHistory((prev) =>
        prev.filter((chat) => chat.sessionId !== sessionId)
      );
    } catch (error) {
      console.error("Error deleting session:", error.message);
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="bg-gray-50 dark:bg-gray-700 min-h-screen">
        {chatHistory.length === 0 ? (
          <p className="text-gray-500 text-center">
            No deleted sessions found.
          </p>
        ) : (
          <div className="space-y-4">
            {chatHistory.map((session) => (
              <div
                key={session.sessionId}
                className="p-2 bg-white dark:bg-gray-700 shadow-md rounded-xl flex justify-between items-center border border-gray-300 dark:border-gray-500"
              >
                <div>
                  <h2 className="">{session.title}</h2>
                  {/* <p className="text-sm text-gray-500">Deleted on: {format(new Date(session.createdAt), 'PPpp')}</p> */}
                </div>
                <div className="flex space-x-2">
                  <button
                    className="px-4 py-2 bg-green-500 text-white text-nowrap rounded-lg hover:bg-green-600"
                    onClick={() => handleRestore(session.sessionId)}
                  >
                    🔄 Restore
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white text-nowrap rounded-lg hover:bg-red-600"
                    onClick={() => handleDelete(session.sessionId)}
                  >
                    ❌ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default RecentlyDeleted;
