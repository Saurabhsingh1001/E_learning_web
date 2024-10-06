const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Video = mongoose.model('videos');
const ObjectId = mongoose.Types.ObjectId;
router.get('/api/getVideos', async (req, res) => {
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

// backend/routes/api.js

router.post('/api/addToWishlist', async (req, res) => {
  try {
    const { email, videoDetails } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add the video details to the user's wishlist
    user.wishlist.push(videoDetails);
    await user.save();

    res.status(200).json({ message: 'Video added to wishlist successfully' });
  } catch (error) {
    console.error('Error adding video to wishlist:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/search', async (req, res) => {
  const searchTitle = req.query.title;

  try {
    const videos = await Video.find({ title: { $regex: searchTitle, $options: 'i' } });
    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


router.put('/videos/:videoId/like', async (req, res) => {
  const { videoId } = req.params;

const {like ,userId}= req.body
const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

if(like){
  video.likedUsers.push(userId);
  await video.save();
} else {
  video.likedUsers.pull(userId);
  await video.save();
}
const likeCount = video.likedUsers.length;
res.json({ message: 'Like status updated successfully', likeCount });
})

module.exports = router;

