const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const chargerRoutes = require("./routes/chargerRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/chargers", chargerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/contact", contactRoutes);

module.exports = app;
