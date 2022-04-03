const router = require("express").Router();
const { userRegister, userLogin, userLogout, updateProfile, updatePassword } = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middlewares/auth");

router.route("/register").post(userRegister)
router.route("/login").post(userLogin)
router.route("/logout").get(userLogout)
router.route("/profile/update").put(isAuthenticatedUser,updateProfile)
router.route("/password/update").put(isAuthenticatedUser,updatePassword)
module.exports = router;
