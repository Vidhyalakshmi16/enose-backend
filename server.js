require('dotenv').config(); const express = require('express'); const mongoose = require('mongoose'); const cors = require('cors'); const bodyParser = require('body-parser');

const app = express(); const PORT = process.env.PORT || 5000; const MONGO_URI = process.env.MONGO_URI;

// ✅ Middleware app.use(cors()); app.use(bodyParser.json()); // Ensure proper JSON parsing app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Connect to MongoDB mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }) .then(() => console.log("✅ MongoDB Connected")) .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Sensor Data Schema const SensorDataSchema = new mongoose.Schema({ sensorValue: { type: Number, required: true }, timestamp: { type: Date, default: Date.now }, }); const SensorData = mongoose.model('SensorData', SensorDataSchema);

// ✅ Receive Sensor Data & Store in MongoDB app.post('/api/sensor-data', async (req, res) => { console.log("[DEBUG] Received request:", req.body);

let sensorValue;
try {
    if (typeof req.body === 'string') {
        req.body = JSON.parse(req.body);
    }
    sensorValue = parseFloat(req.body.sensorValue);
    if (isNaN(sensorValue)) throw new Error('Invalid sensor value');
} catch (error) {
    return res.status(400).json({ message: 'Invalid JSON or missing sensor value' });
}

console.log('[INFO] Sensor Value Received:', sensorValue);
await new SensorData({ sensorValue }).save();
res.json({ message: 'Data received and stored' });

});

// ✅ Get Latest Sensor Data app.get('/api/sensor-data', async (req, res) => { try { const data = await SensorData.find().sort({ timestamp: -1 }).limit(10); res.json({ success: true, data }); } catch (error) { console.error("❌ Error fetching sensor data:", error); res.status(500).json({ message: 'Server error' }); } });

// ✅ Handle HTTP Requests by Redirecting to HTTPS app.use((req, res, next) => { if (req.headers['x-forwarded-proto'] !== 'https') { return res.redirect(https://${req.headers.host}${req.url}); } next(); });

// ✅ Start Server app.listen(PORT, () => console.log(🚀 Server running on port ${PORT}));