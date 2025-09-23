const express = require("express");
const multer = require("multer");

const userRouter = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const { getProfileController, updateProfileController, uploadProfilePictureController } = require("../controllers/user.controller");

const upload = multer({ storage: multer.memoryStorage() });
userRouter.get("/profile", authMiddleware, getProfileController);

userRouter.patch("/update-user", authMiddleware,upload.single('profilePicture'), updateProfileController);

module.exports = userRouter;