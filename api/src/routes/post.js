const { commentPost, deleteComment } = require('../controllers/comment')
const { createPost, deletePost, updatePost, likePost, fetchAllPosts } = require('../controllers/post')
const verify = require('../middlewares/valid')
const router = require('express').Router()
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        cb(null, 'Post' + Date.now() + file.originalname)
    }
})

const upload = multer({ storage: storage })


router.post("/create", upload.single('postImg'), createPost)
router.delete("/delete/:id", deletePost)
router.patch("/update/:id", updatePost)
router.get("/like/:id", likePost)
router.get('/fetch', fetchAllPosts)

// comments (comment.js)
router.route('/comment/:id').post(commentPost).delete(deleteComment)


module.exports = router