const mongoose = require('mongoose');
//const Users = mongoose.model('user');
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');
const{ JWT_SECRET } = require('../keys');
User = mongoose.model('users');
Video = mongoose.model('videos');
exports.signUp =  async (req, res) => {
    const { name, email, password } = req.body;
 
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required to be filled!!" });
        }
 
        const savedUser = await User.findOne({ email: email });
 
        if (savedUser) {
            return res.status(400).json({ success: false, message: "Email id already exists" });
        }
 
        const hashedPassword = await bcrypt.hash(password, 12);
 
        const user = new User({
            email:email,
            password: hashedPassword,
            name:name
        });
 
        await user.save();
 
        return res.json({ success: true, message: "Successfully Registered" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const savedUser = await User.findOne({ email: email });

    if (!savedUser) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, savedUser.password);

    if (passwordMatch) {
      const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1hr' });
      const user = {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
      };
      res.json({message:"welcome back", user, token });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

exports.saveVideoTime =  async (req, res) => {
  const { videoUrl, time } = req.body;
  const userId = req.user.email; // Assuming you have user authentication and the user ID is available in the request

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the user has already stored progress for this video
    const videoIndex = user.videoProgress.findIndex(progress => progress.videoUrl === videoUrl);

    if (videoIndex !== -1) {
      // Update the existing progress
      user.videoProgress[videoIndex].progress = time;
    } else {
      // Add new progress for the video
      user.videoProgress.push({ videoUrl, progress: time });
    }

    // Save the updated user
    await user.save();

    res.json({ message: 'Video progress saved successfully' });
  } catch (error) {
    console.error('Error saving video progress:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.addToWishlist = async (req, res) => {
  const { videoId, userId, url } = req.body;
  

  try {
    // Check if the videoId is already in the user's wishlist
    const user = await User.findById(userId);
    // console.log(user);
    if (user.wishlist.some((vid) => vid.videourlid === videoId)) {
      return res.status(400).json({ data: [{ error: 'Video already in wishlist' }] });
    }

    // Add the videoId to the user's wishlist
    user.wishlist.push({videourlid: videoId, url: url});
    await user.save();

    res.status(200).json({ message: 'Video added to wishlist successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getwishlist = async (req, res) => {
  try {
    // Extract the UserId from headers
    const userId = req.header('UserId');
    //console.log(userId)
    // In a real-world scenario, you would fetch user data based on authentication
    // Use the userId to fetch the wishlist or perform any other relevant operations
    const user = await User.findById(userId); // Implement a function to fetch user details

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const wishlist = user.wishlist || [];
    const wishlistUrls = wishlist.map(item => ({url: item.url, videourlid: item.videourlid}));

    res.json({ wishlistUrls: wishlistUrls });
    // console.log("thhis is me: ", wishlistUrls)
  } catch (error) {
    console.error('Error fetching wishlist videos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const convertDurationToSeconds = (duration) => {
  const [hours, minutes, seconds] = duration.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};
exports.updateVideoProgress = async (req, res) => {
  const { videoId, userId, progress } = req.body;
  //console.log(req.body);

  try {
    // Find the user by user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the video progress entry for the given video ID
    const videoProgressIndex = user.videoProgress.findIndex(
      (entry) => entry.videoId.toString() === videoId
    );

    if (videoProgressIndex === -1) {
      // If the video ID is not found, add a new entry
      user.videoProgress.push({
        videoId: videoId, // Convert videoId to ObjectId
        progress,
      });
    } else {
      // If the video ID exists, update the progress
      user.videoProgress[videoProgressIndex].progress = progress;
    }

    // Save the updated user
    await user.save();

    const video = await Video.findById(videoId);
    if (video) {
      const videoDurationInSeconds = convertDurationToSeconds(video.duration);

      if (videoDurationInSeconds <= progress) {
        // Add video to completedVideos field
        const isVideoCompleted = user.completedVideos.some(
          (completedVideo) => completedVideo.videoId.toString() === videoId
        );

        if (!isVideoCompleted) {
          // Add video to completedVideos field
          user.completedVideos.push({ videoId: videoId });
          await user.save();
        }
      }
    }


    res.status(200).json({ message: 'Video progress updated successfully' });
  } catch (error) {
    console.error('Error updating video progress:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.completedVideos = async (req, res) => {
  const userId = req.headers['userid'];

  try {
    // Find the user by user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract video IDs from completedVideos field
    //const completedVideoIds = user.completedVideos.map(entry => entry.videoId);

    // Fetch video details for completed videos
    const completedVideosWithUrl = await Promise.all(
      user.completedVideos.map(async (video) => {
        const videoDetails = await Video.findById(video.videoId);
        if (videoDetails) {
          return {
            _id: videoDetails._id,
            title: videoDetails.title,
            url: videoDetails.id, // Assuming the URL is stored in the 'url' field
            // Add other necessary details as needed
          };
        } else {
          return null; // Handle case where video details are not found
        }
      })
    );
    console.log("completed urls :",completedVideosWithUrl)
    res.status(200).json({completedVideosWithUrl : completedVideosWithUrl});
  } catch (error) {
    console.error('Error fetching completed videos:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getVideoProgress = async (req, res) => {
  const { videoId, userId } = req.query;

  try {
    // Find the user by user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the video progress entry for the given video ID
    let videoProgress = user.videoProgress.find(
      (entry) => entry.videoId.toString() === videoId
    );

    if (!videoProgress) {
      // If not found, create a new entry with default progress of zero
      videoProgress = {
        videoId: videoId, // Assuming videoId is a string
        progress: 0,
      };

      // Add the new entry to the user's videoProgress array
      user.videoProgress.push(videoProgress);

      // Save the updated user document
      await user.save();
    }

    res.status(200).json({ progress: videoProgress.progress });
  } catch (error) {
    console.error('Error fetching video progress:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.checkVideoInWishlist = async (req, res) => {
  const { videoId, userId } = req.query;

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the videoId is present in the user's wishlist
    const isInWishlist = user.wishlist.some(video => video.videourlid === videoId);

    res.status(200).json({ inWishlist: isInWishlist, video: user.wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.ProgressVideos = async (req, res) => {
  try {
    const userId = req.headers.userid; // Assuming you're sending the user ID in the headers

    // Find the user based on the provided user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get video IDs and progress from the user's videoProgress array
    const videoProgressData = user.videoProgress || [];
    
    // Extract video IDs and corresponding progress
    const videoIds = videoProgressData.map((progressItem) => progressItem.videoId);
    const videoProgressMap = new Map(videoProgressData.map(item => [item.videoId.toString(), item.progress]));

    // Find videos based on the video IDs
    const videos = await Video.find({ _id: { $in: videoIds } });

    // Combine video details with progress information
    const progressVideos = videos.map((video) => {
      const videoIdString = video._id.toString();
      const progress = videoProgressMap.get(videoIdString) || 0;

      return {
        _id: video._id,
        id: video.id, // Assuming 'id' is a field in your Video model
        progress: progress,
      };
    });

    res.json(progressVideos);
    
  } catch (error) {
    console.error('Error getting progress videos:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



//router.get('/wishlist', 