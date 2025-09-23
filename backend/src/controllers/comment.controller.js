const commentModel = require('../models/comment.model')
const postModel = require('../models/post.model')
const userModel = require('../models/user.model')

const createCommentController = async (req, res) => {
    try {
        const { postId, content } = req.body
        const { _id } = req.user

        // Validate input
        if (!postId || !content || !content.trim()) {
            return res.status(400).json({ message: 'Post ID and comment content are required' })
        }

        // Check if post exists
        const post = await postModel.findById(postId)
        if (!post) {
            return res.status(404).json({ message: 'Post not found' })
        }

        // Get user details
        const user = await userModel.findById(_id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        // Create comment
        const comment = await commentModel.create({
            user: _id,
            post: postId,
            content: content.trim(),
            username: user.name || user.username,
            userProfilePicture: user.profilePicture || ''
        })

        // Update post comment count
        await postModel.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } }, { new: true })

        res.status(201).json({ 
            message: 'Comment created successfully', 
            comment 
        })
    } catch (error) {
        console.error('Error creating comment:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

const getCommentsByPostController = async (req, res) => {
    try {
        const { postId } = req.params

        if (!postId) {
            return res.status(400).json({ message: 'Post ID is required' })
        }

        // Check if post exists
        const post = await postModel.findById(postId)
        if (!post) {
            return res.status(404).json({ message: 'Post not found' })
        }

        // Get comments for the post
        const comments = await commentModel
            .find({ post: postId })
            .populate('user', 'name username profilePicture')
            .sort({ createdAt: -1 })

        res.status(200).json({ 
            message: 'Comments retrieved successfully', 
            comments 
        })
    } catch (error) {
        console.error('Error getting comments:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

const updateCommentController = async (req, res) => {
    try {
        const { commentId } = req.params
        const { content } = req.body
        const { _id } = req.user

        if (!content || !content.trim()) {
            return res.status(400).json({ message: 'Comment content is required' })
        }

        // Find comment and check ownership
        const comment = await commentModel.findById(commentId)
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' })
        }

        if (comment.user.toString() !== _id.toString()) {
            return res.status(403).json({ message: 'You can only edit your own comments' })
        }

        // Update comment
        const updatedComment = await commentModel.findByIdAndUpdate(
            commentId,
            { content: content.trim() },
            { new: true }
        ).populate('user', 'name username profilePicture')

        res.status(200).json({ 
            message: 'Comment updated successfully', 
            comment: updatedComment 
        })
    } catch (error) {
        console.error('Error updating comment:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

const deleteCommentController = async (req, res) => {
    try {
        const { commentId } = req.params
        const { _id } = req.user

        // Find comment and check ownership
        const comment = await commentModel.findById(commentId)
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' })
        }

        if (comment.user.toString() !== _id.toString()) {
            return res.status(403).json({ message: 'You can only delete your own comments' })
        }

        // Delete comment
        await commentModel.findByIdAndDelete(commentId)

        // Update post comment count
        await postModel.findByIdAndUpdate(comment.post, { $inc: { commentCount: -1 } }, { new: true })

        res.status(200).json({ message: 'Comment deleted successfully' })
    } catch (error) {
        console.error('Error deleting comment:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

module.exports = {
    createCommentController,
    getCommentsByPostController,
    updateCommentController,
    deleteCommentController
}
