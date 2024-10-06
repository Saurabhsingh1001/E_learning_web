// // VideoForm.js
// import React, { useState } from 'react';
// import ReactPlayer from 'react-player';

// const VideoForm = () => {
//   const [videoUrl, setVideoUrl] = useState('');
//   const [videoTitle, setVideoTitle] = useState('');
//   const [videoId, setVideoId] = useState('');
//   const [recentVideoId, setRecentVideoId] = useState('');

//   const handleUrlChange = (e) => {
//     setVideoUrl(e.target.value);
//   };

//   const handleTitleChange = (e) => {
//     setVideoTitle(e.target.value);
//   };

//   const extractVideoId = (url) => {
//     // Regex to extract video ID from YouTube URL
//     const regex = /[?&]v=([^?&]+)/;
//     const match = url.match(regex);
//     return match ? match[1] : null;
//   };

//   const handleSaveVideo = () => {
//     const newVideoId = extractVideoId(videoUrl);

//     // Save video to the database (you can replace this with your actual database logic)
//     // Assume there's a function saveVideoToDatabase(videoId, videoTitle) for saving videos
//     saveVideoToDatabase(newVideoId, videoTitle);

//     // Update state with the most recently added video ID
//     setRecentVideoId(newVideoId);

//     // Reset form fields
//     setVideoUrl('');
//     setVideoTitle('');
//   };

//   return (
//     <div>
//       <h2>Add Video</h2>
//       <label>
//         Video URL:
//         <input type="text" value={videoUrl} onChange={handleUrlChange} />
//       </label>
//       <br />
//       <label>
//         Video Title:
//         <input type="text" value={videoTitle} onChange={handleTitleChange} />
//       </label>
//       <br />
//       <button onClick={handleSaveVideo}>Save Video</button>

//       {/* Display the most recently added video */}
//       {recentVideoId && (
//         <div>
//           <h2>Recent Video</h2>
//           <ReactPlayer url={`https://www.youtube.com/watch?v=${recentVideoId}`} controls />
//         </div>
//       )}
//     </div>
//   );
// };

// export default VideoForm;
