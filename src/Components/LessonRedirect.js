// src/LessonRedirect.js
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const LessonRedirect = ({ lessons }) => {
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const schoolId = searchParams.get('s_id');
        const grade = parseInt(searchParams.get('g'));
        const week = parseInt(searchParams.get('w'));
        const techLevel = searchParams.get('t');

        // Find matching lesson
        const matchedLesson = lessons.find(
            lesson =>
                lesson.schoolId === schoolId &&
                lesson.grade === grade &&
                lesson.week === week &&
                lesson.techLevel === techLevel
        );

        if (matchedLesson) {
            window.location.href = matchedLesson.slideLink;
        } else {
            alert('No matching lesson found.');
        }
    }, [searchParams, lessons]);

    return <p>Redirecting to lesson...</p>;
};

export default LessonRedirect;
