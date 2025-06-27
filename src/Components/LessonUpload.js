
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Download, Upload, Edit2, Trash2, Eye, Plus, BookOpen, Calendar, Users, Monitor, ExternalLink, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const LessonUpload = ({ lessons, setLessons }) => {
    const [formData, setFormData] = useState({
        subject: '',
        grade: '',
        week: '',
        techLevel: 'low',
        slidesLink: '',
        description: '',
        duration: '',
        tags: '',
        difficulty: 'beginner',
        prerequisites: '',
        learningObjectives: '',
        resources: ''
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [filterBy, setFilterBy] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [editingId, setEditingId] = useState(null);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [selectedLessons, setSelectedLessons] = useState([]);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

    // NEW: Fetch lessons from backend on mount
    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/lessons');
                if (!response.ok) throw new Error('Failed to fetch lessons');
                const data = await response.json();
                console.log('Fetched lessons:', data); // Debug
                setLessons(data);
            } catch (error) {
                console.error('Error fetching lessons:', error);
                setNotification({ show: true, message: 'Failed to load lessons', type: 'error' });
            }
        };
        fetchLessons();
    }, [setLessons]);

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const lessonData = {
            ...formData,
            id: editingId || `L${Date.now()} `,
            grade: parseInt(formData.grade),
            week: parseInt(formData.week),
            duration: parseInt(formData.duration) || null,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            createdAt: editingId ? lessons.find(l => l.id === editingId)?.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'active',
        };

        try {
            // Send lesson to backend
            const response = await fetch('http://localhost:5000/api/lessons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lessonData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save lesson');
            }
            const { lesson } = await response.json();

            // Update local state
            if (editingId) {
                setLessons(lessons.map(l => l.id === lesson.id ? lesson : l));
                setEditingId(null);
                showNotification('Lesson updated successfully!');
            } else {
                setLessons([...lessons, lesson]);
                showNotification('Lesson added successfully!');
            }

            resetForm();
        } catch (error) {
            console.error('Error saving lesson:', error);
            showNotification(`Failed to save lesson: ${error.message} `, 'error');
        }
    };

    const resetForm = () => {
        setFormData({
            subject: '', grade: '', week: '', techLevel: 'low', slidesLink: '',
            description: '', duration: '', tags: '', difficulty: 'beginner',
            prerequisites: '', learningObjectives: '', resources: ''
        });
        setShowAdvanced(false);
    };

    const handleEdit = (lesson) => {
        setFormData({
            ...lesson,
            tags: lesson.tags ? lesson.tags.join(', ') : '',
            grade: lesson.grade.toString(),
            week: lesson.week.toString(),
            duration: lesson.duration ? lesson.duration.toString() : ''
        });
        setEditingId(lesson.id);
        setShowAdvanced(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this lesson?')) {
            try {
                // NEW: Send DELETE request to backend
                const response = await fetch(`http://localhost:5000/api/lessons/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to delete lesson');
                }
                setLessons(lessons.filter(lesson => lesson.id !== id));
                showNotification('Lesson deleted successfully!');
            } catch (error) {
                console.error('Error deleting lesson:', error);
                showNotification(`Failed to delete lesson: ${error.message}`, 'error');
            }
        }
    };

    const handleDuplicate = async (lesson) => {
        const duplicated = {
            ...lesson,
            id: `L${Date.now()}`,
            subject: `${lesson.subject} (Copy)`,
            createdAt: new Date().toISOString(),
        };
        try {
            // Send duplicated lesson to backend
            const response = await fetch('http://localhost:5000/api/lessons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(duplicated),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to duplicate lesson');
            }
            const { lesson: newLesson } = await response.json();
            setLessons([...lessons, newLesson]);
            showNotification('Lesson duplicated successfully!');
        } catch (error) {
            console.error('Error duplicating lesson:', error);
            showNotification(`Failed to duplicate lesson: ${error.message}`, 'error');
        }
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`Are you sure you want to delete ${selectedLessons.length} lessons?`)) {
            try {
                // NEW: Send bulk DELETE request to backend
                for (const id of selectedLessons) {
                    const response = await fetch(`http://localhost:5000/api/lessons/${id}`, {
                        method: 'DELETE',
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || `Failed to delete lesson ${id}`);
                    }
                }
                setLessons(lessons.filter(lesson => !selectedLessons.includes(lesson.id)));
                setSelectedLessons([]);
                showNotification(`${selectedLessons.length} lessons deleted successfully!`);
            } catch (error) {
                console.error('Error deleting lessons:', error);
                showNotification(`Failed to delete lessons: ${error.message}`, 'error');
            }
        }
    };

    const exportToCSV = () => {
        const headers = ['ID', 'Subject', 'Grade', 'Week', 'Tech Level', 'Duration', 'Difficulty', 'Tags', 'Description'];
        const csvContent = [
            headers.join(','),
            ...lessons.map(lesson => [
                lesson.id,
                `"${lesson.subject}"`,
                lesson.grade,
                lesson.week,
                lesson.techLevel,
                lesson.duration || '',
                lesson.difficulty || '',
                `"${lesson.tags ? lesson.tags.join('; ') : ''}"`,
                `"${lesson.description || ''}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lessons-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        showNotification('Lessons exported to CSV!');
    };

    const filteredAndSortedLessons = useMemo(() => {
        let filtered = lessons.filter(lesson => {
            const matchesSearch = lesson.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lesson.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lesson.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesFilter = filterBy === 'all' ||
                (filterBy === 'techLevel' && lesson.techLevel === 'high') ||
                (filterBy === 'difficulty' && lesson.difficulty === 'advanced') ||
                (filterBy === 'grade' && lesson.grade >= 9);

            return matchesSearch && matchesFilter;
        });

        return filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest': return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
                case 'oldest': return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
                case 'subject': return a.subject.localeCompare(b.subject);
                case 'grade': return a.grade - b.grade;
                case 'week': return a.week - b.week;
                default: return 0;
            }
        });
    }, [lessons, searchTerm, filterBy, sortBy]);

    const stats = useMemo(() => ({
        total: lessons.length,
        byGrade: [...new Set(lessons.map(l => l.grade))].length,
        bySubject: [...new Set(lessons.map(l => l.subject))].length,
        highTech: lessons.filter(l => l.techLevel === 'high').length
    }), [lessons]);

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Notification */}
            {notification.show && (
                <div className={`p-4 ${notification.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'} border-l-4 flex items-center gap-2`}>
                    {notification.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    {notification.message}
                </div>
            )}

            {/* Header with Stats */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Lesson Management</h2>
                        <div className="flex gap-6 text-sm">
                            <span className="flex items-center gap-1"><BookOpen size={16} /> {stats.total} Total</span>
                            <span className="flex items-center gap-1"><Users size={16} /> {stats.byGrade} Grades</span>
                            <span className="flex items-center gap-1"><Calendar size={16} /> {stats.bySubject} Subjects</span>
                            <span className="flex items-center gap-1"><Monitor size={16} /> {stats.highTech} High-Tech</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={exportToCSV}
                            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Download size={16} /> Export CSV
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Form Section */}
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">{editingId ? 'Edit Lesson' : 'Add New Lesson'}</h3>
                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                            <Plus size={16} className={`transform transition-transform ${showAdvanced ? 'rotate-45' : ''}`} />
                            {showAdvanced ? 'Basic Mode' : 'Advanced Mode'}
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Basic Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                placeholder="Subject *"
                                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                            <input
                                type="number"
                                name="grade"
                                value={formData.grade}
                                onChange={handleInputChange}
                                placeholder="Grade (1-12) *"
                                min="1" max="12"
                                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                            <input
                                type="number"
                                name="week"
                                value={formData.week}
                                onChange={handleInputChange}
                                placeholder="Week *"
                                min="1" max="52"
                                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <select
                                name="techLevel"
                                value={formData.techLevel}
                                onChange={handleInputChange}
                                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="low">Low Tech</option>
                                <option value="medium">Medium Tech</option>
                                <option value="high">High Tech</option>
                            </select>
                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                                placeholder="Duration (minutes)"
                                min="1"
                                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <input
                            type="url"
                            name="slidesLink"
                            value={formData.slidesLink}
                            onChange={handleInputChange}
                            placeholder="Google Slides Link *"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />

                        {/* Advanced Fields */}
                        {showAdvanced && (
                            <div className="space-y-4 pt-4 border-t border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <select
                                        name="difficulty"
                                        value={formData.difficulty}
                                        onChange={handleInputChange}
                                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                    <input
                                        type="text"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleInputChange}
                                        placeholder="Tags (comma-separated)"
                                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Lesson Description"
                                    rows="3"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />

                                <textarea
                                    name="learningObjectives"
                                    value={formData.learningObjectives}
                                    onChange={handleInputChange}
                                    placeholder="Learning Objectives"
                                    rows="2"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <textarea
                                        name="prerequisites"
                                        value={formData.prerequisites}
                                        onChange={handleInputChange}
                                        placeholder="Prerequisites"
                                        rows="2"
                                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <textarea
                                        name="resources"
                                        value={formData.resources}
                                        onChange={handleInputChange}
                                        placeholder="Additional Resources"
                                        rows="2"
                                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex gap-2">
                            <button
                                onClick={handleSubmit}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <Upload size={16} />
                                {editingId ? 'Update Lesson' : 'Add Lesson'}
                            </button>
                            {editingId && (
                                <button
                                    onClick={() => {
                                        setEditingId(null);
                                        resetForm();
                                    }}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-1 gap-2">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search lessons..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <select
                                value={filterBy}
                                onChange={(e) => setFilterBy(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Lessons</option>
                                <option value="techLevel">High Tech Only</option>
                                <option value="difficulty">Advanced Only</option>
                                <option value="grade">High School (9+)</option>
                            </select>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="subject">By Subject</option>
                                <option value="grade">By Grade</option>
                                <option value="week">By Week</option>
                            </select>
                        </div>

                        {selectedLessons.length > 0 && (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleBulkDelete}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                >
                                    <Trash2 size={16} />
                                    Delete Selected ({selectedLessons.length})
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Lessons Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-3 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedLessons.length === filteredAndSortedLessons.length && filteredAndSortedLessons.length > 0}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedLessons(filteredAndSortedLessons.map(l => l.id));
                                                } else {
                                                    setSelectedLessons([]);
                                                }
                                            }}
                                            className="rounded"
                                        />
                                    </th>
                                    <th className="p-3 text-left font-medium text-gray-900">Subject</th>
                                    <th className="p-3 text-left font-medium text-gray-900">Grade</th>
                                    <th className="p-3 text-left font-medium text-gray-900">Week</th>
                                    <th className="p-3 text-left font-medium text-gray-900">Tech</th>
                                    <th className="p-3 text-left font-medium text-gray-900">Duration</th>
                                    <th className="p-3 text-left font-medium text-gray-900">Difficulty</th>
                                    <th className="p-3 text-left font-medium text-gray-900">Tags</th>
                                    <th className="p-3 text-left font-medium text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredAndSortedLessons.length > 0 ? (
                                    filteredAndSortedLessons.map((lesson, index) => (
                                        <tr key={lesson.id} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                                            <td className="p-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedLessons.includes(lesson.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedLessons([...selectedLessons, lesson.id]);
                                                        } else {
                                                            setSelectedLessons(selectedLessons.filter(id => id !== lesson.id));
                                                        }
                                                    }}
                                                    className="rounded"
                                                />
                                            </td>
                                            <td className="p-3">
                                                <div>
                                                    <div className="font-medium text-gray-900">{lesson.subject}</div>
                                                    {lesson.description && (
                                                        <div className="text-sm text-gray-500 truncate max-w-xs">{lesson.description}</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-3 text-gray-900">{lesson.grade}</td>
                                            <td className="p-3 text-gray-900">{lesson.week}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${lesson.techLevel === 'high' ? 'bg-red-100 text-red-800' :
                                                    lesson.techLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-green-100 text-green-800'
                                                    }`}>
                                                    {lesson.techLevel}
                                                </span>
                                            </td>
                                            <td className="p-3 text-gray-900">
                                                {lesson.duration ? (
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={14} />
                                                        {lesson.duration}m
                                                    </span>
                                                ) : '-'}
                                            </td>
                                            <td className="p-3">
                                                {lesson.difficulty && (
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${lesson.difficulty === 'advanced' ? 'bg-purple-100 text-purple-800' :
                                                        lesson.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {lesson.difficulty}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-3">
                                                {lesson.tags && lesson.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {lesson.tags.slice(0, 2).map((tag, i) => (
                                                            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                        {lesson.tags.length > 2 && (
                                                            <span className="text-xs text-gray-500">+{lesson.tags.length - 2}</span>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-3">
                                                <div className="flex gap-1">
                                                    <a
                                                        href={lesson.slidesLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                                        title="View Slides"
                                                    >
                                                        <ExternalLink size={16} />
                                                    </a>
                                                    <button
                                                        onClick={() => handleEdit(lesson)}
                                                        className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                                        title="Edit Lesson"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDuplicate(lesson)}
                                                        className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                                                        title="Duplicate Lesson"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(lesson.id)}
                                                        className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                                                        title="Delete Lesson"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="p-8 text-center text-gray-500">
                                            {searchTerm || filterBy !== 'all' ? 'No lessons match your search criteria.' : 'No lessons uploaded yet.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Results Summary */}
                {filteredAndSortedLessons.length > 0 && (
                    <div className="mt-4 text-sm text-gray-600 text-center">
                        Showing {filteredAndSortedLessons.length} of {lessons.length} lessons
                    </div>
                )}
            </div>
        </div>
    );
};

export default LessonUpload;
