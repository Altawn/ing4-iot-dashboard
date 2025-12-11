const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to DB');
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        const Sensor = mongoose.model('Sensor', new mongoose.Schema({}, { strict: false }));
        const Measure = mongoose.model('Measure', new mongoose.Schema({}, { strict: false }));

        const users = await User.countDocuments();
        const sensors = await Sensor.countDocuments();
        const measures = await Measure.countDocuments();

        console.log(`Users: ${users}`);
        console.log(`Sensors: ${sensors}`);
        console.log(`Measures: ${measures}`);
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
