import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';



const Gallery = () => {
  // We will keep the data structure but show a "coming soon" message
  // const [selectedCategory, setSelectedCategory] = useState('all');
  // const categories = ['all', 'Technical Events', 'Cultural Events', 'Workshops', 'Award Ceremony', 'Campus Life'];

  return (
    <>
    <Helmet>
    <title>Gallery | Vision'25 Tech Fest</title>
    <meta name="description" content="Relive the moments from Vision'25. Browse through photos of technical events, cultural celebrations, and workshops at GEC Vaishali." />
    <link rel="canonical" href="https://visiongecv.in/gallery" />
    <meta property="og:title" content="Gallery | Vision'25 Tech Fest" />
    <meta property="og:description" content="Relive the moments from Vision'25 at GEC Vaishali." />
  </Helmet>
      <div className="relative z-10">
        {/* Header */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Event </span>
              <span className="tech-outline">Gallery</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Relive the amazing moments from Vision Fest 25. Every image tells a story of innovation and creativity!
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* "Coming Soon" Message */}
          <div className="text-center lg:py-20 py-5">
            <div className="glass-card rounded-2xl p-10 inline-block border border-cyan-400/30">
              <div className="w-24 h-24 bg-cyan-900/50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/10">
                <svg className="w-12 h-12 text-cyan-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Gallery Uploading Soon!
              </h3>
              <p className="text-gray-300 max-w-md mx-auto">
                Our team is busy capturing the best moments of Vision Fest 25. Check back soon to see the photos and videos from all our exciting events!
              </p>
            </div>
          </div>

          {/* Upload Section (Optional, can be kept) */}
          
        </div>
      </div>
      </>
  );
};

export default Gallery;