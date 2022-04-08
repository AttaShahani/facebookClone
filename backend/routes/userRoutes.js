const router = require("express").Router();
const { userRegister, userLogin, userLogout, updateProfile, updatePassword, followUnfollowUsers, getAllFollowers, getAllFollowings, MyProfile, myProfile, deleteAccount } = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middlewares/auth");

// Public Routes
router.route("/register").post(userRegister)
router.route("/login").post(userLogin)
router.route("/logout").get(userLogout)

// Private Routes
router.route("/profile").get(isAuthenticatedUser,myProfile)
router.route("/profile/update").put(isAuthenticatedUser,updateProfile)
router.route("/password/update").put(isAuthenticatedUser,updatePassword)
router.route("/follow/:id").put(isAuthenticatedUser,followUnfollowUsers)
router.route("/followers").get(isAuthenticatedUser,getAllFollowers)
router.route("/followings").get(isAuthenticatedUser,getAllFollowings)
router.route("/profile/delete").delete(isAuthenticatedUser,deleteAccount)
module.exports = router;
