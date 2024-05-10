import { useContext, useState } from "react";
import "./profileUpdatePage.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequst from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import UploadWidget from "../../components/uploadWidget/UploadWidget";

function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const  [error, setError] = useState();
  const [avatar, setAvatar] = useState([]);
  const navigate = useNavigate();

  const onUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { password, username, email } = Object.fromEntries(formData);

    try {
      const response = await apiRequst.put(`/users/${currentUser.id}`, { password, username, email, avatar: avatar[0] });
      console.log(response.data);
      updateUser(response.data);
      navigate("/profile");
    } catch (error) {
      console.log(error)
      setError(error.response.data.message);
    }
  }
  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={onUpdateProfile}>
          <h1>Update Profile</h1>
          <div className="item">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={currentUser.username}
            />
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser.email}
            />
          </div>
          <div className="item">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" />
          </div>
          <button>Update</button>
          {error && <span>{error}</span>}
        </form>
      </div>
      <div className="sideContainer">
        <img src={avatar[0] || currentUser.avatar || '/noAvatar.png'} alt="" className="avatar" />
        <UploadWidget uwConfig={{
            cloudName: "abimanyub",
            uploadPreset: "estate",
            multiple: false,
            maxImageFileSize: 2000000,
            folder: "avatars"
          }}
          setState={setAvatar}
        />
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
