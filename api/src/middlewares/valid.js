const jwt = require('jsonwebtoken')
const verify = (req, res, next) => {
    try {
        const token = req.cookies.Authorization
        if (!token) return res.status(403).json({
            message: 'No token provided',
            success: false
        })
        const isValidUser = jwt.verify(token, "JWTSECRET")
        if (!isValidUser) return res.status(403).json({
            message: 'Invalid token',
            success: false
        })
        req.user = isValidUser
        next()
    }
    catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}


module.exports = verify