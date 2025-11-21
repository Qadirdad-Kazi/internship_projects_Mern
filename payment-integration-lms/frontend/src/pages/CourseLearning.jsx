import React from 'react';
import { useParams } from 'react-router-dom';

const CourseLearning = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Course Learning - ID: {id}</h1>
        <div className="bg-white rounded-lg p-6">
          <p>Course learning interface will be implemented here...</p>
        </div>
      </div>
    </div>
  );
};

export default CourseLearning;