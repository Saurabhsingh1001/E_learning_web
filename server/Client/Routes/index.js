const express = require("express"),
	api = express.Router();

const controller = require('../controllers')


api.post('/signUp',controller.user.signUp)
api.post('/login',controller.user.login)
api.post('/saveVideoTime',controller.user.saveVideoTime)
api.get('/getVideos',controller.video.video)
api.get('/getVideosplay',controller.video.getvideoplay)
api.post('/addToWishlist',controller.user.addToWishlist)
api.get('/getwishlist',controller.user.getwishlist)
api.get('/search',controller.video.search)
api.put('/videos/:videoId/like',controller.video.like)
api.get('/checkVideoInWishlist',controller.user.checkVideoInWishlist)
// api.get('/search',controller.video.search)
// api.get('/search',controller.video.random)
api.post('/videos/:videoId/comments',controller.video.commentsForVideo)
api.get('/videos/:videoId/getcomments',controller.video.getCommentsForVideo)
api.get('/getVideoDetails',controller.video.videodetails)
api.post('/updateVideoProgress',controller.user.updateVideoProgress)
api.get('/getVideoProgress',controller.user.getVideoProgress)
api.get('/completedVideos',controller.user.completedVideos)
api.get('/ProgressVideos',controller.user.ProgressVideos)


module.exports = api;