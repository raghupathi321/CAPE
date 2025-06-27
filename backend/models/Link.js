const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    schoolId: { type: String, required: true },
    grade: { type: Number, required: true },
    week: { type: Number, required: true },
    techLevel: { type: String, required: true, enum: ['low', 'medium', 'high'] },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Link', linkSchema);