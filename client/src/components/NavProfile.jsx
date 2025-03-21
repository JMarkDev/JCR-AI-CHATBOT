import { CiLogout } from "react-icons/ci";
import { Link } from "react-router-dom";
import { FaUserCircle, FaTrashAlt } from "react-icons/fa";
import PropTypes from "prop-types";
const NavProfile = ({ toggleModal }) => {
  return (
    <div className=" w-fit h-full rounded-lg py-4 relative bg-white shadow-lg text-gray-700 z-50">
      <ul>
        <li
          // onClick={handleProfile}
          className="flex w-full items-center gap-2 px-4 py-2  hover:bg-gray-200 cursor-pointer"
        >
          <Link to={"/user-profile"} className="flex gap-2 text-nowrap">
            <span className="text-blue-600 text-lg">
              <FaUserCircle />
            </span>
            Manage Account
          </Link>
        </li>
        <li
          // onClick={handleProfile}
          className="flex w-full items-center gap-2 px-4 py-2  hover:bg-gray-200 cursor-pointer"
        >
          <Link to={"/recently-deleted"} className="flex gap-2 text-nowrap">
            <span className="text-red-500 text-lg">
              <FaTrashAlt />
            </span>
            Recently deleted
          </Link>
        </li>
        <li
          onClick={toggleModal}
          className="flex items-center gap-2 px-4 py-2  hover:bg-gray-200 cursor-pointer"
        >
          <span className="text-red-600 text-lg">
            <CiLogout />
          </span>
          Logout
        </li>
      </ul>
    </div>
  );
};

NavProfile.propTypes = {
  toggleModal: PropTypes.func,
};

export default NavProfile;
