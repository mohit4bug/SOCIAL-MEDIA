const postModel = require('../models/post')
const userModel = require('../models/user')

const createPost = async (req, res) => {
    try {
        const postImg = req.file?.filename
        const { caption } = req.body
        if (!caption) return res.status(404).json({
            message: 'Caption is required',
            status: false
        })
        //creating post
        const newPost = await postModel.create({
            caption,
            postImg,
            userId: req.user.id,
        })

        //finding user
        const user = await userModel.findById(req.user.id)
        if (!user) return res.status(404).json({
            message: 'Please login to make a new post',
            status: false
        })

        const savedPost = await newPost.save()
        const id = savedPost._id
        user.posts.push(id)
        await user.save()

        return res.status(201).json({
            message: 'Post created successfully',
            status: true,
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            status: false
        })
    }
}
const deletePost = async (req, res) => {

    try {
        const postId = req.params.id
        const userId = req.user.id

        // finding user
        const user = await userModel.findOne({ _id: userId })


        //checking if post id exists in user model

        if (user.posts.includes(postId)) {
            //removing post from posts array of user
            const deleteIndex = user.posts.indexOf(postId)
            user.posts.pop(deleteIndex)
            await user.save()


            // finding post
            const post = await postModel.findById(postId)

            // if no post found return error
            if (!post) return res.status(404).json({
                message: 'Post not found',
                status: false
            })

            // deleting post form postModel
            await postModel.deleteOne({ _id: postId })

            return res.status(200).json({
                message: 'Post deleted successfully',
                status: true,
            })
        }
        else {
            return res.status(404).json({
                message: 'post not found',
                status: false
            })
        }



    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
            status: false
        })
    }

}
const updatePost = async (req, res) => {
    try {
        const postId = req.params.id
        const userId = req.user.id

        const user = await userModel.findOne({ _id: userId })
        if (!user) return res.status(404).json({
            message: 'User not valid',
            status: false
        })
        //checking if post id exists in user model
        if (user.posts.includes(postId)) {
            const post = await postModel.findById(postId)
            if (!post) return res.status(404).json({
                message: 'Post not found',
                status: false
            })
            await postModel.updateOne({ _id: postId }, {
                $set: {
                    caption: req.body.caption,
                }
            })
            return res.status(200).json({
                message: 'Post updated successfully',
                status: true,
            })
        }
        else {
            return res.status(404).json({
                message: 'post not found',
                status: false
            })
        }

    } catch (error) {

        return res.status(500).json({
            message: error.message,
            status: false
        })
    }
}
const likePost = async (req, res) => {

    try {

        const post = await postModel.findOne({ _id: req.params.id })
        const userId = req.user.id

        //checking if userid exists in post 
        if (post.likes.includes(userId)) {
            const likeIndex = post.likes.indexOf(userId)
            post.likes.splice(likeIndex, 1)
            await post.save()
            return res.status(200).json({
                message: 'Post unliked successfully',
                status: true,
            })
        }
        else {
            post.likes.push(userId)
            await post.save()
            return res.status(200).json({
                message: 'Post liked successfully',
                status: true,
            })
        }

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }

}

const fetchAllPosts = async (req, res) => {

    try {
        const user = await userModel.findById(req.user.id)

        const posts = await postModel.find({
            user: {
                $in: [...user.following, req.user.id]
            }
        }).populate({
            path: 'comments',
            populate: {
                path: 'userId'
            }
        }).populate('userId')

        return res.status(200).json({
            message: 'Posts fetched successfully',
            success: true,
            posts: posts.reverse()
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}




module.exports = {
    createPost,
    deletePost,
    updatePost,
    likePost,
    fetchAllPosts
}