import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useLoaderData, useNavigate } from "react-router-dom";
import DOMPurify from 'dompurify'
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";

function SinglePage() {
  const postData = useLoaderData();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext)
  const [isSavedPost, setIsSavedPost] = useState(postData.isSaved || false);

  const handleSavePost = async () => {
    try {
      if (currentUser) {
        setIsSavedPost(prev=>!prev);
        console.log(isSavedPost);
        await apiRequest.post("/users/save", {
          postId: postData?.id
        })
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      setIsSavedPost(prev=>!prev);
      console.log(isSavedPost);
    }
  }
  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={postData.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{postData.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{postData.address}</span>
                </div>
                <div className="price">$ {postData.price}</div>
              </div>
              <div className="user">
                <img src={postData.user.avatar} alt="" />
                <span>{postData.user.username}</span>
              </div>
            </div>
            <div className="bottom" dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(postData.postDetail.desc)
            }}/>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Utilities</span>
                <p>{postData.postDetail.utilities === 'owner' ? 'Owner is responsible' : 'tenant is resposible'}</p>
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Pet Policy</span>
                <p>{postData.postDetail.pet === 'allowed' ? 'Pets is allowed' : 'Pets is not allowed'}</p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Income Policy</span>
                <p>{postData.postDetail.income}</p>
              </div>
            </div>
          </div>
          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{`${postData.postDetail.size} sqft`}</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{`${postData.bedroom} beds`}</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{`${postData.bathroom} bathroom`}</span>
            </div>
          </div>
          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>School</span>
                <p>{postData.postDetail.school > 999 ? `${postData.postDetail.school/1000}km Away` : `${postData.postDetail.school}m Away`}</p>
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Bus Stop</span>
                <p>{`${postData.postDetail.bus}m Away`}</p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>{`${postData.postDetail.restaurant}m Away`}</p>
              </div>
            </div>
          </div>
          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[postData]} />
          </div>
          <div className="buttons">
            <button>
              <img src="/chat.png" alt="" />
              Send a Message
            </button>
            <button onClick={handleSavePost} style={{ backgroundColor: isSavedPost ? '#fece51' : 'white'}}>
              <img src="/save.png" alt="" />
              {isSavedPost ? "Place is save" : "Save the Place"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
