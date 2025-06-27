import React from 'react';

const NotFound = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Lesson Not Found</h2>
      <p className="text-gray-600">No lesson matches the provided criteria.</p>
    </div>
  </div>
);

export default NotFound;