import { useState, useEffect } from 'react';
import './mylearning.css';
import { useNavigate } from 'react-router-dom'
import Navbar from '../navbar/Navbar';
import ReactPlayer from 'react-player';
import axios from 'axios'
 
const VideoComponent = () => {
 
  const navigate = useNavigate();
  const [inProgressVideos, setInProgressVideos] = useState([]);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [wishlistVideos, setWishlistVideos] = useState([]);
  const[videoId, setVideoId] = useState("")
  const [videos, setVideos] = useState([]);
  const [videoCount, setVideoCount] = useState(3);
  const [videoCountwis, setVideoCountwis] = useState(3);
  const [videoCountcomp, setVideoCountcomp] = useState(3);
  //const [completedVideos, setCompletedVideos] = useState([]);
 
  useEffect(() => {
    const userId = localStorage.getItem('userid');
    fetch('http://localhost:5000/api/getwishlist', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'UserId': userId,
      },
    })
      .then((response) => response.json())
      .then((data) => setWishlistVideos(data.wishlistUrls))
      .catch((error) => console.error('Error fetching wishlist videos:', error));
  }, []);
 
  useEffect(() => {
    axios.get('http://localhost:5000/api/getVideos')
      .then(response => {
        setVideos(response.data);
        console.log(response.data[0]._id)
        localStorage.setItem(response.data);
       
      })
      .catch(error => {
        console.error('Error fetching videos:', error);
      });
  }, [videoId]);
 
  useEffect(() => {
    const userId = localStorage.getItem('userid');
   
    // Fetch progress videos
    axios.get('http://localhost:5000/api/ProgressVideos', {
      headers: {
        'UserId': userId,
      },
    })
      .then(response => {
        // Assuming the API response is an array of progress videos
        setInProgressVideos(response.data);
        console.log("this is response :",response.data)
      })
      .catch(error => {
        console.error('Error fetching progress videos:', error);
      });
  }, []);
 
  useEffect(() => {
    const userId = localStorage.getItem('userid');
 
    // Fetch completed videos
    fetch('http://localhost:5000/api/completedVideos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'UserId': userId,
      },
    })
      .then((response) => response.json())
      .then((data) => setCompletedVideos(data.completedVideosWithUrl))
      .catch((error) => console.error('Error fetching wishlist videos:', error));
  }, []);
 
  const loadMoreVideos = () => {
    setVideoCount(videoCount + 3);
  };
 
  const loadMoreVideoscomp = () => {
    setVideoCountcomp(videoCountcomp + 3);
  };
 
  const loadMoreVideoswis = () => {
    setVideoCountwis(videoCountwis + 3);
  };
 
  const handleViewClick = (videoId, video) => {
 
    localStorage.setItem('videoId',videoId);
    console.log(videoId)
    setVideoId(videoId)
    navigate(`/home/video/${encodeURIComponent(video.id)}`);
  };
 
  const handleViewClickwis = (videourlid, video) => {
 
    localStorage.setItem('videoId',video.videourlid);
    console.log("this is hell: ",videourlid)
    setVideoId(videourlid)
    navigate(`/home/video/${encodeURIComponent(video.url)}`);
  };
 
 
 
  const renderVideos = (videos) => {
    return (
      <div className="flex-wrap mainwrap-mylearning">
        {videos.slice(0, videoCount).map((video, index) => (
          <div key={index} className="grid-item-mylearning">
            <div className="my-learning-video-container">
              <ReactPlayer
                className="video-player-mylearning"
                url={video.id}
                controls={true}
                width="100%"
                height="100%"
              />
            </div>
            <button className="button view-button" style={{marginTop:'2%',marginLeft:'47%'}} onClick={() => handleViewClick(video._id,video)}>View</button>
          </div>
        ))}
        <div className="load-more">
          <button className="button" style={{marginTop:'7%',marginRight:'10%'}}onClick={loadMoreVideos}>
            Load More...
          </button>
        </div>
      </div>
    );
  };
 
  const renderCompletedVideos = (videos) => {
    return (
      <div className="flex-wrap mainwrap-mylearning">
        {videos.slice(0, videoCountcomp).map((video, index) => (
          <div key={index} className="grid-item-mylearning">
            <div className="my-learning-video-container">
              <ReactPlayer
                className="video-player-mylearning"
                url={video.url}
                controls={true}
                width="100%"
                height="100%"
              />
            </div>
            <button className="button view-button" style={{marginTop:'2%',marginLeft:'47%'}} onClick={() => handleViewClick(video._id,video)}>View</button>
          </div>
        ))}
        <div className="load-more">
          <button className="button" style={{marginTop:'7%',marginRight:'10%'}}onClick={loadMoreVideoscomp}>
            Load More...
          </button>
        </div>
      </div>
    );
  };
 
  const renderVideoswishlist = (videos) => {
    return (
      <div className="flex-wrap mainwrap-mylearning">
        {videos.slice(0, videoCountwis).map((video, index) => (
          <div key={index} className="grid-item-mylearning">
            <div className="my-learning-video-container">
              <ReactPlayer
                className="video-player-mylearning"
                url={video.url}
                controls={true}
                width="100%"
                height="100%"
              />
            </div>
            <button className="button view-button" style={{marginTop:'2%',marginLeft:'47%'}} onClick={() => handleViewClickwis(video._id,video)}>View</button>
          </div>
        ))}
        <div className="load-more">
          <button className="button" style={{marginTop:'7%',marginRight:'10%'}}onClick={loadMoreVideoswis}>
            Load More...
          </button>
        </div>
      </div>
    );
  };
 
  return (
    <>
      <Navbar />
      <div className="video-component">
        {inProgressVideos.length > 0 && (
          <div className="section">
            <h2 style={{fontSize:'20px',fontWeight:'700'}}>In Progress</h2>
            <div className="video-list">{renderVideos(inProgressVideos)}</div>
          </div>
        )}
 
        {completedVideos.length > 0 && (
          <div className="section">
            <h2 style={{fontSize:'20px',fontWeight:'700'}}>Completed</h2>
            <div className="video-list">{renderCompletedVideos(completedVideos)}</div>
          </div>
        )}
 
        {wishlistVideos.length > 0 && (
          <div className="section">
            <h2 style={{fontSize:'20px',fontWeight:'700'}}>Wishlist</h2>
            <div className="video-list">{renderVideoswishlist(wishlistVideos)}</div>
          </div>
        )}
      </div>
    </>
  );
};
 
export default VideoComponent;
 