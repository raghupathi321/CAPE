const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
    linkId: { type: String, required: true },
    schoolId: { type: String, required: true },
    grade: { type: Number, required: true },
    week: { type: Number, required: true },
    techLevel: { type: String, required: true },
    deviceType: { type: String, required: true },
    ipAddress: String,
    userAgent: String,
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Click', clickSchema);