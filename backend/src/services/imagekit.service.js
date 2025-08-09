var imageKit = require('imagekit')
const { v4: uuidv4 } = require('uuid');

let imagekit = new imageKit({
    publicKey:process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint:process.env.IMAGE_KIT_URL_ENDPOINT
});

const uploadImage = (file)=>{
    return new Promise ((resolve, reject)=>{

        imagekit.upload({
            file:file,
            fileName:uuidv4(),
            folder:generatedImages
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

module.exports = uploadImage;