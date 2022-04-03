const router = require("express").Router();
const { userRegister, userLogin, userLogout } = require("../controllers/userController");

router.route("/register").post(userRegister)
router.route("/login").post(userLogin)
router.route("/logout").get(userLogout)

module.exports = router;
