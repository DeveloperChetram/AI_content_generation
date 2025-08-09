const express = require('express');
const postRouter = express.Router();
const {createPostController} = require('../controllers/post.controller');
const authMddleware = require('../middlewares/auth.middleware');


postRouter.post('/create-post', authMddleware, createPostController);


module.exports = postRouter;