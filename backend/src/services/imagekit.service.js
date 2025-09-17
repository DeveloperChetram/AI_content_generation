var imageKit = require('imagekit')
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

let imagekit = new imageKit({
    publicKey:process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint:process.env.IMAGEKIT_URL_ENDPOINT
});

const uploadImage = (file)=>{
    return new Promise ((resolve, reject)=>{
        // Handle multer file object - use the buffer property
        const fileBuffer = file.buffer || file;
        
        imagekit.upload({
            file: fileBuffer,
            fileName: uuidv4(),
            folder: "generatedImages"
        },(err,result)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(result)
            }
        })
    })
}

const uploadImageFromUrl = async (imageUrl)=>{
    try {
        // Download the image from the URL
        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer'
        });
        
        // Convert arraybuffer to buffer
        const imageBuffer = Buffer.from(response.data);
        
        // Upload to ImageKit
        return new Promise((resolve, reject) => {
            imagekit.upload({
                file: imageBuffer,
                fileName: uuidv4(),
                folder: "generatedImages"
            }, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    } catch (error) {
        throw new Error(`Failed to download image from URL: ${error.message}`);
    }
}

module.exports = { uploadImage, uploadImageFromUrl };