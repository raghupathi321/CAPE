import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ViewLesson = () => {
    const [lesson, setLesson] = useState(null);
    const [error, setError] = useState('');
    const query = new URLSearchParams(useLocation().search);
    const schoolId = query.get('schoolId');
    const grade = parseInt(query.get('grade'));
    const week = parseInt(query.get('week'));
    const techLevel = query.get('techLevel');

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/lessons');
                const lessons = await response.json();
                const matchingLesson = lessons.find(
                    l => l.grade === grade && l.week === week && l.techLevel === techLevel
                );
                if (matchingLesson) {
                    setLesson(matchingLesson);
                    // Optionally redirect immediately
                    window.location.href = matchingLesson.slidesLink;
                } else {
                    setError('No lesson found for the specified criteria.');
                }
            } catch (err) {
                setError('Failed to load lesson.');
            }
        };
        fetchLessons();
    }, [grade, week, techLevel]);

    if (error) return <div className="text-red-600 p-4">{error}</div>;
    if (!lesson) return <div className="text-gray-600 p-4">Loading...</div>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">{lesson.subject}</h2>
            <p>Grade: {lesson.grade}</p>
            <p>Week: {lesson.week}</p>
            <p>Tech Level: {lesson.techLevel}</p>
            <p>Duration: {lesson.duration} minutes</p>
            <a
                href={lesson.slidesLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
            >
                View Slides
            </a>
        </div>
    );
};

export default ViewLesson;