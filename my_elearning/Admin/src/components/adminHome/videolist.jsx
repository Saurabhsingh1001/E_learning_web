// VideoGrid.js
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { useNavigate } from 'react-router-dom';
import './videolist.css';
import DashSidebar from './DashSidebar';
import AddVideoForm from './addVideoform';
import { MdDelete } from "react-icons/md";
import { MdEditSquare } from "react-icons/md";
import { MdKeyboardDoubleArrowDown } from "react-icons/md"
//import { useAuth } from '../../../AuthContext';
import ReactPaginate from 'react-paginate';

// ... (imports)

const VideoList = () => {
    const [videos, setVideos] = useState([]);
    const [showVideoGrid, setShowVideoGrid] = useState(false);
    const [videoCount , setVideoCount] = useState(4);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [startIndex, setStartIndex] = useState(0);
    const navigate = useNavigate();
    const [limit, setLimit] =useState(4);
    const [pageCount, setPageCount] = useState();
    const currentPage = useRef();
  
    useEffect(() => {
      // Fetch video URLs from the backend (replace 'your-api-endpoint' with the actual endpoint)
      //fetchVideos()
      currentPage.current = 1
      getPaginatedVideos();
    }, []);

    const handleUpdateClick = (video) => {
      setSelectedVideo(video);
      setShowAddForm(true);
    };
    const handleAddVideoClick = () =>{
        setSelectedVideo(null);
        setShowAddForm(true);
    }
  
    const handlePageClick = async (e)=>{
      console.log(e);
      currentPage.current = e.selected + 1;
      getPaginatedVideos();
      
    }

    const fetchVideos = () =>{
        axios.get('http://localhost:8000/api/getVideos')
        .then(response => {
          setVideos(response.data);
        })
        .catch(error => {
          console.error('Error fetching videos:', error);
        });
    }
  
    const deleteVideo = async (videoId) => {
      const shouldDelete = window.confirm('Are you sure you want to delete this user?');
      if(shouldDelete){
      try {
        // Send a DELETE request to your backend endpoint to delete the video
        await axios.delete(`http://localhost:8000/api/deleteVideo/${encodeURIComponent(videoId)}`);
        fetchVideos();
        // After successfully deleting the video, reload the page
        window.location.reload();
      } catch (error) {
        console.error('Error deleting video:', error);
      }
    }
    };
  
    // const loadMoreVideos = () => {
    //   // Toggle the visibility of the video grid
    //   setShowVideoGrid(true);
    //   setVideoCount(videoCount+4)
    //   //setShowVideoGrid(true);

    // };
  
    // const addvideo = () => {
    //   // Toggle the visibility of the video grid
    //   navigate('./addvideo');
    // };
    
    

    function getPaginatedVideos(){
      fetch(`http://localhost:8000/paginatedVideos?page=${currentPage.current}&limit=${limit}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data, "VideoData");
          setPageCount(data.pageCount);
          setVideos(data.result)
          
         
        });
  
    }
  
    return (
      <div className="main-video-manage-div" style={{width:'auto',height:'100vh',marginTop:'-10rem',padding:'0'}}>
        <DashSidebar />
        <div className="flex-wrap bg-slate-200 mainwrap">
          {/* Add Video Button */}
          <div className="addbtn">
            <button
              className="button1"
              onClick={handleAddVideoClick}
            >
              <h3 id="addbtntext">Add Video</h3>
            </button>
          </div>
    
          {/* Video Grid */}
          <div className="flex-wrap bg-slate-200 justify-content-center align-items-center "style={{marginTop:'-40rem'}}>
            {/* Initial 4 grids */}
            {videos.map((video, index) => (
              <div key={index} className="flex-wrap grid-item" >
                <div className="video-container">
                  <ReactPlayer
                    className="video-player"
                    url={video.id}
                    controls={true}
                    width="100%"
                    height="100%"
                  />
    
                  <div className="buttons-container">
                    <MdEditSquare id="icon-size" onClick={() => handleUpdateClick(video)} />
                    <MdDelete id="icon-size" onClick={() => deleteVideo(video._id)} />
                  </div>
                </div>
              </div>
              
            ))}

             
    
            {/* Load More Button */}
            <div className="load-more">
            <ReactPaginate 
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={4}
          pageCount={pageCount}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          marginPagesDisplayed={2}
          containerClassName="pagination justify-content-center"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          activeClassName="active"
          forcePage={currentPage.current-1}
        />
            </div>

          </div>
            
          {/* Render the AddVideoForm component based on showAddForm */}
          {showAddForm && (
            <AddVideoForm
              selectedVideo={selectedVideo}
              setShowAddForm={setShowAddForm}
              handleCancel={() => setShowAddForm(false)}
            />
          )}
        </div>
        
      </div>
    );
    
  };
  
  export default VideoList;
  