const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// ✅ Middleware
app.use(express.json());
app.use(cors());

// ✅ MongoDB Connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Sensor Data Schema
const SensorDataSchema = new mongoose.Schema({
    sensorValue: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
});
const SensorData = mongoose.model("SensorData", SensorDataSchema);

// ✅ Receive Sensor Data
app.post("/api/sensor-data", async (req, res) => {
    const { sensorValue } = req.body;
    if (sensorValue === undefined) return res.status(400).json({ message: "Sensor value is required" });

    console.log("[INFO] Sensor Value Received:", sensorValue);
    await new SensorData({ sensorValue }).save();

    res.json({ message: "Data received and stored" });
});

// ✅ Fetch Stored Sensor Data
app.get("/api/sensor-data", async (req, res) => {
    try {
        const data = await SensorData.find().sort({ timestamp: -1 })
        res.json({ data });
    } catch (error) {
        console.error("❌ Error fetching sensor data:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Middleware to Redirect HTTP to HTTPS (But Allow HTTP for SIM800L)
app.use((req, res, next) => {
    if (req.headers["x-forwarded-proto"] !== "https" && req.method === "POST") {
        console.log("Received HTTP request, allowing it...");
        return next();  // Allow HTTP requests from SIM800L
    }
    if (req.headers["x-forwarded-proto"] !== "https") {
        return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
});


// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
