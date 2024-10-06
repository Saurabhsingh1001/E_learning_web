 // Update the path
export function getYouTubeVideoId(url) {
    const regex = /[?&]v=([^#&?]+)/;
    const match = url.match(regex);
    return match && match[1] ? match[1] : null;
  }
const VideoCarousel = ({ videoUrls }) => {
  return (
    <div>
      {/* <h2>YouTube Video Carousel</h2>
      <Corousel videoUrls={videoUrls} /> */}
    </div>
  );
};

export default VideoCarousel;
