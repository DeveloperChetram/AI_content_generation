const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware')
const {getAdminController} = require('../controllers/admin.controller')

const adminRouter = express.Router();

adminRouter.get('/',authMiddleware, adminMiddleware,getAdminController)

module.exports = adminRouter;