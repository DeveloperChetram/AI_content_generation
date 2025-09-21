const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: String,
    type: String,
   postBody:{
    content:{
        type:String
    },
    prompt:{
        type:String
        
    },
    image:{
        prompt:String,
        url:String   
    },

   },
    isPosted: {
        type: Boolean,
        default: true
    },
    likeCount:{
        type:Number,
        default:0
    },
    username: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },


    
    
},{    timestamps: true})

const postModel = mongoose.model('posts' , postSchema)

module.exports = postModel;