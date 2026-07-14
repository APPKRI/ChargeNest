const Booking = require("../models/Booking");
const Charger = require("../models/Charger");
const User = require("../models/User");

exports.createBooking = async (req, res) => {
    try {
        const { driverId, chargerId, date, time, energyKwh = 45 } = req.body;

        const user = await User.findById(driverId);
        const charger = await Charger.findById(chargerId);

        if (!user) {
            return res.status(404).json({ message: "Driver not found" });
        }
        if (!charger) {
            return res.status(404).json({ message: "Charger not found" });
        }

        if (!date || !time) {
            return res.status(400).json({ message: "Booking date and time are required" });
        }

        if (charger.status === "Maintenance" || charger.status === "Not Available") {
            return res.status(400).json({ message: "This charger is not available for booking" });
        }

        const existingBooking = await Booking.findOne({
            chargerId,
            date,
            time,
            status: { $in: ["Pending", "Confirmed"] }
        });

        if (existingBooking) {
            return res.status(409).json({ message: "This charging slot already has an active request" });
        }

        const price = charger.price;
        const totalAmount = price * Number(energyKwh || 45);
        const status = charger.hostId ? "Pending" : "Confirmed";

        if (status === "Confirmed") {
            if (user.balance < totalAmount) {
                return res.status(400).json({
                    message: `Insufficient balance (₹${user.balance.toFixed(2)}). Estimated cost is ₹${totalAmount.toFixed(2)}. Please recharge your wallet.`
                });
            }

            user.balance -= totalAmount;
            await user.save();
            await Charger.findByIdAndUpdate(chargerId, { status: "Booked" });
        }

        const booking = await Booking.create({
            driverId,
            chargerId,
            hostId: charger.hostId,
            date,
            time,
            price,
            energyKwh: Number(energyKwh || 45),
            totalAmount,
            status
        });
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBookings = async (req, res) => {
    try {
        let query = {};
        if (req.query.driverId) {
            query.driverId = req.query.driverId;
            const bookings = await Booking.find(query)
                .populate("chargerId")
                .populate("driverId", "name email balance")
                .populate("hostId", "name email");
            return res.json(bookings);
        } else if (req.query.hostId) {
            const bookings = await Booking.find({ hostId: req.query.hostId })
                .populate("chargerId")
                .populate("driverId", "name email balance")
                .populate("hostId", "name email");
            return res.json(bookings);
        } else {
            const bookings = await Booking.find()
                .populate("chargerId")
                .populate("driverId", "name email balance")
                .populate("hostId", "name email");
            return res.json(bookings);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const booking = await Booking.findById(id).populate("chargerId");
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const allowedStatuses = ["Pending", "Confirmed", "Completed", "Cancelled"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid booking status" });
        }

        const oldStatus = booking.status;
        const requesterId = req.user.id;

        if (oldStatus === "Completed" && status !== "Completed") {
            return res.status(400).json({ message: "Completed bookings cannot be reopened" });
        }

        if (oldStatus === "Cancelled" && status !== "Cancelled") {
            return res.status(400).json({ message: "Cancelled bookings cannot be reopened" });
        }

        if (status === "Completed" && oldStatus !== "Confirmed") {
            return res.status(400).json({ message: "Only confirmed bookings can be completed" });
        }

        if (
            ["Confirmed", "Completed"].includes(status) &&
            booking.hostId &&
            requesterId !== booking.hostId.toString()
        ) {
            return res.status(403).json({ message: "Only the host can confirm or complete this booking" });
        }

        if (
            status === "Cancelled" &&
            requesterId !== booking.driverId.toString() &&
            booking.hostId &&
            requesterId !== booking.hostId.toString()
        ) {
            return res.status(403).json({ message: "Only the driver or host can cancel this booking" });
        }

        if (status === "Confirmed" && oldStatus !== "Confirmed") {
            const user = await User.findById(booking.driverId);
            if (!user) {
                return res.status(404).json({ message: "Driver not found" });
            }

            if (user.balance < booking.totalAmount) {
                return res.status(400).json({
                    message: `Insufficient driver balance. Required ₹${booking.totalAmount.toFixed(2)}, available ₹${user.balance.toFixed(2)}.`
                });
            }

            user.balance -= booking.totalAmount;
            await user.save();
            await Charger.findByIdAndUpdate(booking.chargerId._id, { status: "Booked" });
        }

        booking.status = status;
        await booking.save();

        if (status === "Cancelled" && oldStatus === "Confirmed") {
            const user = await User.findById(booking.driverId);
            if (user) {
                user.balance += booking.totalAmount;
                await user.save();
            }
            await releaseChargerIfNoActiveBookings(booking.chargerId._id);
        }

        if (status === "Completed" && oldStatus === "Confirmed") {
            if (booking.chargerId && booking.chargerId.hostId) {
                const host = await User.findById(booking.chargerId.hostId);
                if (host) {
                    host.balance = (host.balance || 0) + booking.totalAmount;
                    await host.save();
                }
            }
            await releaseChargerIfNoActiveBookings(booking.chargerId._id);
        }

        const updatedBooking = await Booking.findById(id)
            .populate("chargerId")
            .populate("driverId", "name email balance")
            .populate("hostId", "name email");

        res.json(updatedBooking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, feedback } = req.body;

        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.status !== "Completed") {
            return res.status(400).json({ message: "Only completed bookings can be reviewed" });
        }

        if (booking.review?.rating) {
            return res.status(400).json({ message: "This booking has already been reviewed" });
        }

        if (req.user.id !== booking.driverId.toString()) {
            return res.status(403).json({ message: "Only the driver who completed the booking can review it" });
        }

        const numericRating = Number(rating);
        if (!numericRating || numericRating < 1 || numericRating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        booking.review = {
            rating: numericRating,
            feedback,
            createdAt: new Date()
        };
        await booking.save();

        const charger = await Charger.findById(booking.chargerId);
        charger.reviews.push({
            bookingId: booking._id,
            driverId: booking.driverId,
            rating: numericRating,
            feedback
        });
        charger.reviewCount = charger.reviews.length;
        charger.rating = Number(
            (
                charger.reviews.reduce((sum, review) => sum + review.rating, 0) /
                charger.reviewCount
            ).toFixed(1)
        );
        await charger.save();

        const updatedBooking = await Booking.findById(id)
            .populate("chargerId")
            .populate("driverId", "name email balance")
            .populate("hostId", "name email");

        res.json(updatedBooking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getHostAnalytics = async (req, res) => {
    try {
        const { hostId } = req.query;
        if (!hostId) {
            return res.status(400).json({ message: "hostId is required" });
        }

        const chargers = await Charger.find({ hostId });
        const bookings = await Booking.find({ hostId }).populate("chargerId");
        const completed = bookings.filter((booking) => booking.status === "Completed");
        const totalEarnings = completed.reduce((sum, booking) => sum + booking.totalAmount, 0);
        const energyShared = completed.reduce((sum, booking) => sum + booking.energyKwh, 0);
        const ratedChargers = chargers.filter((charger) => charger.reviewCount > 0);
        const averageRating = ratedChargers.length
            ? ratedChargers.reduce((sum, charger) => sum + charger.rating, 0) / ratedChargers.length
            : 0;

        const monthlyRevenue = completed.reduce((items, booking) => {
            const key = new Date(booking.updatedAt).toLocaleString("en-IN", {
                month: "short",
                year: "numeric"
            });
            items[key] = (items[key] || 0) + booking.totalAmount;
            return items;
        }, {});

        const peakHours = bookings.reduce((items, booking) => {
            items[booking.time] = (items[booking.time] || 0) + 1;
            return items;
        }, {});

        res.json({
            totalEarnings,
            totalBookings: bookings.length,
            energyShared,
            averageRating: Number(averageRating.toFixed(1)),
            monthlyRevenue: Object.entries(monthlyRevenue).map(([month, amount]) => ({
                month,
                amount
            })),
            peakHours: Object.entries(peakHours).map(([slot, count]) => ({
                slot,
                count
            }))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

async function releaseChargerIfNoActiveBookings(chargerId) {
    const activeCount = await Booking.countDocuments({
        chargerId,
        status: { $in: ["Pending", "Confirmed"] }
    });

    if (activeCount === 0) {
        await Charger.findByIdAndUpdate(chargerId, { status: "Available" });
    }
}
