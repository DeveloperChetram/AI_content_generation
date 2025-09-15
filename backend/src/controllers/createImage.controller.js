const postModel = require('../models/post.model');
const userModel = require('../models/user.model');
const { callA4FWithAxios } = require('../services/a4f.ai.service');
// const generateImage = require('../services/generateImage.service');
const uploadImage = require('../services/imagekit.service');

const createImageController = async (req, res) => {
    // const { postId } = req.params;
    // if (!postId) {
    //     res.status(400).json({
    //         message: "post id not found first create post"
    //     })
    // }

    const { prompt, aspectRatio = "16:9" } = req.body; // Default to 16:9
    let { user } = req;

    if (user.aiImageCredits <= 0) {
        return res.status(400).json({
            message: "You are out of AI image credits"
        });
    }
    // const result = await generateImage(prompt);
    const result = await callA4FWithAxios(prompt, aspectRatio);
    if (!result.success) {
        return res.status(500).json({
            message: "Failed to image"
        });
    }
    console.log("result from createImageController", result)
  
    res.status(200).json({
        message: "Image generated successfully",
        image: result.image_url,
        prompt: prompt,
        user: user,
    });
}

// const uploadImageController = async (req, res) => {
//     const { postId } = req.params;
//     const { imagePrompt, image_url } = req.body;
//     const { user } = req;

//     const imagekitResponse = await uploadImage(image_url)

//     const updatedPost = await postModel.findByIdAndUpdate(postId, {
//         $set: {
//             'postBody.image.prompt': imagePrompt,
//             'postBody.image.url': imagekitResponse.url
//         }
//     }, { new: true }); // {new: true} returns the updated document
//         await userModel.findOneAndUpdate(
//             { _id: user._id }, { aiImageCredits: user.aiImageCredits - 1 })

//             updatedUser = await userModel.findById(user._id);
//             req.user = updatedUser;
//             user = req.user;
    
//     res.status(200).json({
//         message: "Image uploaded successfully",
//         image: imagekitResponse.url,
//         user: user,
//         post: updatedPost,
//     });
// }
// module.exports = { createImageController, uploadImageController };
module.exports = { createImageController };