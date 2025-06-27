import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LinkGenerator = ({ schools, lessons }) => {
    const [formData, setFormData] = useState({
        schoolId: '',
        grade: '',
        week: '',
        techLevel: 'low',
    });
    const [generatedLinks, setGeneratedLinks] = useState([]);
    const [showQR, setShowQR] = useState({});
    const [bulkMode, setBulkMode] = useState(false);
    const [bulkGrades, setBulkGrades] = useState([]);
    const [bulkWeeks, setBulkWeeks] = useState([]);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const generateLink = async () => {
        const { schoolId, grade, week, techLevel } = formData;
        // Validate inputs
        if (!schoolId || !grade || !week) {
            setError('Please fill in all required fields.');
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/api/links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ schoolId, grade: parseInt(grade), week: parseInt(week), techLevel }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate link');
            }
            // Find matching lesson to get additional details
            const matchingLesson = lessons.find(
                l => l.grade === parseInt(grade) && l.week === parseInt(week) && l.techLevel === techLevel
            );
            setGeneratedLinks([...generatedLinks, {
                ...data,
                subject: matchingLesson?.subject || 'Unknown',
                duration: matchingLesson?.duration || 'N/A',
            }]);
        } catch (err) {
            setError(err.message);
        }
    };

    const generateBulkLinks = async () => {
        if (!formData.schoolId) {
            setError('Please select a school.');
            return;
        }
        if (bulkGrades.length === 0 || bulkWeeks.length === 0) {
            setError('Please provide at least one grade and one week for bulk generation.');
            return;
        }
        try {
            const links = [];
            for (const grade of bulkGrades) {
                for (const week of bulkWeeks) {
                    const response = await fetch('http://localhost:5000/api/links', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ schoolId: formData.schoolId, grade, week, techLevel: formData.techLevel }),
                    });
                    const data = await response.json();
                    if (response.ok) {
                        const matchingLesson = lessons.find(
                            l => l.grade === grade && l.week === week && l.techLevel === formData.techLevel
                        );
                        links.push({
                            ...data,
                            subject: matchingLesson?.subject || 'Unknown',
                            duration: matchingLesson?.duration || 'N/A',
                        });
                    }
                }
            }
            if (links.length === 0) {
                setError('No lessons found for the specified grades, weeks, and tech level.');
                return;
            }
            setGeneratedLinks([...generatedLinks, ...links]);
        } catch (err) {
            setError(err.message || 'Failed to generate bulk links');
        }
    };

    const copyLink = (link) => {
        navigator.clipboard.writeText(link);
        alert('Link copied to clipboard!');
    };

    const toggleQR = (index) => {
        setShowQR({ ...showQR, [index]: !showQR[index] });
        if (!showQR[index]) {
            setTimeout(() => {
                const qrCodeElement = document.getElementById(`qrcode-${index}`);
                if (qrCodeElement) {
                    qrCodeElement.innerHTML = '';
                    if (window.QRCode) {
                        window.QRCode.toCanvas(qrCodeElement, generatedLinks[index].link, { width: 150 }, (error) => {
                            if (error) console.error(error);
                        });
                    } else {
                        console.error('QRCode library not loaded.');
                    }
                }
            }, 0);
        }
    };

    const handleBulkGradeChange = (e) => {
        const value = e.target.value.split(',').map(g => parseInt(g.trim())).filter(g => !isNaN(g));
        setBulkGrades(value);
        setError('');
    };

    const handleBulkWeekChange = (e) => {
        const value = e.target.value.split(',').map(w => parseInt(w.trim())).filter(w => !isNaN(w));
        setBulkWeeks(value);
        setError('');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Generate Lesson Links</h2>
            {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-400 rounded">
                    {error}
                </div>
            )}
            <div className="mb-4">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={bulkMode}
                        onChange={() => setBulkMode(!bulkMode)}
                        className="mr-2"
                    />
                    Bulk Generation Mode
                </label>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <select
                    name="schoolId"
                    value={formData.schoolId}
                    onChange={handleInputChange}
                    className="p-2 border rounded"
                >
                    <option value="">Select School</option>
                    {schools.map((school) => (
                        <option key={school.id} value={school.id}>
                            {school.name}
                        </option>
                    ))}
                </select>
                {!bulkMode ? (
                    <>
                        <input
                            type="number"
                            name="grade"
                            value={formData.grade}
                            onChange={handleInputChange}
                            placeholder="Grade"
                            className="p-2 border rounded"
                        />
                        <input
                            type="number"
                            name="week"
                            value={formData.week}
                            onChange={handleInputChange}
                            placeholder="Week"
                            className="p-2 border rounded"
                        />
                    </>
                ) : (
                    <>
                        <input
                            type="text"
                            onChange={handleBulkGradeChange}
                            placeholder="Grades (comma-separated, e.g., 5,6,7)"
                            className="p-2 border rounded"
                        />
                        <input
                            type="text"
                            onChange={handleBulkWeekChange}
                            placeholder="Weeks (comma-separated, e.g., 1,2,3)"
                            className="p-2 border rounded"
                        />
                    </>
                )}
                <select
                    name="techLevel"
                    value={formData.techLevel}
                    onChange={handleInputChange}
                    className="p-2 border rounded"
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
            <button
                onClick={bulkMode ? generateBulkLinks : generateLink}
                className="bg-blue-600 text-white p-2 rounded mb-4 hover:bg-blue-700"
            >
                {bulkMode ? 'Generate Bulk Links' : 'Generate Link'}
            </button>
            <div>
                <h3 className="text-lg font-semibold mb-2">Generated Links</h3>
                {generatedLinks.length === 0 ? (
                    <p className="text-gray-500">No links generated yet.</p>
                ) : (
                    <table className="w-full border-collapse border">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">School</th>
                                <th className="border p-2">Grade</th>
                                <th className="border p-2">Week</th>
                                <th className="border p-2">Tech Level</th>
                                <th className="border p-2">Subject</th>
                                <th className="border p-2">Duration</th>
                                <th className="border p-2">Link</th>
                                <th className="border p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {generatedLinks.map((linkObj, index) => (
                                <tr key={index}>
                                    <td className="border p-2">
                                        {schools.find((s) => s.id === linkObj.schoolId)?.name || linkObj.schoolId}
                                    </td>
                                    <td className="border p-2">{linkObj.grade}</td>
                                    <td className="border p-2">{linkObj.week}</td>
                                    <td className="border p-2">{linkObj.techLevel}</td>
                                    <td className="border p-2">{linkObj.subject}</td>
                                    <td className="border p-2">{linkObj.duration} min</td>
                                    <td className="border p-2">
                                        <a
                                            href={linkObj.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {linkObj.link}
                                        </a>
                                    </td>
                                    <td className="border p-2">
                                        <button
                                            onClick={() => copyLink(linkObj.link)}
                                            className="bg-green-500 text-white px-2 py-1 rounded mr-2 hover:bg-green-600"
                                        >
                                            Copy
                                        </button>
                                        <button
                                            onClick={() => toggleQR(index)}
                                            className="bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600"
                                        >
                                            {showQR[index] ? 'Hide QR' : 'Show QR'}
                                        </button>
                                        {showQR[index] && (
                                            <div className="mt-2">
                                                <canvas id={`qrcode-${index}`}></canvas>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default LinkGenerator;