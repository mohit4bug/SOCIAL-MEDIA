const { register, login, logout } = require('../controllers/auth')
const verify = require('../middlewares/valid')

const router = require('express').Router()

router.post('/register', register)
router.post('/login', login)
router.get('/logout', verify, logout)

module.exports = router