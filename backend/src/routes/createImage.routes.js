const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware')
const {createImageController} = require('../controllers/createImage.controller');

const generateImageRouter = express.Router();

generateImageRouter.post('/', authMiddleware, createImageController);


module.exports = generateImageRouter;