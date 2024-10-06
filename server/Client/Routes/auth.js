const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('users');
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');
const{ JWT_SECRET } = require('../keys');
// middleware
 
router.post("/signUp", async (req, res) => {
    const { name, email, password } = req.body;
 
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required to be filled!!" });
        }
 
        const savedUser = await Users.findOne({ email: email });
 
        if (savedUser) {
            return res.status(400).json({ success: false, message: "Email id already exists" });
        }
 
        const hashedPassword = await bcrypt.hash(password, 12);
 
        const user = new Users({
            email,
            password: hashedPassword,
            name
        });
 
        await user.save();
 
        return res.json({ success: true, message: "Successfully Registered" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
   
    try {
      const savedUser = await Users.findOne({ email: email });
   
     
      if (!savedUser) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
   
     
      const passwordMatch = await bcrypt.compare(password, savedUser.password);
   
      if (passwordMatch) {
       
        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET ,{expiresIn:'1hr'});
       
        res.json({ token });
      } else {
       
        res.status(401).json({ error: "Invalid email or password" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  });

  module.exports = router;