// VideoComments.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VideoComment.css'
import { FaCircleUser } from "react-icons/fa6";

const VideoComments = () => {
  const videoId = localStorage.getItem('videoId')
    
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState([]);

  const submitComment = async () => {
    if (!commentInput) {
        alert('Please enter a comment');
        return;
    }

    try {
        // Retrieve userId from local storage
        const userId = localStorage.getItem('userid');

        // Check if userId exists
        if (!userId) {
            alert('User not authenticated');
            return;
        }

        // Submit the comment to the backend along with userId
        await axios.post(`http://localhost:5000/api/videos/${videoId}/comments`, {
            userId: userId,
            comment: commentInput
        });

        // Clear the input field
        setCommentInput('');

        // Refresh the comments list
        await loadComments();
    } catch (error) {
        console.error(error);
        alert('Failed to submit comment');
    }
};

  const loadComments = async () => {
    try {
      // Fetch comments from the backend
      const response = await axios.get(`http://localhost:5000/api/videos/${videoId}/getcomments`);
      setComments(response.data);
    } catch (error) {
      console.error(error);
      alert('Failed to load comments');
    }
  };

  useEffect(() => {
    // Load comments when the component mounts
    loadComments();
  }, [videoId]);

  return (
    <div className="main-comment-div">
      <h2 id="heading-for-comment">Comments</h2>
      <div className="input-div">
        <label htmlFor="commentInput"></label>
        <input
          placeholder='&nbsp;&nbsp;Enter Comment...'
          
          className="input-comment"
          type="text"
          id="commentInput"
          value={commentInput}
          
          onChange={(e) => setCommentInput(e.target.value)}
        />
        <button className="button-comment" onClick={submitComment}>Submit</button>
      </div>
      <div className="user-comments">
        {comments.map((comment, index) => (
          <div key={index} className="user-single-comments">
            <FaCircleUser style={{height:'20px',Size:"60px"}}/><strong><div className="div-for-username">{comment.userName}</div></strong><div className="comments-div-user"> {comment.comment}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoComments;
