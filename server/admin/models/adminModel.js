const mongoose = require('mongoose')
 
const adminSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type:String,
        required: true
    }
 
})
 
mongoose.model("admins",adminSchema);
//console.log(mongoose.model("admins",adminSchema))