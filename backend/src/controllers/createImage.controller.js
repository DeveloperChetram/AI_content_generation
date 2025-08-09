const userModel = require('../models/user.model');
const generateImage = require('../services/generateImage.service')

const createImageController = async (req, res) =>{
   
    const {prompt} = req.body;
     let {user} = req;

        if (user.aiImageCredits <= 0) {
            return res.status(400).json({
                message: "You are out of AI image credits"
            });
        }
    const result = await generateImage(prompt);
    if(!result.success){
            return res.status(500).json({
        message: "Failed to image"
    });
    }

      await userModel.findOneAndUpdate(
            {_id: user._id}, {aiImageCredits: user.aiImageCredits - 1})
    
         
    
            updatedUser = await userModel.findById(user._id);
            req.user = updatedUser;
            user = req.user;
    

    res.status(200).json({
        message: "Image generated successfully",
        result,
        user
    });
}

module.exports = { createImageController };