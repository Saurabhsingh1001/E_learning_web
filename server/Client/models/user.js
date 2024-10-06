const mongoose = require('mongoose')
var Schema = mongoose.Schema;
const userSchema = new Schema({
    name:{
        type: String,
        required: true,
        lowercase: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        index:true,
        lowercase: true
    },
    password:{
        type:String,
        required: true
    },
    wishlist: [
     { 
      _id: mongoose.Schema.Types.ObjectId,
      videourlid: String,
      url: String
    }],

    completedVideos: [
      {
        videoId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'videos',
          required: true,
        },
      },
    ],
    
    videoProgress: [
      {
        videoId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'videos', // Assuming you have a Video model for storing video details
          required: true,
        },
        progress: {
          type: Number,
          default: 0,
        },
      },
    ],
    

},  {timestamps: true}
)

module.exports = mongoose.model("users",userSchema, "users");