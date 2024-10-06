const mongoose = require('mongoose')

const videoSchema = new mongoose.Schema({
    url:{
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
    }


}, {timestamps: true}
)

mongoose.model("videos",videoSchema)