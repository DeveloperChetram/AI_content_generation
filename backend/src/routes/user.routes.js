const express = require("express");

const userRouter = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const { getProfileController, updateProfileController } = require("../controllers/user.controller");

userRouter.get("/profile", authMiddleware, getProfileController);

userRouter.patch("/update-user", authMiddleware, updateProfileController);

module.exports = userRouter;