import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import SchoolManagement from './Components/SchoolManagement';
import LessonUpload from './Components/LessonUpload';
import LinkGenerator from './Components/LinkGenerator';
import Analytics from './Components/Analytics';
import ViewLesson from './Components/ViewLesson';
import NotFound from './Components/NotFound';
import Chatbot from './Components/Chatbot';

// Dashboard component
const Dashboard = ({ schools, lessons }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <InfoCard label="Total Schools" value={schools.length} color="blue" />
      <InfoCard label="Total Lessons" value={lessons.length} color="green" />
      <InfoCard label="Active Links" value={12} color="purple" />
    </div>
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
      <ActivityItem text='New school "Riverside Academy" added' time="2 hours ago" color="blue" />
      <ActivityItem text="Math lesson uploaded for Grade 5" time="4 hours ago" color="green" />
      <ActivityItem text="5 new lesson links generated" time="1 day ago" color="purple" />
    </div>

    {/* 👇 Add Chatbot inside the Dashboard */}
    <div className="mt-10">
      <h3 className="text-xl font-semibold mb-4">Need Help?</h3>
      <Chatbot />
    </div>
  </div>
);

// InfoCard Component
const InfoCard = ({ label, value, color }) => {
  const colorClasses = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', textHeader: 'text-blue-800', textValue: 'text-blue-600' },
    green: { bg: 'bg-green-50', border: 'border-green-200', textHeader: 'text-green-800', textValue: 'text-green-600' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', textHeader: 'text-purple-800', textValue: 'text-purple-600' }
  };
  const classes = colorClasses[color] || colorClasses.blue;
  return (
    <div className={`${classes.bg} ${classes.border} border rounded-lg p-4`}>
      <h3 className={`text-lg font-semibold ${classes.textHeader}`}>{label}</h3>
      <p className={`text-3xl font-bold ${classes.textValue}`}>{value}</p>
    </div>
  );
};

// ActivityItem Component
const ActivityItem = ({ text, time, color }) => {
  const borderClasses = { blue: 'border-blue-500', green: 'border-green-500', purple: 'border-purple-500' };
  const borderClass = borderClasses[color] || borderClasses.blue;
  return (
    <div className={`border-l-4 ${borderClass} pl-4 py-2`}>
      <p className="text-gray-800">{text}</p>
      <p className="text-sm text-gray-500">{time}</p>
    </div>
  );
};

// User Management Component
const UserManagement = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-2xl font-bold mb-6">User Management</h2>
    <button className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add New User</button>
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-50">
          <tr>
            {["Name", "Email", "Role", "Status", "Actions"].map(header => (
              <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">John Doe</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">john@example.com</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Admin</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
              <button className="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

// Settings Component
const Settings = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-2xl font-bold mb-6">System Settings</h2>
    <Section title="General Settings">
      <InputField label="System Name" defaultValue="Admin Panel" />
      <InputField label="Contact Email" defaultValue="admin@example.com" type="email" />
    </Section>
    <Section title="Notification Settings">
      {[
        { label: 'Email notifications for new schools', checked: true },
        { label: 'Email notifications for lesson uploads', checked: true },
        { label: 'SMS notifications', checked: false }
      ].map(({ label, checked }, idx) => (
        <label key={idx} className="flex items-center">
          <input type="checkbox" defaultChecked={checked} className="mr-2" />
          <span className="text-sm text-gray-700">{label}</span>
        </label>
      ))}
    </Section>
    <Section title="Security Settings">
      <div className="flex flex-wrap gap-3">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Change Password</button>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Enable Two-Factor Authentication</button>
      </div>
    </Section>
    <div className="pt-4">
      <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-800">Save Settings</button>
    </div>
  </div>
);

// Section component (capitalize to match usage)
const Section = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-3">{title}</h3>
    <div className="">{children}</div>
  </div>
);

const InputField = ({ label, defaultValue, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      defaultValue={defaultValue}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

// Main App Component
const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [schools, setSchools] = useState([]);
  const [lessons, setLessons] = useState([]);

  // NEW: Fallback sample data and API fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schoolsRes, lessonsRes] = await Promise.all([
          fetch('http://localhost:5000/api/schools'),
          fetch('http://localhost:5000/api/lessons')
        ]);
        if (schoolsRes.ok) setSchools(await schoolsRes.json());
        if (lessonsRes.ok) setLessons(await lessonsRes.json());
      } catch (err) {
        console.error('Failed to fetch data:', err);
        // Fallback sample data
        setSchools([{ id: 'S1', name: 'Springfield High' }]);
        setLessons([
          {
            id: 'L1',
            subject: 'Math',
            grade: 5,
            week: 3,
            techLevel: 'low',
            slidesLink: 'https://drive.google.com/example'
          }
        ]);
      }
    };
    fetchData();
  }, []);

  const renderContent = () => {
    console.log('Rendering tab:', activeTab); // Debug
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard schools={schools} lessons={lessons} />;
      case 'schools':
        return <SchoolManagement schools={schools} setSchools={setSchools} />;
      case 'lessons':
        return <LessonUpload lessons={lessons} setLessons={setLessons} />;
      case 'users':
        return <UserManagement />;
      case 'links':
        return <LinkGenerator schools={schools} lessons={lessons} />;
      case 'analytics':
        return <Analytics schools={schools} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard schools={schools} lessons={lessons} />;
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
                <main className="container mx-auto p-6">{renderContent()}</main>
              </>
            }
          />
          <Route path="/view" element={<ViewLesson />} />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;