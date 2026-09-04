const userModel = require('../models/user.model');
const { generatePollinationsImage } = require('../services/pollinations.service');
const { callA4FWithAxios } = require('../services/a4f.ai.service');

const createImageController = async (req, res) => {
    try {
        const { prompt, aspectRatio = "16:9", model = "flux", provider = "pollinations" } = req.body;
        let { user } = req;
        user = await userModel.findById(user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.aiImageCredits <= 0) {
            return res.status(400).json({
                message: "You are out of AI image credits"
            });
        }

        let result;

        if (provider === "pollinations" || !provider) {
            result = await generatePollinationsImage(prompt, { aspectRatio, model });
            
            // Fallback to A4F if Pollinations fails
            if (!result.success) {
                console.warn("[createImageController] Pollinations failed, attempting A4F fallback...");
                try {
                    result = await callA4FWithAxios(prompt, aspectRatio);
                } catch (fallbackError) {
                    console.error("[createImageController] Fallback also failed:", fallbackError);
                }
            }
        } else {
            result = await callA4FWithAxios(prompt, aspectRatio);
        }

        if (!result || !result.success) {
            return res.status(500).json({
                message: result?.error || "Failed to generate image"
            });
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            user._id, 
            { aiImageCredits: user.aiImageCredits - 1 }, 
            { new: true }
        );
        req.user = updatedUser;

        console.log("result from createImageController", result);

        res.status(200).json({
            message: "Image generated successfully",
            image: result.image_url,
            prompt: prompt,
            model: result.model || model,
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error in createImageController:", error);
        res.status(500).json({
            message: "Error generating image",
            error: error.message
        });
    }
}

module.exports = { createImageController };