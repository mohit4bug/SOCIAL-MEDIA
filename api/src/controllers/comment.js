const commentModel = require('../models/comment')
const postModel = require('../models/post')
const userModel = require('../models/user')

const commentPost = async (req, res) => {

    try {
        const { content } = req.body

        const userId = await userModel.findById(req.user.id)

        if (!content) return res.status(400).json({
            message: 'Content is required',
            success: false
        })
        const postId = req.params.id
        const newComment = {
            content,
            postId,
            userId,
        }
        const comment = await commentModel.create(newComment)
        const savedComment = await comment.save()
        const post = await postModel.findOne({ _id: postId })
        post.comments.push(savedComment._id)
        await post.save()

        return res.status(201).json({
            message: 'Comment created',
            success: true
        })
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }

}


const deleteComment = async (req, res) => {
}


module.exports = {
    commentPost,
    deleteComment
}