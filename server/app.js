const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Mongoose Models
const UserSchema = new mongoose.Schema({}, { strict: false });
const SensorSchema = new mongoose.Schema({}, { strict: false });
const MeasureSchema = new mongoose.Schema({}, { strict: false });

const User = mongoose.model('User', UserSchema);
const Sensor = mongoose.model('Sensor', SensorSchema);
const Measure = mongoose.model('Measure', MeasureSchema);

// --- API Endpoints ---

app.get('/', (req, res) => {
    res.send('P.E.IoT API is running with MongoDB!');
});

// Dashboard Stats Endpoint
app.get('/api/dashboard-stats', async (req, res) => {
    try {
        // Total counts
        const totalUsers = await User.countDocuments();
        const totalSensors = await Sensor.countDocuments();
        const totalMeasures = await Measure.countDocuments();

        // Sensor Types (based on Measure types as proxy)
        const measureTypes = await Measure.aggregate([
            { $group: { _id: "$type", count: { $sum: 1 } } }
        ]);

        const sensorTypeData = measureTypes.map(m => ({
            name: m._id ? (m._id.charAt(0).toUpperCase() + m._id.slice(1)) : 'Unknown',
            value: m.count
        }));

        // Sensors per Location
        const sensorsPerLocation = await Sensor.aggregate([
            { $group: { _id: "$location", count: { $sum: 1 } } }
        ]);

        const locationData = sensorsPerLocation.map(s => ({
            name: s._id ? (s._id.charAt(0).toUpperCase() + s._id.slice(1)) : 'Unknown',
            value: s.count
        }));

        // Sensor Creation History (by month)
        const sensors = await Sensor.find({}, 'creationDate').lean();
        const monthCounts = {};

        sensors.forEach(sensor => {
            if (sensor.creationDate) {
                try {
                    // Parse MM/DD/YYYY format
                    const [month, day, year] = sensor.creationDate.split('/');
                    const date = new Date(year, parseInt(month) - 1, day);
                    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
                } catch (e) {
                    // Skip invalid dates
                }
            }
        });

        // Convert to array and sort by date
        const creationHistory = Object.keys(monthCounts)
            .sort()
            .map(monthKey => {
                const [year, month] = monthKey.split('-');
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return {
                    name: `${monthNames[parseInt(month) - 1]} ${year}`,
                    sensors: monthCounts[monthKey]
                };
            });

        // Active Countries (from Users)
        const activeCountries = await User.distinct('location');

        res.json({
            totalSensors,
            totalUsers,
            totalMeasures,
            sensorTypeData,
            locationData,
            creationHistory,
            activeCountries: activeCountries.filter(c => c) // Remove null/undefined
        });
    } catch (err) {
        console.error('Dashboard stats error:', err);
        res.status(500).json({ error: err.message });
    }
});

// System Status (Mock)
app.get('/api/system-status', (req, res) => {
    res.json({
        alerts: 0,
        status: 'Optimal',
        updatedAt: new Date()
    });
});

// Lists
app.get('/api/users', async (req, res) => {
    const users = await User.find().limit(50);
    res.json(users);
});

app.get('/api/sensors', async (req, res) => {
    const sensors = await Sensor.find().limit(50);
    res.json(sensors);
});

app.get('/api/measures', async (req, res) => {
    const measures = await Measure.find().limit(50);
    res.json(measures);
});

app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
});