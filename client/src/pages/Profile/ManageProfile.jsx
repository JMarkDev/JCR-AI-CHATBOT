import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../AuthContext/AuthContext";
import Profile from "../../components/profile_image/Profile";
import api from "../../api/axios";
import { toast, ToastContainer } from "react-toastify";
import Loading from "../../components/loader/login_loader/Loader";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FiEyeOff, FiEye } from "react-icons/fi";

const UserProfile = () => {
  const navigate = useNavigate();
  const { userData, fetchUser } = useContext(AuthContext);
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [sendOtp, setSendOtp] = useState(true);
  const [loader, setLoader] = useState(false);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [showPass, setShowPass] = useState(false);
  const [edit, setEdit] = useState(true);

  const [profilePic, setProfilePic] = useState(
    "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
  );
  const [data, setData] = useState({
    image: "",
    name: "",
    birthDate: "",
    contactNumber: "",
  });

  const id = userData?.id;

  useEffect(() => {
    if (userData) {
      setData((prevData) => ({
        ...prevData,
        name: userData.name,
        email: userData.email,
        birthDate: userData.birthDate,
        contactNumber: userData.contactNumber,
        image: userData.image, // ✅ Keep the selected image if it exists
      }));
      if (userData.image) {
        setProfilePic(`${api.defaults.baseURL}${userData.image}`);
      }
    }
  }, [userData]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoader(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("birthDate", data.birthDate);
    formData.append("contactNumber", data.contactNumber);
    // Append the image only if it's a File object
    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    try {
      const response = await api.put(`/users/update/${id}`, formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      if (response.data.status === "success") {
        setLoader(false);
        toast.success(response.data.message);
        setEdit(true);
        fetchUser();
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
      if (error.response.data.errors) {
        error.response.data.errors.forEach((error) => {
          switch (error.path) {
            case "name":
              toast.error(error.msg);
              break;
            case "email":
              toast.error(error.msg);
              break;
            case "birthDate":
              toast.error(error.msg);
              break;
            case "contactNumber":
              toast.error(error.msg);
              break;
            default:
              toast.error(error.message);
          }
        });
      }
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();

    setLoader(true);
    try {
      const response = await api.post(`/users/update-email`, {
        email: newEmail,
      });
      if (response.data.status === "success") {
        toast.success(response.data.message);
        setSendOtp(!sendOtp);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      toast.error(error.response.data.message);
    }
  };

  const handleChangeUsername = async (e) => {
    e.preventDefault();
    const values = {
      email: newEmail,
      otp: otp,
    };

    setLoader(true);

    try {
      const response = await api.put(
        `/users/update-email/verify-otp/${id}`,
        values
      );

      if (response.data.status === "success") {
        toast.success("Email updated successfully. Please login again.");
        Cookies.remove("accessToken");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }

      setLoader(false);
    } catch (error) {
      setLoader(false);
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  const changePassword = async () => {
    setLoader(true);
    const data = {
      password: password,
      new_password: newPassword,
      confirm_password: confirmPassword,
    };

    try {
      const response = await api.put(`/users/update-password/${id}`, data);
      if (response.data.status === "success") {
        toast.success(response.data.message);
        setLoader(false);
        setActiveTab("profile");
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
      toast.error(error.response.data.message);
    }
  };

  const showPassword = () => {
    setShowPass(!showPass);
  };

  return (
    <>
      <ToastContainer />
      <div className="flex text-sm flex-col lg:flex-row w-full gap-5">
        <div className="flex flex-col gap-3 justify-center items-center p-4 bg-white border border-gray-300 shadow-lg min-w-[250px] h-fit rounded-lg">
          {loader && <Loading />}
          {edit ? (
            <img className="w-32 h-32 rounded-full" src={profilePic} alt="" />
          ) : (
            <Profile image={userData?.image} setData={setData} data={data} />
          )}

          <h1 className="font-bold text-lg text-gray-800 text-center">
            {data.name}
          </h1>
          <span className="text-gray-700 md:text-md text-sm ">
            {data?.email}
          </span>
        </div>
        <div className="flex  flex-col flex-grow sm:border md:border-gray-300 md:shadow-lg rounded-lg">
          <ul className="flex gap-2 md:border md:border-gray-300 w-full h-12 items-center md:p-4 ">
            <li
              className={`cursor-pointer  text-sm text-nowrap px-2 py-1 rounded-md ${
                activeTab === "profile"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-600 hover:text-white"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              Profile info
            </li>
            <li
              className={`cursor-pointer text-sm text-nowrap px-2 py-1 rounded-md ${
                activeTab === "update"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-600 hover:text-white"
              }`}
              onClick={() => setActiveTab("update")}
            >
              Change email
            </li>
            <li
              className={`cursor-pointer  text-sm text-nowrap px-2 py-1 rounded-md  ${
                activeTab === "password"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-600 hover:text-white"
              }`}
              onClick={() => setActiveTab("password")}
            >
              Change password
            </li>
          </ul>
          <div className="py-6  md:px-4 text-gray-600">
            {activeTab === "profile" && (
              <div className="flex flex-col gap-3">
                {edit ? (
                  <div className="flex items-center gap-5">
                    <label
                      htmlFor=""
                      className="text-md font-semibold text-gray-700 dark:text-white w-1/4"
                    >
                      Full name
                    </label>
                    <input
                      onChange={(e) =>
                        setData({
                          ...data,
                          name: e.target.value,
                        })
                      }
                      className="rounded-lg border-2 bg-gray-200 border-gray-200 flex-grow p-2 text-sm"
                      type="text"
                      disabled={true}
                      value={data.name || ""}
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-5">
                      <label
                        htmlFor=""
                        className="text-md  font-semibold text-gray-700 dark:text-white w-1/4"
                      >
                        Full Name
                      </label>
                      <input
                        onChange={(e) =>
                          setData({
                            ...data,
                            name: e.target.value,
                          })
                        }
                        className="rounded-lg border bg-gray-200 border-gray-200 flex-grow p-2 text-sm border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        type="text"
                        defaultValue={data.name || ""}
                      />
                    </div>
                  </>
                )}
                {edit && (
                  <div className="flex items-center gap-5">
                    <label
                      htmlFor=""
                      className="text-md font-semibold text-gray-700 dark:text-white w-1/4"
                    >
                      Email
                    </label>
                    <input
                      className="rounded-lg border-2 bg-gray-200 border-gray-200 flex-grow p-2 text-sm"
                      type="text"
                      disabled={true}
                      value={data?.email || ""}
                    />
                  </div>
                )}

                <div className="flex items-center gap-5">
                  <label
                    htmlFor=""
                    className="text-md font-semibold text-gray-700 dark:text-white w-1/4"
                  >
                    Date of birth
                  </label>
                  <input
                    onChange={(e) =>
                      setData({ ...data, birthDate: e.target.value })
                    }
                    className="rounded-lg border bg-gray-200 border-gray-200  flex-grow p-2 text-sm border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    type="date"
                    disabled={edit ? true : false}
                    value={data.birthDate || ""}
                  />
                </div>
                <div className="flex items-center gap-5">
                  <label
                    htmlFor=""
                    className="text-md font-semibold text-gray-700 dark:text-white w-1/4"
                  >
                    Contact number
                  </label>
                  <input
                    onChange={(e) =>
                      setData({
                        ...data,
                        contactNumber: e.target.value,
                      })
                    }
                    defaultValue={data.contactNumber || ""}
                    className="rounded-lg border  bg-gray-200 border-gray-200 flex-grow p-2 text-sm border-1 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    type="number"
                    placeholder="Update contant number"
                    disabled={edit ? true : false}
                  />
                </div>

                <div className="flex  justify-end">
                  {edit ? (
                    <button
                      onClick={() => setEdit(!edit)}
                      type="button"
                      className="w-fit mt-4 text-center bg-blue-500 hover:bg-blue-700 text-white text-nowrap px-4 rounded-lg p-2"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <button
                      onClick={handleUpdate}
                      type="button"
                      className="w-fit mt-4 text-center bg-blue-500 hover:bg-blue-700 text-white text-nowrap px-4 rounded-lg p-2"
                    >
                      Save Profile
                    </button>
                  )}
                </div>
              </div>
            )}
            {activeTab === "update" && (
              <div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-5">
                    <label
                      htmlFor=""
                      className="text-md font-semibold text-gray-700 dark:text-white w-1/4" // Adjust this width as needed
                    >
                      New email
                    </label>
                    <input
                      onChange={(e) => setNewEmail(e.target.value)}
                      className={`rounded-lg focus:ring-blue-500 focus:border-blue-100 border-2 bg-gray-200 border-gray-200 flex-grow p-2 text-sm`}
                      type="text"
                      placeholder="Enter new email"
                    />
                  </div>

                  <div className="flex items-center relative gap-5">
                    <label
                      htmlFor=""
                      className="text-md font-semibold text-gray-700 dark:text-white w-1/4" // Adjust this width as needed
                    >
                      OTP
                    </label>
                    <input
                      onChange={(e) => setOTP(e.target.value)}
                      className="rounded-lg focus:ring-blue-500 focus:border-blue-100 border-2 bg-gray-200 border-gray-200 flex-grow p-2 text-sm"
                      type="text"
                      placeholder="Enter 4 digits OTP"
                    />
                  </div>

                  <div className="flex justify-end">
                    {/* <button
                      onClick={handleSendOTP}
                      type="button"
                      className="text-[#1A9CE7] text-sm absolute right-5"
                    >
                      SEND
                    </button> */}
                    {sendOtp ? (
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        className="w-fit mt-4 bg-blue-500 hover:bg-blue-700 text-white text-nowrap px-4 rounded-lg p-2 cursor-pointer"
                      >
                        Send code
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleChangeUsername}
                        className=" w-fit mt-4 bg-blue-500 hover:bg-blue-700 text-white text-nowrap px-4 rounded-lg p-2"
                      >
                        Verify code
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
            {activeTab === "password" && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-5 justify-between">
                  <label
                    htmlFor=""
                    className="text-md w-1/4 font-semibold text-gray-700 dark:text-white"
                  >
                    Old password
                  </label>
                  <div className="flex-grow flex relative">
                    <input
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-lg focus:ring-blue-500 focus:border-blue-100 border-2 flex-grow bg-gray-200 border-gray-200  p-2 text-sm"
                      type={`${showPass ? "text" : "password"}`}
                      placeholder="Enter old password"
                    />
                    <span
                      onClick={showPassword}
                      className="absolute right-2 top-1/3 cursor-pointer"
                    >
                      {showPass ? <FiEye /> : <FiEyeOff />}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-5 justify-between">
                  <label
                    htmlFor=""
                    className="text-md w-1/4 font-semibold text-gray-700 dark:text-white"
                  >
                    New password
                  </label>
                  <div className="flex-grow flex relative">
                    <input
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="rounded-lg focus:ring-blue-500 focus:border-blue-100 border-2 flex-grow bg-gray-200 border-gray-200  p-2 text-sm"
                      type={`${showPass ? "text" : "password"}`}
                      placeholder="Enter new password"
                    />
                    <span
                      onClick={showPassword}
                      className="absolute right-2 top-1/3 cursor-pointer"
                    >
                      {showPass ? <FiEye /> : <FiEyeOff />}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-5 justify-between">
                  <label
                    htmlFor=""
                    className="text-md w-1/4  font-semibold text-gray-700 dark:text-white"
                  >
                    Confirm password
                  </label>

                  <div className="flex-grow flex relative">
                    <input
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="rounded-lg focus:ring-blue-500 focus:border-blue-100 border-2 flex-grow bg-gray-200 border-gray-200  p-2 text-sm"
                      type={`${showPass ? "text" : "password"}`}
                      placeholder="Enter new password"
                    />
                    <span
                      onClick={showPassword}
                      className="absolute right-2 top-1/3 cursor-pointer"
                    >
                      {showPass ? <FiEye /> : <FiEyeOff />}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => changePassword()}
                    className="w-fit mt-4 bg-blue-500 hover:bg-blue-700 text-white rounded-lg p-2"
                  >
                    Change password
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
