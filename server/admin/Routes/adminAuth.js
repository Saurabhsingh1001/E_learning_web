const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Admin = mongoose.model('admins');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../keys');



router.post('/admin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare plaintext password directly (not recommended for security reasons)
    if (password === admin.password) {
      return res.json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
  
});


module.exports = router;
