import React, { useLayoutEffect, useState } from 'react';
import { FaGlobe } from 'react-icons/fa';


const DeveloperModal = ({ isOpen, onClose, targetRef }) => {
  const [position, setPosition] = useState({ top: -9999, left: -9999, opacity: 0 });
  const [arrowClass, setArrowClass] = useState('');

  useLayoutEffect(() => {
    if (isOpen && targetRef.current) {
      const iconRect = targetRef.current.getBoundingClientRect();
      const modalWidth = window.innerWidth < 480 ? window.innerWidth - 32 : 360; // Mobile par chhota
      const modalHeight = 230; // Approx height
      const gap = 25; // Icon aur modal ke beech ka space

      let pos = { x: 0, y: 0 };
      let arrClass = '';

      // Check right side space
      if (window.innerWidth - iconRect.right > modalWidth + gap) {
        pos.x = iconRect.right + gap;
        pos.y = iconRect.top + iconRect.height / 2 - modalHeight / 2;
        arrClass = 'top-1/2 -left-2 -translate-y-1/2 rotate-[-45deg]';
      } 
      // Check left side space
      else if (iconRect.left > modalWidth + gap) {
        pos.x = iconRect.left - modalWidth - gap;
        pos.y = iconRect.top + iconRect.height / 2 - modalHeight / 2;
        arrClass = 'top-1/2 -right-2 -translate-y-1/2 rotate-[135deg]';
      }
      // Check bottom space
      else if (window.innerHeight - iconRect.bottom > modalHeight + gap) {
        pos.x = iconRect.left + iconRect.width / 2 - modalWidth / 2;
        pos.y = iconRect.bottom + gap;
        arrClass = '-top-2 left-1/2 -translate-x-1/2 rotate-[-135deg]';
      }
      // Default to top
      else {
        pos.x = iconRect.left + iconRect.width / 2 - modalWidth / 2;
        pos.y = iconRect.top - modalHeight - gap;
        arrClass = '-bottom-2 left-1/2 -translate-x-1/2 rotate-[45deg]';
      }
      
      // Boundary checks
      if (pos.x < 16) pos.x = 16;
      if (pos.x + modalWidth > window.innerWidth - 16) pos.x = window.innerWidth - modalWidth - 16;
      if (pos.y < 16) pos.y = 16;
      if (pos.y + modalHeight > window.innerHeight - 16) pos.y = window.innerHeight - modalHeight - 16;
      
      setPosition({ top: pos.y, left: pos.x, opacity: 1 });
      setArrowClass(arrClass);
    }
  }, [isOpen, targetRef]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]"> {/* z-index 60, taaki icon (z-50) ke upar aaye */}
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className="absolute w-[90vw] max-w-sm glass-card rounded-2xl border border-cyan-400/30 shadow-2xl shadow-cyan-500/20 transition-all duration-300 ease-out"
        style={{ top: `${position.top}px`, left: `${position.left}px`, opacity: position.opacity }}
      >
        <div className={`absolute w-4 h-4 bg-[#1e2d42] border-b-2 border-r-2 border-cyan-400/50 ${arrowClass}`}></div>
        
        <div className="p-6">
          <div className="flex items-center gap-4">
            <img src="./images/DP.webp" alt="Rahul Raj" className="w-16 h-16 rounded-full border-2 border-cyan-400" />
            <div>
              <p className="text-cyan-400 font-medium text-xs tracking-widest">DESIGNER & DEVELOPER</p>
              <h2 className="text-2xl font-bold text-white code-font mt-1">Rahul Raj</h2>
            </div>
          </div>
          <p className="text-gray-300 mt-4 text-sm">
            "Crafting immersive digital experiences with a passion for clean code and futuristic design. Let's build something amazing together." 
          </p>
          <div className="mt-4 flex justify-start gap-4 border-t border-gray-700/50 pt-4">
          <SocialLink href="https://rahulophile.me/" icon={<FaGlobe className="w-5 h-5" title="Website" />} />
            <SocialLink href="https://github.com/rahulophile" icon={<IconGitHub />} />
            <SocialLink href="https://linkedin.com/in/rahulophile" icon={<IconLinkedIn />} />
            <SocialLink href="https://twitter.com/rahulophile" icon={<IconTwitter />} />
            <SocialLink href="mailto:rahultime2018@gmail.com" icon={<IconEmail />} />
            
          </div>
        </div>
      </div>
    </div>
  );
};
const SocialLink = ({ href, icon }) => ( <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors">{icon}</a> );
const IconGitHub = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>;
const IconLinkedIn = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.07c.67-1.27 2.3-2.6 4.73-2.6 5.06 0 5.99 3.33 5.99 7.66V24h-5V16.2c0-1.86-.03-4.25-2.59-4.25-2.6 0-3 2.02-3 4.12V24h-5V8z"/></svg>;
const IconTwitter = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21l-6.51 7.44L22.5 22h-6.9l-4.54-5.83L5.76 22H3l6.97-7.97L1.5 2h6.9l4.11 5.28L18.244 2zm-2.42 18h1.94L8.27 4H6.33l9.495 16z"/></svg>;
const IconEmail = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/></svg>;
const IconWebsite = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10
             10-4.48 10-10S17.52 2 12 2zm6.93 6h-3.16c-.29-1.51-.86-2.89-1.64-4.03
             2.09.9 3.69 2.65 4.8 4.78zM12 4c.82 1.08 1.5 2.5 1.89 4H10.11c.39-1.5 1.07-2.92 1.89-4zM4.27 10
             A8.03 8.03 0 0 1 7.07 5.97c-.79 1.14-1.35 2.52-1.64 4.03H4.27zM4.07 14h1.16c.29 1.51.86 2.89 1.64 4.03
             A8.03 8.03 0 0 1 4.07 14zM10.11 20c-.39-1.5-1.07-2.92-1.89-4h5.56c-.82 1.08-1.5 2.5-1.89 4zM16.93 18.03
             c.79-1.14 1.35-2.52 1.64-4.03h1.16a8.03 8.03 0 0 1-2.8 4.03zM18.57 10h-1.16c-.29-1.51-.86-2.89-1.64-4.03
             A8.03 8.03 0 0 1 18.57 10zM8.24 14c.49 1.33 1.19 2.52 2.04 3.44.85-.91 1.55-2.1 2.04-3.44H8.24zm7.52 0
             c-.49 1.33-1.19 2.52-2.04 3.44.85-.91 1.55-2.1 2.04-3.44zM8.24 10h7.52c-.49-1.33-1.19-2.52-2.04-3.44
             -.85.91-1.55 2.1-2.04 3.44z" />
  </svg>
);




export default DeveloperModal;