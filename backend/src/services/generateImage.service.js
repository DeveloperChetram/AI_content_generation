const axios = require('axios');

const generateImage = async(prompt)=>{
 try {
    const response = await axios.post(
         "https://pigenaiapi.onrender.com/generate",
         {
           video_description: prompt,
           aspect_ratio: "16:9"
         },
         {
           headers: { "Content-Type": "application/json" }
         }
       );
       return response.data;
 } catch (error) {
    
    console.error("Error generating image:", error);
    throw new Error("Image generation failed");

 }

}

module.exports = generateImage;