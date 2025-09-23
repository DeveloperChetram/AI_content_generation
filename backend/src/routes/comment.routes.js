const express = require('express');
const commentRouter = express.Router();
const {
    createCommentController,
    getCommentsByPostController,
    updateCommentController,
    deleteCommentController
} = require('../controllers/comment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Create a new comment
commentRouter.post('/create-comment', authMiddleware, createCommentController);

// Get all comments for a specific post
commentRouter.get('/get-comments/:postId', getCommentsByPostController);

// Update a comment
commentRouter.put('/update-comment/:commentId', authMiddleware, updateCommentController);

// Delete a comment
commentRouter.delete('/delete-comment/:commentId', authMiddleware, deleteCommentController);

module.exports = commentRouter;
