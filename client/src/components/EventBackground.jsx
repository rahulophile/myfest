import React from 'react';

const EventBackground = () => {
  return (
    <div 
      className="fixed inset-0 z-0"
      style={{
        backgroundImage: 'url(/images/eventBG.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: 'brightness(0.5) contrast(1.2)'
      }}
    />
  );
};

export default EventBackground; 