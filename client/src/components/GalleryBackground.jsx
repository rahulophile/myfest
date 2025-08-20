import React from 'react';

const GalleryBackground = () => {
  return (
    <div 
      className="fixed inset-0 z-0"
      style={{
        backgroundImage: 'url(/images/galleryBG.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: 'brightness(0.4) contrast(1.2)'
      }}
    />
  );
};

export default GalleryBackground; 