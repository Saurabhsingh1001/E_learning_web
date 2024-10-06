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
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
    

},  {timestamps: true}
)

mongoose.model("users",userSchema, "users");