const express = require("express");
const { createContactMessage } = require("../controllers/contactController");

const router = express.Router();

router.post("/messages", createContactMessage);

module.exports = router;
