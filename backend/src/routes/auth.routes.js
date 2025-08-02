const express = require('express');
const authMddleware = require('../middlewares/auth.middleware')
const {registerController,loginController,userController} = require('../controllers/auth.controllers')

const userRouter = express.Router();


userRouter.post('/register',registerController)
userRouter.post('/login',loginController)
userRouter.get('/user',authMddleware,userController)



module.exports = userRouter;