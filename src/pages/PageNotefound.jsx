import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-9xl font-extrabold text-black tracking-widest">
          404
        </h1>
        <div className="text-5xl mt-8 font-bold">
          <span className="text-gray-500">Oops!</span> Page not found
        </div>
        <p className="text-2xl mt-4 mb-8 font-medium text-gray-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex justify-center items-center space-x-4">
          <Link
            to="/"
            className="px-6 py-3 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition duration-300 ease-in-out"
          >
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-white text-black font-semibold rounded-md border-2 border-black hover:bg-gray-100 transition duration-300 ease-in-out"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

