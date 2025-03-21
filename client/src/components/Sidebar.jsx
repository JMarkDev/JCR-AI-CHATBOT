import { useState } from "react";
import { IoAdd } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import PropTypes from "prop-types";
import { MdDeleteOutline } from "react-icons/md";

const Sidebar = ({
  sidebarOpen,
  toggleSidebar,
  handleNewSession,
  chatHistory,
  handleHistoryClick,
  handleDelete,
}) => {
  const [hoverChat, setHoverChat] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  return (
    <div>
      {/* Overlay when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity"
          onClick={toggleSidebar} // Click to close sidebar
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-[280px] h-screen dark:bg-gray-900 bg-blue-500 text-white shadow-xl transform transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 overflow-y-auto`}
      >
        <div className="h-full px-4 py-4 flex flex-col">
          {/* New Chat Button */}
          <button
            onClick={handleNewSession}
            className="flex items-center justify-center w-full p-2 bg-blue-400 dark:bg-blue-900 hover:bg-blue-700 rounded-md font-semibold text-lg transition"
          >
            <IoAdd className="text-2xl mr-2" /> New Chat
          </button>

          {/* Chat History */}
          <div className="mt-6">
            <h2 className="text-lg font-bold dark:text-gray-300 mb-3">
              Chat History
            </h2>
            <ul>
              {chatHistory?.map((chat) => (
                <li
                  onClick={() => handleHistoryClick(chat.sessionId)}
                  key={chat.sessionId}
                  onMouseEnter={() => setHoverChat(chat.sessionId)}
                  onMouseLeave={() => {
                    setHoverChat(null);
                    setShowDelete(false);
                  }}
                >
                  <button className="flex relative rounded-md w-full p-3 hover:bg-blue-400 dark:hover:bg-gray-700 transition">
                    <div className="flex items-center justify-between w-full">
                      <p className="text-sm  text-left truncate">
                        {chat.title}
                      </p>
                      {hoverChat === chat.sessionId && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDelete(chat.sessionId);
                          }}
                          className="flex items-center"
                        >
                          <BsThreeDots className="text-xl dark:text-white text-white" />
                        </div>
                      )}

                      {/* <BsThreeDots className="text-xl" /> */}
                    </div>
                  </button>
                  {showDelete === chat.sessionId && (
                    <div className="absolute z-10 right-4 botton-0 bg-white p-2 h-fit w-fit rounded-md shadow-md">
                      <button
                        type="button"
                        onClick={() => {
                          handleDelete(chat.sessionId);
                        }}
                        className="text-red-500 text-sm flex gap-2 items-center hover:text-red-700"
                      >
                        <MdDeleteOutline />
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
};

Sidebar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  handleNewSession: PropTypes.func,
  chatHistory: PropTypes.array,
  handleHistoryClick: PropTypes.func,
  handleDelete: PropTypes.func,
};

export default Sidebar;
