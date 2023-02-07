const { followUser, findUsers, EditBio, fetchUser, saveProfile, saveCoverPicture } = require('../controllers/user')
const multer = require('multer')
const router = require('express').Router()




router.get('/follow/:id', followUser)
router.get('/fetchall', findUsers)
router.post('/bio', EditBio)
router.get('/fetch/:id', fetchUser)


// For profile picture upload
const storageProfile = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        cb(null, 'Profile' + req.user.id + '.' + file.mimetype.split('/')[1])
    }
})
const uploadProfile = multer({ storage: storageProfile })

// For cover picture upload
const storageCover = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        cb(null, 'Cover' + req.user.id + '.' + file.mimetype.split('/')[1])
    }
})

const uploadCover = multer({ storage: storageCover })



// profile picture config
router.post('/profilepicture', uploadProfile.single('avatar'), saveProfile)


// profile picture config
router.post('/coverpicture', uploadCover.single('cover'), saveCoverPicture)

module.exports = router