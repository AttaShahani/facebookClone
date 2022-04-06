const router = require("express").Router();
const {
  createPost,
  updatePost,
  deletePost,
  likeUnlikePost,
  addUpdateComment,
  deleteComment,
  getFeedPosts,
  getMyPosts,
  getSinglePost,
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
router.route("/feedposts").get(isAuthenticatedUser,getFeedPosts)
router.route("/myposts").get(isAuthenticatedUser,getMyPosts)
router.route("/post/:id").get(isAuthenticatedUser,getSinglePost)
router.route("*").all((req,res)=>{
  res.status(404).json({
    success:false,
    message:"Sorry! Requested URL Not Found!"
  })
})
module.exports = router;
