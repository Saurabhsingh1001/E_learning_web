import { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { useParams } from 'react-router-dom';
import './VideoDetails.css';
import Navbar from '../navbar/Navbar';
import VideoComments from './VideoComments';
import axios from 'axios';
import { FaHeart } from "react-icons/fa";
import { BiLike } from "react-icons/bi";

const VideoDetails = () => {
  const location = window.location.href;
  const url = new URL(location);
  const videoUrls = decodeURIComponent(url.pathname.split('video/')[1]);
  const [videoUrl, setVideoUrl] = useState('');
  const { videoId } = useParams();
  const [videoprogress, setVideoprogress] = useState('');
  const [initialPlaying, setInitialPlaying] = useState(true);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const playerRef = useRef(null);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const videoId = localStorage.getItem('videoId')
    if (videoId) {
      fetchVideoDetails();
      checkVideoInWishlist();
    }
  }, [videoId, videoUrls]);

  useEffect(() => {
    // Load video progress when the component mounts
    loadVideoProgress();
  }, [videoUrl]);

  const fetchVideoDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/getVideosplay/${videoUrls}`);
      if (response.data && response.data.videoUrl) {
        setVideoUrl(response.data.videoUrl);
      } else {
        console.error('Video URL not found');
      }
    } catch (error) {
      console.error('Error fetching video details:', error);
    }
  };

  const loadVideoProgress = async () => {
    try {
      const videoObjectId = localStorage.getItem('videoId');
      const userObjectId = localStorage.getItem('userid');

      if (videoObjectId && userObjectId) {
        const response = await axios.get(`http://localhost:5000/api/getVideoProgress`, {
          params: {
            videoId: videoObjectId,
            userId: userObjectId,
          },
        });

        if (response.data && response.data.progress) {
          setVideoprogress(response.data.progress);
          setSeekTo(response.data.progress);
        }
      } else {
        console.error('Video or user object ID not found in local storage');
      }
    } catch (error) {
      console.error('Error loading video progress:', error);
    }
  };

  const updateVideoProgress = async (progress) => {
    try {
      const videoObjectId = localStorage.getItem('videoId');
      const userObjectId = localStorage.getItem('userid');

      if (!videoObjectId || !userObjectId) {
        console.error('Video or user object ID not found in local storage');
        return;
      }

      await axios.post(`http://localhost:5000/api/updateVideoProgress`, {
        videoId: videoObjectId,
        userId: userObjectId,
        progress: progress,
      });
    } catch (error) {
      console.error('Error updating video progress:', error);
    }
  };

  const setSeekTo = (progress) => {
    if (playerRef.current) {
      playerRef.current.seekTo(progress);
    }
  };

  const handlePlay = () => {
    setInitialPlaying(true);
  };

  const handleProgress = (state) => {
    const { playedSeconds, playing } = state;
    if (!playing && !isVideoPaused) {
      updateVideoProgress(playedSeconds);
      setIsVideoPaused(false);
    } else if (playing && isVideoPaused) {
      setIsVideoPaused(false);
    }
  };

  const checkVideoInWishlist = async () => {
    console.log("hello")
    try {
      const userId = localStorage.getItem('userid');
      const videoId = localStorage.getItem('videoId');
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

  const addToWishlist = async (url) => {
    try {
      const userId = localStorage.getItem('userid');
      const videoId = localStorage.getItem('videoId');

      if (userId) {
        const response = await axios.post(
          'http://localhost:5000/api/addToWishlist',
          { videoId, userId, url }
        );

        if (response.status === 400) {
          alert(response.data.data[0].error);
        } else if (response.status === 200) {
          alert('Video added to wishlist successfully');
          window.location.reload()
        } else {
          console.error('Unexpected status code:', response.status);
        }
      } else {
        console.error('User details not found in localStorage');
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
      <Navbar />
      <div>
        <div className="video-container" style={{ width: "80%", height: "400px", marginLeft: "10%", marginTop: "3%" }}>
          {videoUrls && (
            <ReactPlayer
              ref={playerRef}
              className="video-player"
              url={videoUrls}
              controls={true}
              width="100%"
              height="100%"
              onPlay={handlePlay}
              onProgress={handleProgress}
              playing={!initialPlaying}
              progressInterval={1000}
              onReady={() => playerRef.current.seekTo(Math.round(videoprogress))}
            />
          )}
          <div className='icons' style={{ display: 'flex', gap: '10px' }}>
            <BiLike className="icon" style={{ fontSize: '30px' }} />
            <FaHeart
              className={`icon ${isInWishlist ? 'in-wishlist' : ''}`}
              style={{ fontSize: '30px' }}
              onClick={() => addToWishlist(videoUrls)}
            />
          </div>
        </div>
        <VideoComments />
      </div>
    </>
  );
};

export default VideoDetails;
