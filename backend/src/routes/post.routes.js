const express = require('express');
const postRouter = express.Router();
const {createPostController, savePostController} = require('../controllers/post.controller');
const authMddleware = require('../middlewares/auth.middleware');


postRouter.post('/create-post', authMddleware, createPostController);
postRouter.post('/save-post', authMddleware, savePostController);


module.exports = postRouter;