// import React, { useState } from 'react';
// import VideoCarousel from './Pages/VideoCorousel'; // Update the path


// export function getYouTubeVideoId(url) {
//     const regex = /[?&]v=([^#&?]+)/;
//     const match = url.match(regex);
//     return match && match[1] ? match[1] : null;
//   }
// const VideoContainer = () => {
//   const [videoUrls, setVideoUrls] = useState([
//     'https://www.youtube.com/watch?v=xNRJwmlRBNU',
//     'https://www.youtube.com/watch?v=lqh06_qFN9U',
//     'https://www.youtube.com/watch?v=N_W7kcFmHlg',
//   ]);

//   const addVideoUrl = (url) => {
//     setVideoUrls([...videoUrls, url]);
//   };

//   return (
//     <div>
//       <h2>YouTube Video Container</h2>
//       <button onClick={() => addVideoUrl('https://www.youtube.com/watch?v=NEW_VIDEO_ID')}>
//         Add New Video
//       </button>
//       <VideoCarousel videoUrls={videoUrls} />
//     </div>
//   );
// };

// export default VideoContainer;
