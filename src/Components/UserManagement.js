// UserManagement.js
import React from 'react';

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
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                            </span>
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

export default UserManagement;
