const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const UAParser = require('ua-parser-js');
const Lesson = require('./models/Lessons');
const Link = require('./models/Link');
const Click = require('./models/Click');
const School = require('./models/School');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Analytics', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// API to add or update a school
app.post('/api/schools', async (req, res) => {
    const { id, name, city, state, board } = req.body;
    if (!id || !name || !city || !state || !board) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const updatedSchool = await School.findOneAndUpdate(
            { id },
            { id, name, city, state, board, updatedAt: new Date() },
            { upsert: true, new: true }
        );
        console.log('Saved school:', updatedSchool);
        res.status(201).json({ message: 'School saved', school: updatedSchool });
    } catch (err) {
        console.error('Error saving school:', err);
        res.status(500).json({ error: `Failed to save school: ${err.message}` });
    }
});

// API to get all schools
app.get('/api/schools', async (req, res) => {
    try {
        const schools = await School.find();
        console.log('Fetched schools:', schools);
        res.json(schools);
    } catch (err) {
        console.error('Error fetching schools:', err);
        res.status(500).json({ error: `Failed to fetch schools: ${err.message}` });
    }
});

// NEW: API to get a single school by ID
app.get('/api/schools/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const school = await School.findOne({ id });
        if (!school) {
            return res.status(404).json({ error: 'School not found' });
        }
        console.log('Fetched school:', school);
        res.json(school);
    } catch (err) {
        console.error('Error fetching school:', err);
        res.status(500).json({ error: `Failed to fetch school: ${err.message}` });
    }
});

// API to update a school
app.put('/api/schools/:id', async (req, res) => {
    const { id } = req.params;
    const { name, city, state, board } = req.body;
    if (!name || !city || !state || !board) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const updatedSchool = await School.findOneAndUpdate(
            { id },
            { name, city, state, board, updatedAt: new Date() },
            { new: true }
        );
        if (!updatedSchool) {
            return res.status(404).json({ error: 'School not found' });
        }
        console.log('Updated school:', updatedSchool);
        res.json({ message: 'School updated', school: updatedSchool });
    } catch (err) {
        console.error('Error updating school:', err);
        res.status(500).json({ error: `Failed to update school: ${err.message}` });
    }
});

// API to delete a school
app.delete('/api/schools/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedSchool = await School.findOneAndDelete({ id });
        if (!deletedSchool) {
            return res.status(404).json({ error: 'School not found' });
        }
        console.log('Deleted school:', deletedSchool);
        res.json({ message: 'School deleted' });
    } catch (err) {
        console.error('Error deleting school:', err);
        res.status(500).json({ error: `Failed to delete school: ${err.message}` });
    }
});

// API to add or update a lesson
app.post('/api/lessons', async (req, res) => {
    const lesson = req.body;
    if (!lesson.id || !lesson.grade || !lesson.week || !lesson.techLevel || !lesson.slidesLink) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const updatedLesson = await Lesson.findOneAndUpdate(
            { id: lesson.id },
            { ...lesson, updatedAt: new Date() },
            { upsert: true, new: true }
        );
        console.log('Saved lesson:', updatedLesson);
        res.status(201).json({ message: 'Lesson saved', lesson: updatedLesson });
    } catch (err) {
        console.error('Error saving lesson:', err);
        res.status(500).json({ error: `Failed to save lesson: ${err.message}` });
    }
});

// NEW: API to delete a lesson
app.delete('/api/lessons/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedLesson = await Lesson.findOneAndDelete({ id });
        if (!deletedLesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }
        console.log('Deleted lesson:', deletedLesson);
        res.json({ message: 'Lesson deleted' });
    } catch (err) {
        console.error('Error deleting lesson:', err);
        res.status(500).json({ error: `Failed to delete lesson: ${err.message}` });
    }
});

// API to generate a link
app.post('/api/links', async (req, res) => {
    const { schoolId, grade, week, techLevel } = req.body;
    if (!schoolId || !grade || !week || !techLevel) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        const school = await School.findOne({ id: schoolId });
        if (!school) {
            return res.status(404).json({ error: 'School not found' });
        }
        const matchingLessons = await Lesson.find({ grade: parseInt(grade), week: parseInt(week), techLevel });
        if (matchingLessons.length === 0) {
            return res.status(404).json({ error: 'No lessons found for the specified criteria' });
        }
        const linkId = uuidv4().slice(0, 8);
        const link = new Link({
            id: linkId,
            schoolId,
            grade: parseInt(grade),
            week: parseInt(week),
            techLevel,
        });
        await link.save();
        const redirectUrl = `${req.protocol}://${req.get('host')}/r/${linkId}`;
        console.log('Generated link:', redirectUrl);
        res.status(201).json({ link: redirectUrl, linkId, schoolId, grade, week, techLevel });
    } catch (err) {
        console.error('Error generating link:', err);
        res.status(500).json({ error: `Failed to generate link: ${err.message}` });
    }
});

