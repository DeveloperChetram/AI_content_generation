const userModel = require("../models/user.model");
const jtw = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const { uploadImage } = require("../services/imagekit.service");
const postModel = require("../models/post.model");

const getProfileController = async (req, res)=>{
    res.send('get profile chal rha hai ')
}

const updateProfileController = async (req,res)=>{
try {
    const userId = req.user._id;
    const profilePicture = req.file; // File object or undefined if no file uploaded
    console.log("profilePicture", profilePicture);
    const {username, email, password, bio} = req.body;
const user = await userModel.findOne({_id:userId})
if(!user){
    return res.status(404).json({
        message: 'User not found'
    })
}

let profilePictureUrl = user.profilePicture;
if(profilePicture){
    try {
        console.log("profilePicture", profilePicture);
        const imageKitResponse = await uploadImage(profilePicture)
        profilePictureUrl = imageKitResponse.url
    } catch (error) {
        console.error('Error uploading image:', error)
        return res.status(500).json({
            message: 'Error uploading profile picture'
        })
    }
}

// Handle password update if provided
let passwordHash = user.passwordHash;
if(password){
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if(isPasswordValid){
        passwordHash = await bcrypt.hash(password, 10)
    }
}

const updatedUser = await userModel.findByIdAndUpdate(
    {_id: userId}, 
    {
        name: username || user.name,
        email: email || user.email,
        passwordHash: passwordHash,
        bio: bio || user.bio,
        profilePicture: profilePictureUrl
    },
    { new: true }
)
// const updatedPosts = await postModel.findByIdAndUpdate({user:userId},{username:username || user.name})
res.status(201).json({
    message:"user updated",
    updatedUser,
    // updatedPosts
})

} catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
        message: 'Error updating profile',
        error: error.message
    });
}
}

module.exports = {
    getProfileController,
    updateProfileController,
    // uploadProfilePictureController
}