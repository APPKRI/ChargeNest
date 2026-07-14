const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
    register,
    login,
    getProfile,
    rechargeWallet
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/profile/:id", auth, getProfile);
router.post("/wallet/recharge", auth, rechargeWallet);

module.exports = router;