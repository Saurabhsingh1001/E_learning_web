const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../keys');
const mongoose = require('mongoose');
const Admin = mongoose.model("admins"); // Check if the model name matches your schema
 
module.exports = (req, res, next) => {
    const { authorization } = req.headers;
 
    if (!authorization) {
        return res.status(401).json({ error: "You must be logged in" });
    }
 
    const token = authorization.replace("Bearer ", "");
 
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) {
            console.error(err);
            return res.status(401).json({ error: "Invalid token" });
        }
 
        const { _id } = payload;
 
        Admin.findById(_id)
            .then(admindata => {
                if (!admindata) {
                    return res.status(401).json({ error: "Admin not found" });
                }
 
                req.admins = admindata;
                next();
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: "An error occurred while looking up the admin" });
            });
    });
};
