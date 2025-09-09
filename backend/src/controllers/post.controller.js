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


    // updatedUser = await userModel.findById(user._id);
    // req.user = updatedUser;
    // user = req.user;

    res.status(200).json({
        message: "post created successfully",
        content: generatedPost,
        userID: user._id,
        postId: generatedPost._id,
        title: title,
        type: type,
        prompt: prompt,
        userName: updatedUser.name,
        creditLeft: updatedUser.aiCredits,
        user


    });

}

const savePostController = async (req, res) => {
    const {title, content, userID, type, prompt } = req.body;
    const { user } = req;
    // const savedPost = await postModel.findById(postId);
    if (!content || !userID || !type || !prompt) {
        return res.status(404).json({ message: "Post not found" });
    }
    const newPost = await postModel.create({
       title: title,
       type: type,
       postBody: {
           content: content,
           prompt: prompt,
       },
       user: userID 
   });
   res.status(200).json({
    message: "Post saved successfully",
    post: newPost,
    userID: user._id,
    postId: newPost._id,
    type: type,
    prompt: prompt,
    userName: user.name,
    creditLeft: user.aiCredits
   });
   
      await userModel.findByIdAndUpdate(user._id, {
       $push: { posts:  {_id:newPost._id, title:title,}  }
   });
}

module.exports = { createPostController, savePostController };