const postModel = require('../models/post.model');
const userModel = require('../models/user.model');
const generateContent = require('../services/ai.service')
const { uploadImage, uploadImageFromUrl } = require('../services/imagekit.service')
const likeModel = require('../models/like.model');
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
const uploadImageControllerForLink = async (req, res) => {
    const {imageUrl} = req.body;
    try {
        if (!imageUrl) {
            return res.status(400).json({
                message: "Image URL is required"
            });
        }
        
        const imagekitResponse = await uploadImageFromUrl(imageUrl);
        res.status(200).json({
            message: "Image uploaded successfully",
            image: imagekitResponse
        });
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({
            message: "Failed to upload image",
            error: error.message
        });
    }
}
const uploadImageController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded"
            });
        }
        
        console.log("req.file", req.file);
        const imagekitResponse = await uploadImage(req.file);
        console.log("imagekitResponse", imagekitResponse);
        
        res.status(200).json({
            message: "Image uploaded successfully",
            image: imagekitResponse
        });
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({
            message: "Failed to upload image",
            error: error.message
        });
    }
}

const savePostController = async (req, res) => {
    const {title, content, type, prompt, imagePrompt, imageUrl } = req.body;
    const { user } = req;



 
    const newPost = await postModel.create({
       title: title,
       type: type,
       postBody: {
           content: content,
           prompt: prompt,
           image: {
            prompt: imagePrompt,
            url: imageUrl   
           }
       },
       user: user._id,
       username: user.name,
       userProfilePicture: user.profilePicture
   });
   res.status(200).json({
    message: "Post saved successfully",
    post: newPost,
    userID: user._id,
    postId: newPost._id,
    type: type,
    prompt: prompt,
    userName: user.name,
    creditLeft: user.aiCredits,
    userProfilePicture: user.profilePicture
   });
   
}
const getAllPostsWithoutAuthController = async (req, res) => {
   try {
     const posts = await postModel.find({isPosted: true}).sort({createdAt: -1});
     res.status(200).json({
         message: "Posts fetched successfully",
         posts: posts
     });
   } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
        message: "Failed to fetch posts",
        error: error.message
    });
   }
}
const getPostController = async (req, res) => {
    const { user } = req;
    try {
    const posts = await postModel.find({isPosted: true}).sort({createdAt: -1});
    const LikedPosts = await likeModel.find({user: user._id})
    const likedPostsIds = LikedPosts.map(like => like.post)
    res.status(200).json({
        message: "Posts fetched successfully",
        posts: posts,
        likedPosts:likedPostsIds
    });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({
            message: "Failed to fetch posts",
            error: error.message
        });
    }
}

const getPostsByUserController = async (req, res) => {
    const { user } = req;
    const posts = await postModel.find({user: user._id})
    console.log(user)
   
    console.log("posts from getPostsByUserController", posts)
    res.status(200).json({
        message: "Posts fetched successfully",
        posts: posts,
        
    });
}
const getPostByIdController = async (req, res) => {
    const { id } = req.params;
    const post = await postModel.findById(id);
    res.status(200).json({
        message: "Post fetched successfully",
        post: post
    });
}
module.exports = { createPostController, savePostController, uploadImageController, uploadImageControllerForLink, getPostController, getPostsByUserController, getAllPostsWithoutAuthController, getPostByIdController};