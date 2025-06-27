import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analytics = ({ schools = [] }) => { // Default schools to an empty array to prevent errors
    const [analytics, setAnalytics] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState({
        schoolId: '',
        grade: '',
        startDate: '',
        endDate: '',
    });

    // Effect to fetch analytics data whenever filters change
    useEffect(() => {
        fetchAnalytics();
    }, [filters]);

    /**
     * Fetches analytics data from the API based on current filters.
     * Handles loading states and errors.
     */
    const fetchAnalytics = async () => {
        setIsLoading(true);
        setError(''); // Clear previous errors
        try {
            // Construct query parameters from filters
            const query = new URLSearchParams({
                schoolId: filters.schoolId,
                grade: filters.grade,
                startDate: filters.startDate,
                endDate: filters.endDate,
            }).toString();
            // Assuming your local API endpoint
            const url = `http://localhost:5000/api/analytics?${query}`;
            const response = await fetch(url);

            // Check if the HTTP response was successful
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            // Ensure data is an array, default to empty array if not
            setAnalytics(Array.isArray(data) ? data : []);
        } catch (err) {
            // Catch and display any errors during the fetch operation
            setError(`Failed to load analytics: ${err.message}`);
        } finally {
            setIsLoading(false); // Always set loading to false after fetch
        }
    };

    /**
     * Handles changes to filter input fields.
     * @param {Object} e - The event object from the input change.
     */
    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    /**
     * Resets all filters to their initial empty state.
     */
    const resetFilters = () => {
        setFilters({ schoolId: '', grade: '', startDate: '', endDate: '' });
    };

    /**
     * Exports the current analytics data to a CSV file.
     * Includes headers and formats click details.
     */
    const exportToCSV = () => {
        if (analytics.length === 0) {
            setError('No data to export. Please ensure there is data available.');
            return;
        }

        const headers = ['Link ID', 'School', 'Grade', 'Week', 'Tech Level', 'Click Count', 'Device Types', 'IP Addresses', 'Timestamps'];
        const csvContent = [
            headers.join(','),
            ...analytics.map(item => [
                item.linkId,
                // Find school name, or use ID if not found, and wrap in quotes for CSV
                `"${schools.find(s => s.id === item.schoolId)?.name || item.schoolId}"`,
                item.grade,
                item.week,
                item.techLevel,
                item.clickCount,
                // Join array fields with semicolon and wrap in quotes
                `"${item.clicks.map(c => c.deviceType).join('; ')}"`,
                `"${item.clicks.map(c => c.ipAddress).join('; ')}"`,
                `"${item.clicks.map(c => new Date(c.timestamp).toLocaleString()).join('; ')}"`,
            ].join(',')) // Join each row's fields with comma
        ].join('\n'); // Join all rows with newline

        // Create a Blob and initiate download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`; // Filename with current date
        a.click(); // Programmatically click the link to trigger download
        window.URL.revokeObjectURL(url); // Clean up the URL object
    };

    // Prepare data for the Bar chart
    const chartData = {
        labels: analytics.map(item =>
            // Display school name and relevant details as labels
            `${schools.find(s => s.id === item.schoolId)?.name || item.schoolId} (G${item.grade}, W${item.week})`
        ),
        datasets: [{
            label: 'Number of Clicks',
            data: analytics.map(item => item.clickCount),
            // Modern neon colors for chart bars: electric blue with transparency
            backgroundColor: 'rgba(0, 248, 255, 0.5)', // Electric Blue with transparency
            borderColor: 'rgb(0, 200, 200)', // Slightly darker Electric Blue for border
            borderWidth: 1
        }]
    };

    // Configuration options for the Bar chart
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false, // Allows chart to fill container better
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#e0e0e0', // Light text for legend
                    font: {
                        size: 14,
                    }
                }
            },
            title: {
                display: true,
                text: 'Click Analytics by Link',
                color: '#e0e0e0', // Light text for title
                font: {
                    size: 20,
                    weight: 'bold'
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Clicks',
                    color: '#a0a0a0', // Light gray for axis title
                    font: {
                        size: 16
                    }
                },
                ticks: {
                    color: '#e0e0e0', // Light ticks on Y-axis
                    font: {
                        size: 12
                    }
                },
                grid: {
                    color: 'rgba(0, 248, 255, 0.1)', // Subtle neon blue grid lines
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Links',
                    color: '#a0a0a0', // Light gray for axis title
                    font: {
                        size: 16
                    }
                },
                ticks: {
                    color: '#e0e0e0', // Light ticks on X-axis
                    font: {
                        size: 12
                    },
                    maxRotation: 45, // Rotate labels for better readability
                    minRotation: 45
                },
                grid: {
                    color: 'rgba(0, 248, 255, 0.1)', // Subtle neon blue grid lines
                }
            }
        }
    };

    return (
        // Main container with a dark, sophisticated gradient background for the neon effect to pop
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-indigo-950 p-8 flex items-center justify-center font-sans">
            {/* Glassmorphic main panel */}
            <div className="
                relative bg-blue-900/15 p-8 rounded-3xl shadow-2xl border border-blue-700/30 backdrop-blur-xl overflow-hidden
                w-full max-w-6xl space-y-8 animate-fade-in
            ">
                {/* Decorative neon border effect for the main panel */}
                <div className="absolute inset-0 rounded-3xl pointer-events-none z-0" style={{
                    boxShadow: 'inset 0 0 20px rgba(0, 248, 255, 0.6), 0 0 30px rgba(167, 32, 227, 0.4)'
                }}></div>

                {/* Main title with a prominent electric blue neon glow */}
                <h2 className="relative text-4xl font-extrabold mb-6 text-center text-white drop-shadow-[0_0_12px_rgba(0,248,255,0.8)] z-10">
                    Link Click Analytics
                </h2>

                {/* Error message display with glassmorphism styling */}
                {error && (
                    <div className="
                        mb-4 p-3 rounded-xl bg-red-900/40 text-red-300 border border-red-700
                        backdrop-blur-sm shadow-md transition-all duration-300 relative z-10
                    ">
                        {error}
                    </div>
                )}
                {/* Loading message display with glassmorphism styling */}
                {isLoading && (
                    <div className="
                        mb-4 p-3 rounded-xl bg-blue-900/40 text-blue-300 border border-blue-700
                        backdrop-blur-sm shadow-md transition-all duration-300 relative z-10
                    ">
                        Loading analytics data...
                    </div>
                )}

                {/* Filter section with glassmorphism inputs */}
                <div className="mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
                    <select
                        name="schoolId"
                        value={filters.schoolId}
                        onChange={handleFilterChange}
                        className="
                            p-3 border border-blue-800 rounded-xl focus:ring-2 focus:ring-cyan-400
                            bg-gray-900 text-white placeholder-gray-500
                            backdrop-blur-sm bg-opacity-40 shadow-md transition-all duration-300
                            hover:border-cyan-400
                        "
                    >
                        <option value="" className="bg-gray-800 text-white">All Schools</option>
                        {schools.map(school => (
                            <option key={school.id} value={school.id} className="bg-gray-800 text-white">{school.name}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        name="grade"
                        value={filters.grade}
                        onChange={handleFilterChange}
                        placeholder="Grade (1-12)"
                        className="
                            p-3 border border-blue-800 rounded-xl focus:ring-2 focus:ring-cyan-400
                            bg-gray-900 text-white placeholder-gray-500
                            backdrop-blur-sm bg-opacity-40 shadow-md transition-all duration-300
                            hover:border-cyan-400
                        "
                    />
                    <input
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                        className="
                            p-3 border border-blue-800 rounded-xl focus:ring-2 focus:ring-cyan-400
                            bg-gray-900 text-white placeholder-gray-500
                            backdrop-blur-sm bg-opacity-40 shadow-md transition-all duration-300
                            hover:border-cyan-400
                        "
                    />
                    <input
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                        className="
                            p-3 border border-blue-800 rounded-xl focus:ring-2 focus:ring-cyan-400
                            bg-gray-900 text-white placeholder-gray-500
                            backdrop-blur-sm bg-opacity-40 shadow-md transition-all duration-300
                            hover:border-cyan-400
                        "
                    />
                    <div className="flex gap-4">
                        <button
                            onClick={resetFilters}
                            className="
                                flex-1 bg-gray-800 text-gray-200 p-3 rounded-xl hover:bg-gray-700 transition-all duration-300
                                border border-gray-700 shadow-md
                                hover:shadow-lg hover:shadow-gray-700/50
                            "
                        >
                            Reset
                        </button>
                        <button
                            onClick={exportToCSV}
                            className="
                                flex-1 bg-gradient-to-r from-blue-800 to-violet-800 text-white p-3 rounded-xl
                                hover:from-blue-700 hover:to-violet-700 transition-all duration-300
                                border border-violet-700 shadow-md drop-shadow-[0_0_8px_rgba(0,248,255,0.6)]
                                hover:shadow-lg hover:shadow-violet-700/50
                            "
                        >
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Chart display area with glassmorphism styling */}
                {analytics.length > 0 && (
                    <div className="mb-10 p-6 bg-blue-900/10 rounded-2xl shadow-xl border border-blue-700/20 backdrop-blur-lg relative z-10">
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                )}

                {/* Table display area with glassmorphism styling */}
                {analytics.length === 0 && !isLoading ? (
                    <p className="text-gray-400 text-center text-lg mt-8 relative z-10">
                        No analytics data available. Try adjusting filters or generating clicks.
                    </p>
                ) : (
                    <div className="
                        bg-blue-900/10 rounded-2xl shadow-xl border border-blue-700/20 backdrop-blur-lg overflow-hidden relative z-10
                    ">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-blue-950 to-indigo-950 text-white text-left">
                                    <th className="p-3 border-b border-white/20">School</th>
                                    <th className="p-3 border-b border-white/20">Grade</th>
                                    <th className="p-3 border-b border-white/20">Week</th>
                                    <th className="p-3 border-b border-white/20">Tech Level</th>
                                    <th className="p-3 border-b border-white/20">Click Count</th>
                                    <th className="p-3 border-b border-white/20">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.map((item, index) => (
                                    <tr
                                        key={index}
                                        className={`
                                            ${index % 2 === 0 ? 'bg-blue-900/5' : 'bg-blue-900/10'}
                                            text-gray-100 hover:bg-blue-800/20 transition-colors duration-200
                                        `}
                                    >
                                        <td className="p-3 border-b border-white/10">{schools.find(s => s.id === item.schoolId)?.name || item.schoolId}</td>
                                        <td className="p-3 border-b border-white/10">{item.grade}</td>
                                        <td className="p-3 border-b border-white/10">{item.week}</td>
                                        <td className="p-3 border-b border-white/10">{item.techLevel}</td>
                                        {/* Click count with neon text effect */}
                                        <td className="p-3 border-b border-white/10 font-bold text-cyan-300 drop-shadow-[0_0_4px_rgba(0,248,255,0.6)]">
                                            {item.clickCount}
                                        </td>
                                        <td className="p-3 border-b border-white/10">
                                            <details>
                                                {/* Details summary with neon link styling */}
                                                <summary className="cursor-pointer text-cyan-400 hover:underline hover:text-cyan-300 transition-colors duration-200">
                                                    View Clicks ({item.clicks.length})
                                                </summary>
                                                <ul className="mt-2 list-disc pl-5 text-gray-300 text-sm">
                                                    {item.clicks.map((click, i) => (
                                                        <li key={i} className="mb-1">
                                                            <span className="font-semibold text-gray-100">Device:</span> {click.deviceType},
                                                            <span className="font-semibold text-gray-100"> IP:</span> {click.ipAddress},
                                                            <span className="font-semibold text-gray-100"> Time:</span> {new Date(click.timestamp).toLocaleString()}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </details>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;
