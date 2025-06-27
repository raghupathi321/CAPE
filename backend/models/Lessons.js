const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    grade: { type: Number, required: true },
    week: { type: Number, required: true },
    techLevel: { type: String, required: true, enum: ['low', 'medium', 'high'] },
    slidesLink: { type: String, required: true },
    description: String,
    duration: Number,
    tags: [String],
    difficulty: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
    status: { type: String, default: 'active' },
});

module.exports = mongoose.model('Lesson', lessonSchema);