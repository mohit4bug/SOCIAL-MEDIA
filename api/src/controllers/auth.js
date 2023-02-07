const userModel = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const register = async (req, res) => {

    try {
        const { password, confirmPassword, username } = req.body


        if (!password || !confirmPassword || !username) return res.status(403).json({
            message: 'Please provide all necessary information',
            success: false
        })
        if (password !== confirmPassword) return res.status(403).json({
            message: 'Password not match',
            success: false
        })

        const isUser = await userModel.findOne({ username: username })
        if (isUser) {
            return res.status(400).json({
                message: 'User already exists',
                success: false
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const newUser = await userModel.create({
            username,
            password: hash,
        })
        await newUser.save()

        return res.status(200).json({
            message: 'User created successfully',
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }

}
const login = async (req, res) => {

    try {

        const { username, password } = req.body
        if (!username || !password) return res.status(403).json({
            message: 'Please provide userId and password',
            success: false
        })
        const isUser = await userModel.findOne({ username: username })
        if (!isUser) return res.status(403).json({
            message: 'User does not exist',
            success: false
        })
        const isMatch = await bcrypt.compare(password, isUser.password)
        if (!isMatch) return res.status(403).json({
            message: 'Invalid password',
            success: false
        })
        const token = jwt.sign({
            id: isUser._id, username: isUser.username
        }, "JWTSECRET", {
            expiresIn: "3d"
        })
        return res.status(200).cookie('Authorization', token).json({
            message: 'User logged in successfully',
            success: true,
            user: isUser
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}


const logout = (req, res) => {
    try {
        res.clearCookie("Authorization", {
            httpOnly: true,
            secure: true,
            sameSite: true,
        }).json({
            message: 'User logged out successfully',
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


module.exports = {
    register,
    login,
    logout
}