const userModel = require('../models/user.js')

const followUser = async (req, res) => {

    try {
        const whichToFollow = req.params.id
        const whoWantsToFollow = req.user.id

        const whichToFollowUser = await userModel.findOne({ _id: whichToFollow })
        const whoWantsToFollowUser = await userModel.findOne({ _id: whoWantsToFollow })

        if (whichToFollowUser.followers.includes(whoWantsToFollow)) {
            const removeIndex = whichToFollowUser.followers.indexOf(whoWantsToFollow)
            whichToFollowUser.followers.pop(removeIndex)
            await whichToFollowUser.save()

            const removeIndex2 = whoWantsToFollowUser.following.indexOf(whichToFollow)
            whoWantsToFollowUser.following.pop(removeIndex2)
            await whoWantsToFollowUser.save()

            return res.status(200).json({
                message: 'User unfollowed successfully',
                success: true
            })
        }

        whichToFollowUser.followers.push(whoWantsToFollow)
        await whichToFollowUser.save()
        whoWantsToFollowUser.following.push(whichToFollow)
        await whoWantsToFollowUser.save()

        return res.status(200).json({
            message: 'User followed successfully',
            success: true
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }


}

const findUsers = async (req, res) => {
    try {
        const username = req.body.username
        const users = await userModel.find({
            username: {
                $regex: `(?i)${username}`,
            }
        })

        if (username.length < 1) return res.json({ message: 'No users found', success: true })
        return res.status(200).json({
            users,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

const EditBio = async (req, res) => {
    try {
        const bio = req.body.bio

        if (bio.length < 3) {
            return res.status(400).json({
                message: 'Bio should be atleast 3 characters',
                success: false
            })
        }

        const user = await userModel.findById(req.user.id)
        user.bio = bio
        await user.save()
        return res.status(200).json({
            message: 'Bio updated successfully',
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

const fetchUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(400).json({
                message: 'User id is required',
                success: false
            })
        }
        const user = await userModel.findById(userId).populate('posts').select('-password')

        return res.status(200).json({
            message: 'User fetched successfully',
            success: true,
            user: user
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

const saveProfile = async (req, res) => {
    // Logic

    try {
        const avatar = req.file?.filename
        const userId = req.user.id


        if (!avatar) {
            return res.status(400).json({
                message: 'Profile picture is required',
                success: false
            })
        }

        const User = await userModel.findById(userId)
        User.avatar = avatar
        await User.save()
        return res.status(200).json({
            message: 'Profile updated successfully',
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }

}

const saveCoverPicture = async (req, res) => {
    // Logic
    try {
        const cover = req.file?.filename
        const userId = req.user.id

        if (!cover) {
            return res.status(400).json({
                message: 'Cover picture is required',
                success: false
            })
        }

        const User = await userModel.findById(userId)
        User.cover = cover
        await User.save()

        return res.status(200).json({
            message: 'Cover picture saved successfully',
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }

}


module.exports = {
    followUser,
    findUsers,
    EditBio,
    fetchUser,
    saveProfile,
    saveCoverPicture
}