// API to handle redirection and log clicks
app.get('/r/:linkId', async (req, res) => {
    const { linkId } = req.params;
    try {
        const link = await Link.findOne({ id: linkId });
        if (!link) {
            return res.status(404).json({ error: 'Link not found' });
        }
        const matchingLessons = await Lesson.find({
            grade: link.grade,
            week: link.week,
            techLevel: link.techLevel,
        });
        if (matchingLessons.length === 0) {
            return res.status(404).json({ error: 'No matching lessons found' });
        }
        const parser = new UAParser(req.headers['user-agent']);
        const device = parser.getDevice();
        const click = new Click({
            linkId,
            schoolId: link.schoolId,
            grade: link.grade,
            week: link.week,
            techLevel: link.techLevel,
            deviceType: device.type || 'desktop',
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });
        await click.save();
        console.log('Logged click for link:', linkId);
        res.redirect(matchingLessons[0].slidesLink);
    } catch (err) {
        console.error('Error processing click:', err);
        res.status(500).json({ error: `Failed to process click: ${err.message}` });
    }
});
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!userMessage) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [
                    // System prompt to constrain the model's scope
                    {
                        role: "user",
                        parts: [{
                            text: `You are a helpful assistant for the CAPE lesson dashboard website. 
Answer only questions related to the website, such as how to upload lessons, manage schools, generate tracking links, view analytics, or use support. 
You may also explain the website's purpose, how student engagement is tracked, or how the redirect links and tech-level filters work. 
For each question, respond clearly and briefly (max 100 words), using simple language for teachers or admins. 
If the question is not about the CAPE website or its features, reply with: "I'm only trained to help with the CAPE website. Please ask something related to it."`

                        }]
                    },

                    {
                        role: "user",
                        parts: [{ text: userMessage }]
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        const reply = response.data.candidates[0]?.content?.parts[0]?.text ||
            "I'm only trained to assist with this website. Please ask something related to it.";
        res.json({ reply });
    } catch (error) {
        console.error('Gemini API Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch response from Gemini AI' });
    }
});


// API to get click analytics
app.get('/api/analytics', async (req, res) => {
    const { schoolId, grade, startDate, endDate } = req.query;
    try {
        // Build query for links
        const linkQuery = {};
        if (schoolId) linkQuery.schoolId = schoolId;
        if (grade) linkQuery.grade = parseInt(grade);
        const links = await Link.find(linkQuery);

        // Build query for clicks
        const clickQuery = { linkId: { $in: links.map(l => l.id) } };
        if (startDate || endDate) {
            clickQuery.timestamp = {};
            if (startDate) clickQuery.timestamp.$gte = new Date(startDate);
            if (endDate) clickQuery.timestamp.$lte = new Date(endDate);
        }
        const clicks = await Click.find(clickQuery);

        // Fetch school data for name mapping
        const schoolIds = [...new Set(links.map(l => l.schoolId))];
        const schools = await School.find({ id: { $in: schoolIds } });
        const schoolMap = schools.reduce((map, school) => {
            map[school.id] = school.name;
            return map;
        }, {});

        // Aggregate analytics
        const analytics = links.map(link => {
            const linkClicks = clicks.filter(c => c.linkId === link.id);
            return {
                linkId: link.id,
                schoolId: link.schoolId,
                schoolName: schoolMap[link.schoolId] || link.schoolId, // NEW: Include school name
                grade: link.grade,
                week: link.week,
                techLevel: link.techLevel,
                clickCount: linkClicks.length,
                clicks: linkClicks.map(c => ({
                    deviceType: c.deviceType,
                    ipAddress: c.ipAddress,
                    timestamp: c.timestamp,
                })),
            };
        });

        console.log('Fetched analytics:', analytics);
        res.json(analytics);
    } catch (err) {
        console.error('Error fetching analytics:', err);
        res.status(500).json({ error: `Failed to fetch analytics: ${err.message}` });
    }
});

// Debug endpoints
app.get('/api/lessons', async (req, res) => res.json(await Lesson.find()));
app.get('/api/links', async (req, res) => res.json(await Link.find()));
app.get('/api/clicks', async (req, res) => res.json(await Click.find()));
app.get('/api/schools', async (req, res) => res.json(await School.find()));

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});