const express = require("express");

const userRouter = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const { getProfileController } = require("../controllers/user.controller");

userRouter.get("/profile", authMiddleware, getProfileController);

module.exports = userRouter;