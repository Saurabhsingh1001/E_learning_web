const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('users');
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');
const {JWT_SECRET} = require('../keys.js')
 
 
 
router.get('/userList', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
 
  router.get('/paginatedUsers', async(req, res)=>{
    const allUsers = await User.find({});
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    const startIndex = (page - 1)*limit
    const lastIndex = (page)*limit
    const results ={}
    results.totalUsers = allUsers.length;
    results.pageCount = Math.ceil(allUsers.length/limit);
    if(lastIndex < allUsers.length){
      results.next={
        page:page + 1,
      }
    }
    
    if(startIndex > 0){
      results.prev={
        page:page - 1,
      }
    }
    results.result = allUsers.slice(startIndex, lastIndex);
    res.json(results)
  })
  router.delete('/deleteUser/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      res.json(deletedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/api/totalUsers', async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      res.json({ totalUsers });
    } catch (error) {
      console.error('Error fetching total users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
 
  module.exports = router;