import { useState } from 'react';
import axios from 'axios';
import './addVideoform.css'
import { useNavigate } from 'react-router-dom'
const AddVideoForm = ({ selectedVideo, setShowAddForm, handleCancel}) => {
  const [url, setUrl] = useState(selectedVideo ? selectedVideo.id: '');
  const [title, setTitle] = useState(selectedVideo ? selectedVideo.title: '');
  const navigate = useNavigate()
  const handleAddOrUpdateVideo = async () => {
    try {
      if (url && title) {
        // Use the YouTube Data API v3 to get video details
        const apiKey = 'AIzaSyD_igiM8komPYHN24yxb7N9XD8GQJVtN-g'; // Replace with your actual API key
        const videoId = extractVideoIdFromUrl(url);
  
        if (!videoId) {
          alert('Invalid YouTube URL');
          return;
        }
  
        const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${apiKey}`;
        const response = await axios.get(apiUrl);
  
        // Extract video details
        const duration = response.data.items[0].contentDetails.duration;
  
        const videoData = {
          id: url,
          title,
          duration,
        };
  
        if (selectedVideo) {
          // Update the video if selectedVideo is provided
          await axios.put(`http://localhost:8000/api/updateVideo/${encodeURIComponent(selectedVideo.id)}`, videoData);
          window.alert('Video updated successfully');
        } else {
          // Add a new video if selectedVideo is not provided
          await axios.post('http://localhost:8000/api/addVideo', videoData);
          window.alert('Video added successfully');
        }
  
        // Clear the form fields
        setUrl('');
        setTitle('');
  
        // Close the form
        setShowAddForm(false);
  

        window.location.reload();
      } else {
        alert('Please provide a valid YouTube URL and title.');
      }
    } catch (error) {
      console.error('Error adding/updating video:', error);
      alert('Error adding/updating video. Please try again.');
    }
  };


  const extractVideoIdFromUrl = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|embed\/)([^"&?/\s]{11})/);
    return match ? match[1] : null;
  };

  return (
    <div className="overlay">
    <div className="container">
      <div className="form">
        <h2>{selectedVideo ? 'Update Video' : 'Add New Video'}</h2>
        <div>
          <label>YouTube URL:</label>
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
        <div>
          <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <button onClick={handleAddOrUpdateVideo}>{selectedVideo ? 'Update Video':'Add Video'}</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </div>
    </div>
  );
};

export default AddVideoForm;


//const apiKey = 'AIzaSyD_igiM8komPYHN24yxb7N9XD8GQJVtN-g'; // Replace with your actual API key
//const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${apiKey}`;