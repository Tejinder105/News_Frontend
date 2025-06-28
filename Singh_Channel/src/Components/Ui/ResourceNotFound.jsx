import React from 'react';
import { Link } from 'react-router-dom';

function ResourceNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-6">Sorry, the resource you're looking for was not found.</p>
      <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        Go Back Home
      </Link>
    </div>
  );
}

export default ResourceNotFound;
