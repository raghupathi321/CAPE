
import React, { useState } from 'react';
import {
    School,
    BookOpen,
    Link,
    Users,
    BarChart2, // NEW: Changed to BarChart2 for Analytics
    Settings,
    Bell,
    Search,
    Menu,
    X,
    User,
    LogOut,
    ChevronDown
} from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart2 }, // Changed icon to BarChart2 for consistency
        { id: 'schools', label: 'Schools', icon: School },
        { id: 'lessons', label: 'Lessons', icon: BookOpen },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'links', label: 'Generate Links', icon: Link },
        { id: 'analytics', label: 'Analytics', icon: BarChart2 }, // NEW: Added Analytics item
        { id: 'settings', label: 'Settings', icon: Settings }
    ];

    const notifications = [
        { id: 1, message: "New school registration pending", time: "2 min ago", unread: true },
        { id: 2, message: "Lesson completion rate updated", time: "1 hour ago", unread: true },
        { id: 3, message: "System maintenance scheduled", time: "3 hours ago", unread: false }
    ];

    const unreadCount = notifications.filter(n => n.unread).length;

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            console.log('Searching for:', searchQuery);
        }
    };

    const handleNavClick = (id) => {
        console.log('Navigating to:', id); // Debug
        setActiveTab(id);
        setIsMobileMenuOpen(false); // Close mobile menu on click
    };

    return (
        <div className="w-full">
            <nav className="bg-blue-600 text-white shadow-lg relative">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center py-4">
                        {/* Logo and Title */}
                        <div className="flex items-center space-x-3">
                            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                                <School className="h-6 w-6" />
                            </div>
                            <h1 className="text-2xl font-bold">Admin Panel</h1>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => handleNavClick(item.id)}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-blue-700 ${activeTab === item.id ? 'bg-blue-800' : ''}`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-4">
                            {/* Search Bar */}
                            <div className="hidden md:flex items-center">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-200" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyPress={handleSearch}
                                        className="bg-white bg-opacity-20 placeholder-blue-200 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                                    />
                                </div>
                            </div>

                            {/* Notifications */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                    className="relative p-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                >
                                    <Bell className="h-5 w-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {/* Notifications Dropdown */}
                                {isNotificationsOpen && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 text-gray-800">
                                        <div className="p-4 border-b border-gray-200">
                                            <h3 className="font-semibold text-lg">Notifications</h3>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {notifications.map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${notification.unread ? 'bg-blue-50' : ''}`}
                                                >
                                                    <p className="text-sm text-gray-800">{notification.message}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-3 text-center border-t border-gray-200">
                                            <button className="text-blue-600 text-sm hover:underline">
                                                View all notifications
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                >
                                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium">Admin</span>
                                    <ChevronDown className="h-4 w-4" />
                                </button>

                                {/* Profile Dropdown Menu */}
                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50 text-gray-800">
                                        <div className="p-4 border-b border-gray-200">
                                            <p className="font-semibold">Admin User</p>
                                            <p className="text-sm text-gray-500">admin@example.com</p>
                                        </div>
                                        <div className="py-2">
                                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2">
                                                <User className="h-4 w-4" />
                                                <span>Profile</span>
                                            </button>
                                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2">
                                                <Settings className="h-4 w-4" />
                                                <span>Account Settings</span>
                                            </button>
                                            <div className="border-t border-gray-200 my-2"></div>
                                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 text-red-600">
                                                <LogOut className="h-4 w-4" />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {isMobileMenuOpen && (
                        <div className="lg:hidden pb-4">
                            {/* Mobile Search */}
                            <div className="mb-4 md:hidden">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-200" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyPress={handleSearch}
                                        className="w-full bg-white bg-opacity-20 placeholder-blue-200 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                                    />
                                </div>
                            </div>

                            {/* Mobile Navigation Items */}
                            <div className="space-y-2">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => handleNavClick(item.id)}
                                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 hover:bg-blue-700 ${activeTab === item.id ? 'bg-blue-800' : ''}`}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span className="font-medium">{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Navbar;