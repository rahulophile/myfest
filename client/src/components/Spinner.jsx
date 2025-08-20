import React from 'react';

const Spinner = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto"></div>
        <p className="text-cyan-400 text-lg mt-4">Loading...</p>
      </div>
    </div>
  );
};

export default Spinner;
