const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 3001;

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

const { searchSerp } = require('./serpService');

// --- API Endpoints ---

// SERP API Proxy
app.get('/api/search', async (req, res) => {
    const { q, type } = req.query; // type can be 'search', 'shopping', 'news'

    if (!q) {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    let engine = 'google';
    if (type === 'shopping') engine = 'google_shopping';
    if (type === 'news') engine = 'google_news';

    try {
        const data = await searchSerp(q, engine);
        res.json(data);
    } catch (err) {
        console.error('SERP API Error:', err);
        res.status(500).json({ error: 'Failed to fetch search results' });
    }
});


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
                const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
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

// Lists (Read)
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find().sort({ _id: -1 }).limit(100);
        res.json(users);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/sensors', async (req, res) => {
    try {
        const sensors = await Sensor.find().sort({ _id: -1 }).limit(100);
        res.json(sensors);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/measures', async (req, res) => {
    try {
        const query = {};
        if (req.query.sensorID) {
            query.$or = [
                { sensorID: req.query.sensorID },
                { 'sensorID.$oid': req.query.sensorID }
            ];
        }
        const measures = await Measure.find(query).sort({ _id: -1 }).limit(100);
        res.json(measures);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Create
app.post('/api/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.json(user);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.post('/api/sensors', async (req, res) => {
    try {
        const sensor = new Sensor(req.body);
        await sensor.save();
        res.json(sensor);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// Update
app.put('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(user);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.put('/api/sensors/:id', async (req, res) => {
    try {
        const sensor = await Sensor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(sensor);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// Delete
app.delete('/api/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.delete('/api/sensors/:id', async (req, res) => {
    try {
        await Sensor.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.post('/api/measures', async (req, res) => {
    try {
        const measure = new Measure(req.body);
        await measure.save();
        res.json(measure);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.put('/api/measures/:id', async (req, res) => {
    try {
        const measure = await Measure.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(measure);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.delete('/api/measures/:id', async (req, res) => {
    try {
        await Measure.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
});