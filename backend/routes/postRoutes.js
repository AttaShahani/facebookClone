const router = require("express").Router();
const {
  createPost,
  updatePost,
  deletePost,
  likeUnlikePost,
  addUpdateComment,
  deleteComment,
} = require("../controllers/postController");
const { isAuthenticatedUser } = require("../middlewares/auth");

router.route("/post/new").post(isAuthenticatedUser, createPost);
router
  .route("/post/:id")
  .put(isAuthenticatedUser, updatePost)
  .delete(isAuthenticatedUser, deletePost)
  .post(isAuthenticatedUser, likeUnlikePost);
router.route("/post/:id/comment").post(isAuthenticatedUser,addUpdateComment)
router.route("/post/:id/comment/delete").delete(isAuthenticatedUser,deleteComment)
module.exports = router;
