// src/pages/NotFound.jsx

import React from 'react';
import { Link } from 'react-router-dom';
export const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-xl">
        <p className="text-9xl font-extrabold text-gray-800">404</p>
        <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-6">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};