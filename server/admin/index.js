const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 8000; // Change this to your desired port

app.use(cors());
mongoose.connect('mongodb://127.0.0.1:27017/Elearning', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


require("./models/adminModel")
require("./models/userModel")
app.use(express.json())
app.use(require("./Routes/adminAuth"))
app.use(require("./Routes/userlist"))
// app.use(require("./Routes/paginatedUsers"))

const videoSchema = new mongoose.Schema({
  id: String,
  title:String,
  duration: String,
});

const Video = mongoose.model('videos', videoSchema);

app.use(bodyParser.json());

// Function to parse ISO 8601 duration and convert to HH:MM:SS format
const convertDurationFormat = (isoDuration) => {
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  const hours = match[1] ? parseInt(match[1], 10) : 0;
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const seconds = match[3] ? parseInt(match[3], 10) : 0;

  const hh = hours.toString().padStart(2, '0');
  const mm = minutes.toString().padStart(2, '0');
  const ss = seconds.toString().padStart(2, '0');

  return `${hh}:${mm}:${ss}`;
};


app.post('/api/addVideo', async (req, res) => {
  try {
    const { id,title , duration } = req.body;

    // Convert ISO 8601 duration to hh:mm:ss format
    const formattedDuration = convertDurationFormat(duration);

    const newVideo = new Video({
      id,
      title,
      duration: formattedDuration,
    });

    await newVideo.save();

    res.status(201).json({ message: 'Video added successfully' });
  } catch (error) {
    console.error('Error adding video:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getVideos', async (req, res) => {
  try {
    // Retrieve all video details from MongoDB
    const videos = await Video.find({});

    if (videos.length === 0) {
      return res.status(404).json({ error: 'Videos not found' });
    }

    // Return all details for all videos
    const videoDetails = videos.map(video => ({
      id: video.id,
      title: video.title,
      duration: video.duration,
      // Add more fields as needed
    }));

    res.status(200).json(videoDetails);
  } catch (error) {
    console.error('Error getting videos:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/paginatedVideos', async(req, res)=>{
  const videos = await Video.find({});
  const page = parseInt(req.query.page)
  const limit = parseInt(req.query.limit)

  const startIndex = (page - 1)*limit
  const lastIndex = (page)*limit
  const results ={}
  results.totalUsers = videos.length;
  results.pageCount = Math.ceil(videos.length/limit);
  if(lastIndex < videos.length){
    results.next={
      page:page + 1,
    }
  }
  
  if(startIndex > 0){
    results.prev={
      page:page - 1,
    }
  }
  results.result = videos.slice(startIndex, lastIndex);
  res.json(results)
})

app.delete('/api/deleteVideo/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    console.log("hhhhh: ",videoId);
    
    // Check if the video exists
    const video = await Video.findOne({ _id: videoId });
    
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Delete the video from MongoDB
    await Video.findOneAndDelete({ _id: videoId });

    res.json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.put('/api/updateVideo/:videoUrl', async (req, res) => {
  try {
    const { videoUrl } = req.params;
    const { title, id } = req.body;

    // Update the video in MongoDB
    const updatedVideo = await Video.findOneAndUpdate(
      { id: decodeURIComponent(videoUrl) },
      { $set: { title, id } },
      { new: true } // Return the updated document
    );

    if (!updatedVideo) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json({ success: true, message: 'Video updated successfully', updatedVideo });
  } catch (error) {
    console.error('Error updating video:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get('/api/totalVideos', async (req, res) => {
  try {
    const totalVideos = await Video.countDocuments();
    console.log(totalVideos)
    res.json({ totalVideos });
  } catch (error) {
    console.error('Error fetching total videos:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





mongoose.connection.on("connected",()=>{
  try{
    console.log("connected to mongo")
  }catch(error){
    console.log(err)
  }
})


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
