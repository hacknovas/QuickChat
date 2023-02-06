const express = require("express");
const router = express.Router();
const { registerUser, authuser, allUsers } = require("../controller/userController");
const { protect } = require("../middleware/authMiddleware");


router.route("/").get(protect, allUsers);
router.route("/").post(registerUser);
router.post("/login", authuser);

module.exports = router;