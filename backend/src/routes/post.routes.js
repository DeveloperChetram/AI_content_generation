const express = require('express');
const postRouter = express.Router();
const {createPostController, savePostController, uploadImageController, uploadImageControllerForLink, getPostController, getPostsByUserController, getAllPostsWithoutAuthController, getPostByIdController} = require('../controllers/post.controller');
const authMddleware = require('../middlewares/auth.middleware');
const { likePostController } = require('../controllers/like.controller');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
postRouter.post('/create-post', authMddleware, createPostController);
postRouter.post('/save-post', authMddleware, savePostController);
postRouter.post('/upload-image', authMddleware, upload.single('file'), uploadImageController);
postRouter.post('/upload-image-for-link', authMddleware, uploadImageControllerForLink);
postRouter.get('/get-all-posts', getAllPostsWithoutAuthController);
postRouter.get('/get-posts', authMddleware, getPostController);
postRouter.get('/get-posts-by-user', authMddleware, getPostsByUserController);
postRouter.post('/like-post', authMddleware, likePostController);
postRouter.get('/get-post-by-id/:id', authMddleware, getPostByIdController);


module.exports = postRouter;