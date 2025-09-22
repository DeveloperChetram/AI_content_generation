const likeModel = require('../models/like.model')
const postModel = require('../models/post.model')
const userModel = require('../models/user.model')

const likePostController = async (req, res) => {
    const { postId } = req.body
    const { _id } = req.user
    const post = await postModel.findById(postId)
    if(!post){
        return res.status(404).json({ message: 'Post not found' })
    }
    const user = await userModel.findById(_id)
    if(!user){
        return res.status(404).json({ message: 'User not found' })
    }
    const existingLike = await likeModel.findOne({ user: _id, post: post._id })
    if(existingLike){
        await likeModel.findByIdAndDelete(existingLike._id)
      const updatedPost = await postModel.findByIdAndUpdate(postId, { $inc: { likeCount: -1 } }, { new: true });
    return res.status(200).json({ message: 'Post unliked successfully', updatedPost })
    }
    const like = await likeModel.create({ user: _id, post: post._id })
    const updatedPost = await postModel.findByIdAndUpdate(postId, { $inc: { likeCount: 1 } }, { new: true });
    res.status(200).json({ message: 'Post liked successfully', like, updatedPost })
}

module.exports = { likePostController }