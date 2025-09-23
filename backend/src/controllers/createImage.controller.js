const postModel = require('../models/post.model');
const userModel = require('../models/user.model');
const { callA4FWithAxios } = require('../services/a4f.ai.service');
const uploadImage = require('../services/imagekit.service');

const createImageController = async (req, res) => {

    const { prompt, aspectRatio = "16:9" } = req.body;
    let { user } = req;
    user = await userModel.findById(user._id);

    

    if (user.aiImageCredits <= 0) {
        return res.status(400).json({
            message: "You are out of AI image credits"
        });
    }
    const result = await callA4FWithAxios(prompt, aspectRatio);
    if (!result.success) {
        return res.status(500).json({
            message: "Failed to image"
        });
    }
    const updatedUser = await userModel.findByIdAndUpdate(user._id, { aiImageCredits: user.aiImageCredits - 1 }, { new: true });
    req.user = updatedUser;
  


    console.log("result from createImageController", result)
  
    res.status(200).json({
        message: "Image generated successfully",
        image: result.image_url,
        prompt: prompt,
        user: updatedUser,
    });
}

module.exports = { createImageController };