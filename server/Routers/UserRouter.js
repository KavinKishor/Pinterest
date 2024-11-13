const express = require("express");
const { createuser, loguser } = require("../Controllers/UserController");

const router = express.Router();

router.route("/register").post(createuser);
router.route("/login").post(loguser);
module.exports = router;
