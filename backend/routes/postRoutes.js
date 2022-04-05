const router = require("express").Router();
const {
  createPost,
  updatePost,
  deletePost,
  likeUnlikePost,
} = require("../controllers/postController");
const { isAuthenticatedUser } = require("../middlewares/auth");

router.route("/post/new").post(isAuthenticatedUser, createPost);
router
  .route("/post/:id")
  .put(isAuthenticatedUser, updatePost)
  .delete(isAuthenticatedUser, deletePost)
  .post(isAuthenticatedUser, likeUnlikePost);

module.exports = router;
