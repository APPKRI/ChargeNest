const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const chargerRoutes = require("./routes/chargerRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/chargers", chargerRoutes);
app.use("/api/auth",authRoutes);

module.exports = app;