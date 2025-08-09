const postModel = require('../models/post.model');
const userModel = require('../models/user.model');
const generateImage = require('../services/generateImage.service');
const uploadImage = require('../services/imagekit.service');

const createImageController = async (req, res) => {
    const { postId } = req.params;
    if (!postId) {
        res.status(400).json({
            message: "post id not found first create post"
        })
    }

    const { prompt } = req.body;
    let { user } = req;

    if (user.aiImageCredits <= 0) {
        return res.status(400).json({
            message: "You are out of AI image credits"
        });
    }
    const result = await generateImage(prompt);
    if (!result.success) {
        return res.status(500).json({
            message: "Failed to image"
        });
    }
    const imagekitResponse =await uploadImage(result)
const updatedPost = await postModel.findByIdAndUpdate(postId, {
    $set: {
        'postBody.image.prompt': prompt,
        'postBody.image.url': imageUrl
    }
}, { new: true }); // {new: true} returns the updated document
    await userModel.findOneAndUpdate(
        { _id: user._id }, { aiImageCredits: user.aiImageCredits - 1 })





    updatedUser = await userModel.findById(user._id);
    req.user = updatedUser;
    user = req.user;


    res.status(200).json({
        message: "Image generated successfully",
        updatedPost,
        user
    });
}

module.exports = { createImageController };