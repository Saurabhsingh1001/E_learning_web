const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Video = mongoose.model('videos');

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
  
  
  router.post('/api/addVideo', async (req, res) => {
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

module.exports = router;