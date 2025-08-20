import React from 'react';

const DeveloperModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-lg glass-card rounded-2xl border border-cyan-400/30 shadow-2xl shadow-cyan-500/20">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="p-8 flex flex-col md:flex-row items-center gap-8">
          {/* Profile Picture */}
          <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-full bg-gradient-to-br from-cyan-900 via-gray-800 to-gray-900 border-2 border-cyan-400/50 flex items-center justify-center">
            {/* APNI PHOTO YA INITIAL YAHA DAALEIN */}
            <span className="text-white text-6xl font-bold code-font" style={{ textShadow: '0 0 10px rgba(10, 236, 234, 0.7)' }}>
              R
            </span>
          </div>

          {/* Details */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-white code-font">
              Rahul Raj {/* APNA NAAM YAHA DAALEIN */}
            </h2>
            <p className="text-cyan-400 font-medium mt-1">
              MERN Stack Developer & Data Science Enthusiast {/* APNA ROLE YAHA DAALEIN */}
            </p>
            <p className="text-gray-300 mt-4 text-sm">
              Crafting immersive digital experiences with a passion for clean code and futuristic design. Let's build something amazing together. @codebyrahulophile {/* APNA BIO YAHA DAALEIN */}
            </p>

            {/* Social Links */}
            <div className="mt-6 flex justify-center md:justify-start gap-4">
              <SocialLink href="https://github.com/rahulophile" icon={<IconGitHub />} />
              <SocialLink href="https://linkedin.com/in/rahulophile" icon={<IconLinkedIn />} />
              <SocialLink href="https://twitter.com/rahulophile" icon={<IconTwitter />} />
              <SocialLink href="mailto:rahultime2018@gmail.com" icon={<IconEmail />} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components for Social Links and Icons
const SocialLink = ({ href, icon }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors">
    {icon}
  </a>
);

const IconGitHub = () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>;
const IconLinkedIn = () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.07c.67-1.27 2.3-2.6 4.73-2.6 5.06 0 5.99 3.33 5.99 7.66V24h-5V16.2c0-1.86-.03-4.25-2.59-4.25-2.6 0-3 2.02-3 4.12V24h-5V8z"/></svg>;
const IconTwitter = () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21l-6.51 7.44L22.5 22h-6.9l-4.54-5.83L5.76 22H3l6.97-7.97L1.5 2h6.9l4.11 5.28L18.244 2zm-2.42 18h1.94L8.27 4H6.33l9.495 16z"/></svg>;
const IconEmail = () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/></svg>;


export default DeveloperModal;