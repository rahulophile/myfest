import React from 'react';

const TechBackground = () => {
  return (
    <div 
      className="fixed inset-0 z-0"
      style={{
        backgroundImage: 'url(/images/homeBG.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: 'brightness(0.6) contrast(1.2)'
      }}
    />
  );
};

export default TechBackground; 