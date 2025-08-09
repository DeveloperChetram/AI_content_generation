const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    aiCredits:{
        type: Number,
        default: 2
    },
      aiImageCredits:{
        type: Number,
        default: 2
    },
    posts:[{
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'posts'
        }
    }],
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    timestamps: true

    })

    const userModel = mongoose.model('users',userSchema)
    module.exports = userModel;