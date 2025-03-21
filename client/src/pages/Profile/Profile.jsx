import { FaUserCircle, FaHistory, FaSignOutAlt } from "react-icons/fa";
// import Profile_image from "../../components/profile_image/Profile";
import ManageProfile from "./ManageProfile";
import { AuthContext } from "../../AuthContext/AuthContext";
import { useContext, useState } from "react";
import LogoutModal from "../../components/modal/LogoutModal";
import { Link, useLocation } from "react-router-dom";
import RecentlyDeleted from "./RecentlyDeleted";

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const { userData } = useContext(AuthContext);
  return (
    <div className="w-full min-h-screen mx-auto  p-6 lg:grid  grid-cols-12 gap-6 bg-white shadow-lg rounded-lg dark:bg-gray-900 dark:text-white">
      {/* Sidebar */}
      <div className="col-span-3  bg-blue-50 p-4 rounded-lg dark:bg-gray-800">
        {/* Profile Info */}
        <div className="flex items-center gap-3 mb-6">
          <FaUserCircle className="text-5xl text-blue-500" />
          <div>
            <h2 className="font-bold text-lg">{userData?.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {userData?.email}
            </p>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <ul className="space-y-4 text-gray-700 dark:text-gray-300">
          <li>
            <Link
              to={"/user-profile"}
              className={`${
                location.pathname === "/user-profile"
                  ? "bg-blue-200 dark:bg-gray-700"
                  : ""
              } flex items-center gap-3 p-2.5 rounded-lg cursor-pointer dark:text-white  hover:bg-blue-200 dark:hover:bg-blue-600 text-nowrap`}
            >
              <FaUserCircle className="text-xl text-blue-500" /> My Profile
            </Link>
          </li>

          <li>
            <Link
              to={"/recently-deleted"}
              className={`${
                location.pathname === "/recently-deleted"
                  ? "bg-blue-200 dark:bg-gray-700"
                  : ""
              } flex items-center gap-3 p-2.5 rounded-lg cursor-pointer dark:text-white  hover:bg-blue-200 dark:hover:bg-blue-600 text-nowrap`}
            >
              <FaHistory className="text-xl text-yellow-500" /> Recently Deleted
            </Link>
          </li>
          <li
            onClick={toggleModal}
            className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <FaSignOutAlt className="text-xl text-red-600" /> Logout
          </li>
          <LogoutModal isOpen={isOpen} toggleModal={toggleModal} />
        </ul>
      </div>

      {/* Main Content */}
      <div className="col-span-9 p-6 rounded-lg border dark:border-gray-700">
        {location.pathname === "/user-profile" ? (
          <div>
            <h1 className="text-2xl font-bold mb-4">Manage My Account</h1>
            <ManageProfile />
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-4">
              Recently Deleted History
            </h1>
            <RecentlyDeleted />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
