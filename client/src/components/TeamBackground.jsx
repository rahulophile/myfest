import React from 'react';

const TechBackground = () => {
  return (
    <div 
      className="fixed inset-0 z-0"
      style={{
        backgroundImage: 'url(/images/teamBG.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: 'brightness(0.3) contrast(1.2)'
      }}
    />
  );
};

export default TechBackground; 