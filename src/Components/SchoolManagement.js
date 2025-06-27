import React, { useState, useEffect } from 'react';

const SchoolManagement = ({ schools, setSchools }) => {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        city: '',
        state: '',
        board: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');

    // Fetch schools on component mount
    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/schools');
                if (!response.ok) throw new Error('Failed to fetch schools');
                const data = await response.json();
                setSchools(data);
            } catch (err) {
                console.error('Error fetching schools:', err);
                setError('Failed to load schools. Please ensure the backend server is running.');
            }
        };
        fetchSchools();
    }, [setSchools]); // Dependency array includes setSchools to avoid lint warnings

    // Handles changes in form input fields
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handles form submission for adding or updating a school
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        const payload = { ...formData };

        // Generate a unique ID if not provided for new schools
        if (!payload.id) {
            payload.id = `S${Date.now().toString().slice(-6)}`;
        }

        try {
            const url = editingId ? `http://localhost:5000/api/schools/${editingId}` : 'http://localhost:5000/api/schools';
            const method = editingId ? 'PUT' : 'POST'; // Use PUT for editing, POST for adding

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            // Handle API response
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save school');
            }

            const { school } = await response.json();

            // Update the schools state based on whether it was an edit or add operation
            if (editingId) {
                setSchools(schools.map(s => s.id === school.id ? school : s));
            } else {
                setSchools([...schools, school]);
            }

            // Reset form and editing state
            setFormData({ id: '', name: '', city: '', state: '', board: '' });
            setEditingId(null);
        } catch (err) {
            console.error('Error saving school:', err);
            setError(err.message);
        }
    };

    // Sets the form data for editing a school
    const handleEdit = (school) => {
        setFormData(school);
        setEditingId(school.id);
        setError(''); // Clear errors when starting edit
    };

    // Handles deleting a school
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/schools/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete school');
            }
            // Update schools state after successful deletion
            setSchools(schools.filter(school => school.id !== id));
        } catch (err) {
            console.error('Error deleting school:', err);
            setError(err.message);
        }
    };

    return (
        // Main container with a dark, sophisticated gradient background
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-indigo-950 p-8 flex items-center justify-center font-sans">
            {/* Glassmorphic main panel */}
            <div className="
                relative bg-blue-900/15 p-8 rounded-3xl shadow-2xl border border-blue-700/30 backdrop-blur-xl overflow-hidden
                w-full max-w-6xl space-y-8 animate-fade-in
            ">
                {/* Decorative neon border effect for the main panel, matching Analytics component */}
                <div className="absolute inset-0 rounded-3xl pointer-events-none z-0" style={{
                    boxShadow: 'inset 0 0 20px rgba(0, 248, 255, 0.6), 0 0 30px rgba(167, 32, 227, 0.4)'
                }}></div>

                {/* Main title with a prominent electric blue neon glow, matching Analytics component */}
                <h2 className="relative text-4xl font-extrabold mb-8 text-center text-white drop-shadow-[0_0_12px_rgba(0,248,255,0.8)] z-10">
                    <span className="animate-pulse">🌌</span> School Management <span className="animate-pulse">🏫</span>
                </h2>

                {/* Error message display with glassmorphism styling, matching Analytics component */}
                {error && (
                    <div className="
                        mb-4 p-3 rounded-xl bg-red-900/40 text-red-300 border border-red-700
                        backdrop-blur-sm shadow-md transition-all duration-300 relative z-10
                    ">
                        {error}
                    </div>
                )}

                {/* Form section with glassmorphism background */}
                <div className="mb-10 p-6 bg-blue-900/10 rounded-2xl shadow-xl border border-blue-700/20 backdrop-blur-lg relative z-10">
                    {/* Form title with subtle neon glow */}
                    <h3 className="text-2xl font-bold mb-6 text-cyan-300 drop-shadow-[0_0_8px_rgba(0,248,255,0.4)]">
                        {editingId ? '✍️ Edit School' : '✨ Add New School'}
                    </h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* School ID Input (disabled when editing) */}
                        <input
                            type="text"
                            name="id"
                            value={formData.id}
                            onChange={handleInputChange}
                            placeholder="School ID (e.g., S001)"
                            className="
                                p-3 border border-blue-800 rounded-xl focus:ring-2 focus:ring-cyan-400
                                bg-gray-900 text-white placeholder-gray-500
                                backdrop-blur-sm bg-opacity-40 shadow-md transition-all duration-300
                                hover:border-cyan-400
                            "
                            required
                            disabled={editingId !== null}
                        />
                        {/* School Name Input */}
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="School Name"
                            className="
                                p-3 border border-blue-800 rounded-xl focus:ring-2 focus:ring-cyan-400
                                bg-gray-900 text-white placeholder-gray-500
                                backdrop-blur-sm bg-opacity-40 shadow-md transition-all duration-300
                                hover:border-cyan-400
                            "
                            required
                        />
                        {/* City Input */}
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="City"
                            className="
                                p-3 border border-blue-800 rounded-xl focus:ring-2 focus:ring-cyan-400
                                bg-gray-900 text-white placeholder-gray-500
                                backdrop-blur-sm bg-opacity-40 shadow-md transition-all duration-300
                                hover:border-cyan-400
                            "
                            required
                        />
                        {/* State Input */}
                        <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            placeholder="State"
                            className="
                                p-3 border border-blue-800 rounded-xl focus:ring-2 focus:ring-cyan-400
                                bg-gray-900 text-white placeholder-gray-500
                                backdrop-blur-sm bg-opacity-40 shadow-md transition-all duration-300
                                hover:border-cyan-400
                            "
                            required
                        />
                        {/* Board Input */}
                        <input
                            type="text"
                            name="board"
                            value={formData.board}
                            onChange={handleInputChange}
                            placeholder="Board (e.g., CBSE, State Board)"
                            className="
                                p-3 border border-blue-800 rounded-xl focus:ring-2 focus:ring-cyan-400
                                bg-gray-900 text-white placeholder-gray-500
                                backdrop-blur-sm bg-opacity-40 shadow-md transition-all duration-300
                                hover:border-cyan-400
                            "
                            required
                        />
                        {/* Submit Button with neon styling */}
                        <button
                            type="submit"
                            className="
                                col-span-1 md:col-span-2 p-3 rounded-xl font-semibold text-lg
                                bg-gradient-to-r from-blue-800 to-violet-800 text-white
                                shadow-lg hover:from-blue-700 hover:to-violet-700 transition-all duration-300
                                transform hover:-translate-y-1 hover:scale-105
                                relative overflow-hidden group
                                border border-violet-700 drop-shadow-[0_0_10px_rgba(0,248,255,0.7)]
                            "
                        >
                            <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                            {editingId ? '💾 Update School' : '➕ Add School'}
                        </button>
                    </form>
                </div>

                {/* Registered Schools Table Section */}
                <div>
                    {/* Table title with subtle neon glow */}
                    <h3 className="text-2xl font-bold mb-6 text-cyan-300 drop-shadow-[0_0_8px_rgba(0,248,255,0.4)]">
                        📚 Registered Schools
                    </h3>
                    <div className="
                        bg-blue-900/10 rounded-2xl shadow-xl border border-blue-700/20 backdrop-blur-lg overflow-hidden relative z-10
                    ">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-blue-950 to-indigo-950 text-white text-left">
                                    <th className="p-3 border-b border-white/20">ID</th>
                                    <th className="p-3 border-b border-white/20">Name</th>
                                    <th className="p-3 border-b border-white/20">City</th>
                                    <th className="p-3 border-b border-white/20">State</th>
                                    <th className="p-3 border-b border-white/20">Board</th>
                                    <th className="p-3 border-b border-white/20">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Conditional rendering for no schools found */}
                                {schools.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-4 text-center text-gray-400 italic">No schools registered yet.</td>
                                    </tr>
                                ) : (
                                    // Map over schools to display each row
                                    schools.map(school => (
                                        <tr key={school.id} className="
                                            bg-blue-900/5 border-b border-white/10
                                            text-gray-100 hover:bg-blue-800/20 transition-colors duration-200
                                        ">
                                            {/* School ID with subtle neon glow */}
                                            <td className="p-3 border-b border-white/10 font-medium text-cyan-200 drop-shadow-[0_0_2px_rgba(0,248,255,0.3)]">{school.id}</td>
                                            <td className="p-3 border-b border-white/10">{school.name}</td>
                                            <td className="p-3 border-b border-white/10">{school.city}</td>
                                            <td className="p-3 border-b border-white/10">{school.state}</td>
                                            <td className="p-3 border-b border-white/10">{school.board}</td>
                                            <td className="p-3 border-b border-white/10 flex flex-col sm:flex-row gap-2">
                                                {/* Edit Button with yellow-gold neon styling */}
                                                <button
                                                    onClick={() => handleEdit(school)}
                                                    className="
                                                        bg-yellow-600/70 text-white px-4 py-2 rounded-md font-medium text-sm
                                                        shadow-md hover:bg-yellow-500 transition duration-300 ease-in-out
                                                        transform hover:-translate-y-0.5 hover:scale-105
                                                        relative overflow-hidden group
                                                        border border-yellow-500 drop-shadow-[0_0_8px_rgba(255,200,0,0.5)]
                                                    "
                                                >
                                                    <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                                                    ✏️ Edit
                                                </button>
                                                {/* Delete Button with red neon styling */}
                                                <button
                                                    onClick={() => handleDelete(school.id)}
                                                    className="
                                                        bg-red-700/70 text-white px-4 py-2 rounded-md font-medium text-sm
                                                        shadow-md hover:bg-red-600 transition duration-300 ease-in-out
                                                        transform hover:-translate-y-0.5 hover:scale-105
                                                        relative overflow-hidden group
                                                        border border-red-600 drop-shadow-[0_0_8px_rgba(255,0,0,0.5)]
                                                    "
                                                >
                                                    <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                                                    🗑️ Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchoolManagement;
