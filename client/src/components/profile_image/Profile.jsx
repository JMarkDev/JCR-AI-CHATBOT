import { useEffect, useState } from "react";
import "./ProfileStyle.css";
import { FaCamera } from "react-icons/fa";
import PropTypes from "prop-types";
import axios from "../../api/axios";

const Profile = ({ setData, image, data }) => {
  const [profilePic, setProfilePic] = useState(
    "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
  );

  useEffect(() => {
    if (image) {
      setProfilePic(`${axios.defaults.baseURL}${image}`);
    }
  }, [image, data]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setData({ ...data, image: file });
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePic(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadButtonClick = () => {
    document.getElementById("file-upload").click();
  };

  return (
    <div className="row ">
      <div className="small-12 medium-2 large-2 columns  relative">
        <div className="circle">
          <img
            onClick={handleUploadButtonClick}
            className="profile-pic"
            src={profilePic}
            alt="Profile"
          />
        </div>
        <div className="p-image absolute">
          <FaCamera
            className="fa fa-camera upload-button z-10"
            onClick={handleUploadButtonClick}
          />
          <input
            id="file-upload"
            className="file-upload"
            type="file"
            accept="image/*"
            name="image"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
      </div>
    </div>
  );
};

Profile.propTypes = {
  setData: PropTypes.func,
  image: PropTypes.string,
  data: PropTypes.object,
};

export default Profile;
