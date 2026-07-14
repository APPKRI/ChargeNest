const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
    getChargers,
    createCharger,
    routeSearch,
    updateCharger,
    deleteCharger
} = require("../controllers/chargerController");

// Get all chargers
router.get("/", getChargers);

// Create charger
router.post("/", auth, createCharger);

// Find chargers along route
router.post("/route-search", routeSearch);

// Update charger details
router.put("/:id", auth, updateCharger);

// Delete charger
router.delete("/:id", auth, deleteCharger);

module.exports = router;