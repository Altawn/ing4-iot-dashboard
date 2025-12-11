const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// MongoDB Connection URI
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');
        importData();
    })
    .catch(err => console.log(err));

// Define Simple Schemas (Flexible to match JSON)
const UserSchema = new mongoose.Schema({}, { strict: false });
const SensorSchema = new mongoose.Schema({}, { strict: false });
const MeasureSchema = new mongoose.Schema({}, { strict: false });

const User = mongoose.model('User', UserSchema);
const Sensor = mongoose.model('Sensor', SensorSchema);
const Measure = mongoose.model('Measure', MeasureSchema);

// Import Data Function
const importData = async () => {
    try {
        // Read JSON files
        // Note: Adjusting path to point to rules/resources
        const usersPath = path.join(__dirname, '../rules/resources/User.json');
        const sensorsPath = path.join(__dirname, '../rules/resources/Sensor.json');
        const measuresPath = path.join(__dirname, '../rules/resources/Measure.json');

        const cleanData = (data) => {
            return data.map(item => {
                const newItem = { ...item };
                if (newItem._id && newItem._id.$oid) {
                    newItem._id = newItem._id.$oid;
                }
                // Handle potential dates if formatted as $date
                // Add other transformations if needed
                return newItem;
            });
        };

        const users = cleanData(JSON.parse(fs.readFileSync(usersPath, 'utf-8')));
        const sensors = cleanData(JSON.parse(fs.readFileSync(sensorsPath, 'utf-8')));
        const measures = cleanData(JSON.parse(fs.readFileSync(measuresPath, 'utf-8')));

        // Clear existing data
        await User.deleteMany();
        await Sensor.deleteMany();
        await Measure.deleteMany();

        console.log('Data Cleared...');

        // Insert new data
        await User.insertMany(users);
        await Sensor.insertMany(sensors);
        await Measure.insertMany(measures);

        console.log('Data Imported Successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};


