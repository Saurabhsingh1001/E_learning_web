const mongoose = require('mongoose')
var Schema = mongoose.Schema;
const videoSchema = new Schema({
    id:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    duration:{
        type:String,
        required: true
    },
    likedUsers:[{
      type:String
    }],
    comments: [{
        _id: mongoose.Schema.Types.ObjectId,
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'users', // Reference to the User model
          
        },
        comment: {
          type: String,
          //required: true
        }
      }]


},  {timestamps: true}
)

module.exports = mongoose.model("videos",videoSchema, 'videos');