import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import "./profilePage.scss";
import apiRequest from "../../lib/apiRequest.js"
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";

function ProfilePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const data = useLoaderData();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/")
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <Link to={'/profile/update'}>
              <button>Update Profile</button>
            </Link>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img
                src={currentUser.avatar || "/noAvatar.png"}
                alt=""
              />
            </span>
            <span>
              Username: <b>{currentUser.username || '-'}</b>
            </span>
            <span>
              E-mail: <b>{currentUser.email || '-'}</b>
            </span>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <div className="title">
            <h1>My List</h1>
            <Link to={"/add"}>
              <button>Create New Post</button>
            </Link>
          </div>
          <Suspense fallback={<o>Loading...</o>}>
            <Await
              resolve={data.postResponse}
              errorElement={
                <p>Error loading data</p>
              }
            >
              { (postResponse) =>  <List posts={postResponse.data.posts}/> }
            </Await>
          </Suspense>
          <div className="title">
            <h1>Saved List</h1>
          </div>
          <Suspense fallback={<o>Loading...</o>}>
            <Await
              resolve={data.postResponse}
              errorElement={
                <p>Error loading data</p>
              }
            >
              { (postResponse) =>  <List posts={postResponse.data.mySavedPosts}/> }
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
          <Chat/>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
