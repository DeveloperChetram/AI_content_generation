const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true
    },
    userProfilePicture: {
        type: String,
        default: ''
    }
}, { timestamps: true })

const commentModel = mongoose.model('comments', commentSchema)

module.exports = commentModel
