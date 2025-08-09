const postModel = require('../models/post.model');
const userModel = require('../models/user.model');
const generateContent = require('../services/ai.service')
const createPostController = async (req, res) => {

    let { user } = req;
    const { title, type, prompt } = req.body


    if (user.aiCredits <= 0) {
        return res.status(400).json({
            message: "You are out of AI credits"
        });
    }


    const geminiResponse = await generateContent(title, type, prompt);
    const generatedPost = geminiResponse?.candidates[0]?.content?.parts[0]?.text;
    if (!generatedPost) {
        return res.status(500).json({
            message: "Failed to generate post content"
        });
    }
    await userModel.findOneAndUpdate(
        { _id: user._id }, { aiCredits: user.aiCredits - 1 })



    updatedUser = await userModel.findById(user._id);
    req.user = updatedUser;
    user = req.user;

    const post = await postModel.create({
        title,
        type,
        postBody: {
            content: generatedPost,
            prompt: prompt,
        }
        })
    await userModel.findOneAndUpdate({_id:user._id},{postId:post._id})
    updatedUser = await userModel.findById(user._id);
    req.user = updatedUser;
    user = req.user;

    res.status(200).json({
        message: "post created successfully",
        content: generatedPost,
        userID: user._id,
        userName: updatedUser.name,
        creditLeft: updatedUser.aiCredits,
        user


    });

}

module.exports = { createPostController };