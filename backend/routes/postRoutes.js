const router = require("express").Router()
const { createPost } = require("../controllers/postController");
const {isAuthenticatedUser} = require("../middlewares/auth")


router.route("/post/new").post(isAuthenticatedUser,createPost)

module.exports = router;