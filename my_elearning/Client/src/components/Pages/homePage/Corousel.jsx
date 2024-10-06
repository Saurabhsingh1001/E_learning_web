import { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import ReactPlayer from "react-player";
import { FaHeart } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Corousel.css";
import Navbar from "../navbar/Navbar";
import VideoGrid from "./VideoGrid1";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GrLike } from "react-icons/gr";
import { AiFillLike } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
let wishVideo=[]

const Corousel = ({ history }) => {
  const [videos, setVideos] = useState([]);
  const [playingIndex, setPlayingIndex] = useState(null);
  const playerRef = useRef(null);
  const [videoCount, setVideoCount] = useState(4);
  const [videoId, setVideoId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);
  const [searchResult, setSearchResult] = useState([]); // New state for search results
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistStatus, setWishlistStatus] = useState(Array(videos.length).fill(false));
  const [wishlistCheck, setWishlistCheck] = useState(false);

  
  const navigate = useNavigate();

  const userId = localStorage.getItem("userid");

  useEffect(() => {
    
    fetchVideos()
    console.log("hello....111")
    // checkVideoInWishlist();
    // if (videoId) {
    //   //fetchVideoDetails();
    //   checkVideoInWishlist();
    // }
  }, []);

  useEffect(() => {
    console.log("hello....11222222221")
    fetchVideos()
    checkVideoInWishlist();
  }, []);

  // const fetchVideos= () =>{
  // const token = localStorage.getItem("token");
  //   if (!token) {
  //     navigate("/login");
  //   }

    // Fetch video URLs from the backend (replace 'your-api-endpoint' with the actual endpoint)
    
  // }, [history]);

  const fetchVideos = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
    axios
      .get("http://localhost:5000/api/getVideos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Videos:", response.data[0]);
        console.log(response.data)
        wishVideo = response.data
        setVideos(response.data);
      })
      .catch((error) => {
        // if (error.response && error.response.status === 401) {
        //   // Redirect to the login page if the user is not authenticated
        //  navigate("/login");
        // console.log("iiiiiiiiiiiiiiiiiiii")
        if (error.response && error.response.status === 401) {
          // Redirect to the login page if the user is not authenticated
          navigate("/login");
        } else {
          console.error("Error fetching videos:", error);
        }
      });
  }
    

  const checkVideoInWishlist = async () => {
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
      
      // wishlistCheck: response.data.inWishlist.map(video => video.id)
        response.data.video.map((video1)=>{
          console.log(wishVideo)
          videos.map((video2)=>{
            console.log(video1, video2)
            if(video1.id == video2.url){
              console.log(video1, ".............",video1)
            }
          })
        })
      //   setWishlistCheck(true);
      // } else {
      //   setWishlistCheck(false);
      // }
   
  };

  const handleViewClick = (videoId, url) => {
    localStorage.setItem("videoId", videoId);
    setVideoId(videoId);
    navigate(`/home/video/${encodeURIComponent(url)}`);
  };

  const handleSearch = (e) => {
    const searchQuery = e.target.value;
    if (searchQuery) {
      const token = localStorage.getItem("token");

      setSearchQuery(searchQuery);
      axios
        .get(`http://localhost:5000/api/search?q=${searchQuery}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response);
          const searchResults = response.data;
          if (searchResults.length > 0) {
            setSearchResult(searchResults); // Set the search results separately
            setPlayingIndex(null); // Reset playing index
            setNoResults(false);
          } else {
            setSearchResult([]);
            setPlayingIndex(null);
            setNoResults(true);
          }
        })
        .catch((error) => {
          console.log(error);
          console.error("Error searching videos:", error);
        });
    } else {
      setSearchResult("");
    }
  };

  const handleVideoEnd = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(0);
    }
  };

  const handleVideoClick = (index) => {
    setPlayingIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    centerMode: true,
    centerPadding: "0",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 3,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 3,
        },
      },
    ],
    afterChange: (current) => {
      setPlayingIndex(null);
    },
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

  

  
  // const handleLikeToggle = async () => {
  //   try {
  //     const response = await axios.put(`/videos/${videoId}/like`, { userId });

  //     // Update the like count and liked state based on the response
  //     setLikeCount(response.data.likeCount);
  //     setLiked(!liked);
  //   } catch (error) {
  //     console.error("Error toggling like:", error);
  //   }
  // };
  const  handleLikeClick =async(video)=>{
    let like;
    let videoId = video._id
    video.likedUsers.includes(userId) ? (like = false) : (like = true)
    const response = await axios.put(`http://localhost:5000/api/videos/${videoId}/like`, { userId,like,videoId});
    fetchVideos()
    console.log(response.data);

  }


  return (
    <>
      <Navbar />
      <div className="searchslider">
        <div
          id="contsear"
          className="relative flex items-center justify-center h-screen"
        >
          <div className="bg-image">
            <div className="content-container">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search..."
                  className="search-input"
                  onChange={(e) => handleSearch(e)}
                />
                <FaSearch style={{marginLeft:'-5%'}}/>
              </div>
              {searchResult && searchResult.length > 0 &&(
              <div className="flex-wrap mainwrap-search">
                {searchResult &&
                  searchResult.slice(0, videoCount).map((video, index) => (
                    <div key={index} className="grid-item">
                      <div className="video-container">
                        <ReactPlayer
                          className="video-player"
                          url={video.id}
                          controls={true}
                          width="100%"
                          height="100%"
                        />
                        
                        <div className="buttons-container">
                          <button
                            className="button view-button"
                            onClick={() => handleViewClick(video._id, video.id)}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
              </div>
              )}
            </div>
          </div>
        </div>
        <div className="slider-div">
          
          <Slider {...settings}>
            {videos.map((video, index) => (
              <div
                key={index}
                className={`video-slide ${
                  index === playingIndex ? "active" : ""
                }`}
              >
                <ReactPlayer
                  ref={playerRef}
                  url={video.id}
                  width="80%"
                  height="300px"
                  controls
                  playing={index === playingIndex}
                  onEnded={handleVideoEnd}
                  onClick={() => handleVideoClick(index)}
                  
                />
                <div
                  className="icon-container"
                  style={{ display: "flex", gap: "20px" }}
                >
                {video.likedUsers.includes(userId) ? <AiFillLike onClick={() => handleLikeClick(video)} color="blue" style={{ marginTop: "8px" }} fontSize={20}/> :<GrLike onClick={() => handleLikeClick(video)} color="white" style={{ marginTop: "11px" }} />}
                  <p style={{color:"white", marginTop:"5px" ,marginLeft:"-2px"}}>{video.likedUsers.length}</p>
                  
                  {/* {console.log(video)} */}
                  
                  {/* <GrLike color="white" style={{ marginTop: "11px" }} /> */}
                  
                  <FaHeart className={`icon ${(wishlistStatus[index] || wishlistCheck === true) ? 'in-wishlist' : ''}`}
                    style={{ fontSize: '30px' }}
                    onClick={() => addToWishlist(video._id, video.id, index)} />
                  <button className="button view-button" 
                  onClick={() => handleViewClick(video._id, video.id)} style={{}}>
                    View
                  </button>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      <VideoGrid />
    </>
  );
};

export default Corousel;
