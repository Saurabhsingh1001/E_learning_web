// VideoGrid.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import './videogrid1.css';
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import VideoDetails from './Videodetail';

const VideoGrid = () => {
  const navigate = useNavigate()
  const [videos, setVideos] = useState([]);
  const[videoId, setVideoId] = useState("")
  const [videoCount, setVideoCount] = useState(4);
  const [showVideoGrid, setShowVideoGrid] = useState(false);
  const user = JSON.parse(localStorage.getItem('user')); // Assuming you store user details in localStorage
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistStatus, setWishlistStatus] = useState(Array(videos.length).fill(false));
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    
      // fetchVideoDetails();
      checkVideoInWishlist();
    }
  );
  useEffect(() => {
    axios.get('http://localhost:5000/api/getVideos')
      .then(response => {
        setVideos(response.data);
      })
      .catch(error => {
        console.error('Error fetching videos:', error);
      });
  }, []);

  const loadMoreVideos = () => {
    setShowVideoGrid(!showVideoGrid);
    setShowVideoGrid(true);
    setVideoCount(videoCount + 4);
  };


  const handleViewClick = (videoId, url) => {
    localStorage.setItem('videoId',videoId)
    setVideoId(videoId)
    navigate(`/home/video/${encodeURIComponent(url)}`);
  };

  const checkVideoInWishlist = async (videoId) => {
    
    try {
      const userId = localStorage.getItem('userid');
      
      const response = await axios.get(
        'http://localhost:5000/api/checkVideoInWishlist',
        {
          params: {
            videoId: videoId,
            userId: userId,
          },
        }
      );

      if (response.data.inWishlist) {
        setIsInWishlist(true);
      } else {
        setIsInWishlist(false);
      }
    } catch (error) {
      console.error('Error checking video in wishlist:', error);
    }
  };

  const addToWishlist = async (videoId, url, index) => {
    try {
      const userId = localStorage.getItem('userid');
      
      // Check if the video is already in the wishlist
      if (wishlistStatus[index]) {
        alert('Video is already in the wishlist');
        return;
      }
  
      // Add the video to the wishlist
      const response = await axios.post(
        'http://localhost:5000/api/addToWishlist',
        { videoId, userId, url }
      );
  
      if (response.status === 200) {
        alert('Video added to wishlist successfully');
        // Update the wishlist status for the specific video
        setWishlistStatus((prevStatus) => {
          const newStatus = [...prevStatus];
          newStatus[index] = true;
          return newStatus;
        });
        //window.location.reload();
      } else {
        console.error('Unexpected status code:', response.status);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
  
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;
        if (status === 400 && data.data[0].error) {
          alert(data.data[0].error);
        }
      }
    }
  };
  return (
    <>
      <div className="flex-wrap mainwrap">
        {videos.slice(0, videoCount).map((video, index) => (
          <div key={index} className="grid-item">
            {/* {console.log(video.id)} */}
            <div className="video-container">
              <ReactPlayer
                className="video-player"
                url={video.id}
                controls={true}
                width="100%"
                height="100%"
              />
              <div className="buttons-container">
                <button className="button view-button" onClick={() => handleViewClick(video._id,video.id)}>View</button>
                <FaHeart className={`icon ${isInWishlist[index] ? 'in-wishlist' : 'not-in-wishlist'}`} onClick={() => addToWishlist(video._id,video.id, index)} />
              </div>
            </div>
          </div>
        ))}
        <div className="load-more">
          <button className="button" onClick={loadMoreVideos}>
            Load More
          </button>
        </div>
      </div>
    </>
  );
};

export default VideoGrid;
