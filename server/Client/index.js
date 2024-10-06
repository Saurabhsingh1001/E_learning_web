const express  = require('express')
 
const mongoose=require('mongoose')
const cors = require('cors')
const app = express()
app.use(cors())
const PORT=5000
app.use(express.json())
mongoose.connect("mongodb://127.0.0.1:27017/Elearning")
 
require("./models/user")
require("./models/video")
 
app.use(require("./Routes/auth"))
app.use(require("./Routes/video"))

 
mongoose.connection.on("connected",()=>{
    console.log("connected to mongo")
})
app.listen(PORT,()=>{
    console.log("Server is running",PORT)
})