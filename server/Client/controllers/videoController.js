// const express = require('express');
// const router = express.Router();
const mongoose = require("mongoose");
//const Users = mongoose.model('user');
const Video = mongoose.model("videos");
const User = mongoose.model("users");
const authenticateUser = require("../helper/requirelogin");
// Route to fetch videos
exports.video = async (req, res) => {
  try {
    // Retrieve all video details from MongoDB
    const videos = await Video.find({});

    if (videos.length === 0) {
      return res.status(404).json({ error: "Videos not found" });
    }
    //console.log(videos)
    // Return all details for all videos
    const videoDetails = videos.map((video) => ({
      _id: video._id,
      id: video.id,
      title: video.title,
      duration: video.duration,
      likedUsers: video.likedUsers,
      // Add more fields as needed
    }));

    res.status(200).json(videoDetails);
  } catch (error) {
    console.error("Error getting videos:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
    console.log("hi");
  }
};

exports.search = async (req, res) => {
  try {
    const { q } = req.query;
    // Use a case-insensitive regex to search for titles containing the query
    const videos = await Video.find({ title: { $regex: new RegExp(q, "i") } });
    res.json(videos);
  } catch (error) {
    console.error("Error searching videos:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.like = async (req, res) => {
  const { videoId } = req.params;
  const { like, userId } = req.body;
  
  try {
    const video = await Video.findById(videoId);
  
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
  
    if (like === true) {
      video.likedUsers.push(userId);
    } else if (like === false) {
      video.likedUsers.pull(userId);
    }
  
    await video.save();
  
    const likeCount = video.likedUsers.length;
    console.log("aaaaaaaaaaaa")
    res.json({ message: "Like status updated successfully", likeCount });
  } catch (error) {
    console.error("Error updating like status:", error);
    console.log("iiiiii")
    res.status(500).json({ message: "Internal server error" });
  }
  
};

// exports.random =  async (req, res) => {
//   try {
//     const randomVideo = await Video.aggregate([{ $sample: { size: 1 } }]);
//     res.json(randomVideo[0]); // Return the first (and only) random video
//   } catch (error) {
//     console.error('Error fetching random video:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

exports.getvideoplay = async (req, res) => {
  try {
    const videoId = req.params.videoId;

    // Fetch video details based on the provided video ID
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    // Return video details including the video URL
    res
      .status(200)
      .json({ videoUrl: video.videoUrl /* other details if needed */ });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.videodetails = async (req, res) => {
  const videoId = req.params.videoId;

  try {
    // Fetch video details from MongoDB using Mongoose
    const video = await VideoModel.findOne({ id: videoId });
    // Fetch comments related to the video
    const comments = await CommentModel.find({ videoId });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    res.json({ video, comments });
  } catch (error) {
    console.error("Error fetching video details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.commentsForVideo = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    console.log(videoId);

    const video = await Video.findOne({ _id: videoId });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    const newComment = {
      userId: req.body.userId,
      comment: req.body.comment,
    };

    video.comments.push(newComment);
    await video.save();

    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getCommentsForVideo = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    console.log(videoId);

    const video = await Video.findOne({ _id: videoId }).populate(
      "comments.userId",
      "name"
    );
    console.log(video);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    const comments = video.comments.map((comment) => ({
      userName: comment.userId.name, // Assuming 'name' is a field in your User model
      comment: comment.comment,
    }));
    console.log(comments);
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
