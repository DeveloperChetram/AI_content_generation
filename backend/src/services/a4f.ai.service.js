const dotenv = require('dotenv').config();
const axios = require('axios');

const A4F_API_KEY = process.env.A4F_API_KEY || "YOUR_A4F_API_KEY";
const A4F_BASE_URL = "https://api.a4f.co/v1";

async function callA4FWithAxios(prompt, aspectRatio = "16:9") {
    const headers = {
        "Authorization": `Bearer ${A4F_API_KEY}`,
        "Content-Type": "application/json",
    };

    // A4F API supported sizes: 1024x1024, 1792x1024, or 1024x1792
    const sizeMap = {
        "1:1": "1024x1024",     // Square
        "16:9": "1792x1024",    // Landscape (closest to 16:9)
        "9:16": "1024x1792"     // Portrait
    };

    const size = sizeMap[aspectRatio] || sizeMap["16:9"]; // Default to 16:9

    const payload = {
        model: "provider-4/imagen-4", // Use an A4F provider-prefixed model
        prompt: prompt + " always in a style of a comic book",
        n: 1,
        size: size
    };

    console.log(`Generating image with size: ${size} (aspect ratio: ${aspectRatio})`);

    try {
        const response = await axios.post(`${A4F_BASE_URL}/images/generations`, payload, { headers });
        console.log("Generated image URL:", response.data.data[0].url);
        return {success: true, image_url: response.data.data[0].url};
    } catch (error) {
        console.error("Error calling A4F API with axios:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else if (error.request) {
            console.error("No response received:", error.request);
        } else {
            console.error("Error setting up request:", error.message);
        }
        throw error;
    }
}

// Export the function for use in other modules
module.exports = { callA4FWithAxios };

// Uncomment the line below to test the function directly
// callA4FWithAxios();