const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
    createBooking,
    getBookings,
    updateBookingStatus,
    addReview,
    getHostAnalytics
} = require("../controllers/bookingController");

router.post("/", auth, createBooking);
router.get("/", auth, getBookings);
router.get("/analytics", auth, getHostAnalytics);
router.put("/:id", auth, updateBookingStatus);
router.post("/:id/review", auth, addReview);

module.exports = router;
