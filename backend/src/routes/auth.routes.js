const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware')
const adminMiddleware = require('../middlewares/admin.middleware')
const {registerController,loginController,logoutController, userController} = require('../controllers/auth.controller')

const authRouter = express.Router();


authRouter.post('/register',registerController)
authRouter.post('/login',loginController)
authRouter.get('/logout',authMiddleware, logoutController)
authRouter.get('/user',authMiddleware, userController)



module.exports = authRouter;