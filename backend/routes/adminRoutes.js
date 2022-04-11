const router = require("express").Router();

const {
  getSingleUser,
  updateUserRole,
  deleteUserAccount,
  getAllUsers,
  getAllPosts,
  getOnePost,
  updatePost,
  deletePost,
  deleteComment,
} = require("../controllers/adminController");
const {
  isAuthenticatedUser,
  isAuthorizedRoles,
} = require("../middlewares/auth");

// For Users
router
  .route("/admin/users")
  .get(isAuthenticatedUser, isAuthorizedRoles("admin"), getAllUsers);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, isAuthorizedRoles("admin"), getSingleUser)
  .put(isAuthenticatedUser, isAuthorizedRoles("admin"), updateUserRole)
  .delete(isAuthenticatedUser, isAuthorizedRoles("admin"), deleteUserAccount);

// For Posts
router
  .route("/admin/posts")
  .get(isAuthenticatedUser, isAuthorizedRoles("admin"), getAllPosts);
router
  .route("/admin/post/:id")
  .get(isAuthenticatedUser, isAuthorizedRoles("admin"), getOnePost)
  .put(isAuthenticatedUser, isAuthorizedRoles("admin"), updatePost)
  .delete(isAuthenticatedUser, isAuthorizedRoles("admin"), deletePost);

router.route("/admin/post/:id/comment").delete(isAuthenticatedUser, isAuthorizedRoles("admin"),deleteComment)

module.exports = router