const express = require("express");

const router = express.Router();

const {
    routeSearch
} = require("../controllers/chargerController");


router.get(
"/route-search",
routeSearch
);

module.exports = router;