import React, { useEffect, useState } from 'react';

const SuccessAnimation = ({
  isVisible,
  onClose,
  title = "Success!",
  message = "Operation completed successfully!",
  type = "success" // success, error, warning, info
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let timer;
    if (isVisible) {
      // Small delay to allow CSS to apply before animation starts
      timer = setTimeout(() => setIsAnimating(true), 50);
      const closeTimer = setTimeout(() => {
        setIsAnimating(false);
        // Delay closing to allow outro animation to finish
        setTimeout(onClose, 500);
      }, 4000); // Auto close after 4 seconds

      return () => {
        clearTimeout(timer);
        clearTimeout(closeTimer);
      }
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  // --- Theme Configuration ---
  const themes = {
    success: {
      icon: <IconSuccess />,
      color: 'cyan',
      shadow: 'shadow-cyan-500/50',
      gradient: 'from-cyan-500 to-blue-600',
    },
    error: {
      icon: <IconError />,
      color: 'red',
      shadow: 'shadow-red-500/50',
      gradient: 'from-red-500 to-orange-600',
    },
    warning: {
      icon: <IconWarning />,
      color: 'amber',
      shadow: 'shadow-amber-500/50',
      gradient: 'from-amber-500 to-yellow-600',
    },
    info: {
      icon: <IconInfo />,
      color: 'indigo',
      shadow: 'shadow-indigo-500/50',
      gradient: 'from-indigo-500 to-purple-600',
    }
  };
  const theme = themes[type] || themes.success;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-500 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div
        className={`
          relative w-full max-w-md mx-auto glass-card rounded-2xl border border-${theme.color}-500/30
          shadow-2xl ${theme.shadow} transition-all duration-500 ease-out
          ${isAnimating ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 -translate-y-4'}
        `}
      >
        {/* Decorative Corner Brackets */}
        <CornerBracket position="top-2 left-2" />
        <CornerBracket position="top-2 right-2" transform="rotate-90" />
        <CornerBracket position="bottom-2 left-2" transform="rotate-270" />
        <CornerBracket position="bottom-2 right-2" transform="rotate-180" />
        
        <div className="p-8 text-center">
          {/* Animated Icon */}
          <div className="mb-6">
            <div className={`
              inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-800/50
              border-2 border-${theme.color}-500/50 transition-all duration-700
              ${isAnimating ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
            `}>
              <div className={`transition-transform duration-1000 delay-200 ${isAnimating ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}`}>
                {theme.icon}
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className={`
            text-2xl font-bold mb-3 text-white code-font transition-all duration-700 delay-200
            ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            {title}
          </h3>

          {/* Message */}
          <p className={`
            text-gray-300 mb-8 transition-all duration-700 delay-300
            ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            {message}
          </p>

          {/* Auto-close Progress Bar */}
          <div className="absolute bottom-4 left-4 right-4 h-1 bg-gray-700/50 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${theme.gradient} transition-all duration-3000 ease-linear rounded-full`}
              style={{ width: isAnimating ? '100%' : '0%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

// Corner bracket for techy HUD feel
const CornerBracket = ({ position, transform = '' }) => (
  <div className={`absolute ${position} w-6 h-6 pointer-events-none text-cyan-400/30 ${transform}`}>
    <svg fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeWidth="2" d="M22 2H12C6.477 2 2 6.477 2 12v10" />
    </svg>
  </div>
);

// Animated Icon Components
const IconSuccess = () => (
  <svg className="w-12 h-12 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path className="path-check" d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline className="path-tick" points="22 4 12 14.01 9 11.01" />
    <style>{`
      .path-check { stroke-dasharray: 200; stroke-dashoffset: 200; animation: draw 1s ease-out 0.5s forwards; }
      .path-tick { stroke-dasharray: 50; stroke-dashoffset: 50; animation: draw 0.5s ease-out 1.5s forwards; }
      @keyframes draw { to { stroke-dashoffset: 0; } }
    `}</style>
  </svg>
);

const IconError = () => (
  <svg className="w-12 h-12 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle className="path-circle" cx="12" cy="12" r="10" />
    <line className="path-line1" x1="15" y1="9" x2="9" y2="15" />
    <line className="path-line2" x1="9" y1="9" x2="15" y2="15" />
    <style>{`
      .path-circle { stroke-dasharray: 200; stroke-dashoffset: 200; animation: draw 1s ease-out 0.5s forwards; }
      .path-line1, .path-line2 { stroke-dasharray: 50; stroke-dashoffset: 50; animation: draw 0.5s ease-out 1.5s forwards; }
    `}</style>
  </svg>
);

const IconWarning = () => (
  <svg className="w-12 h-12 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path className="path-triangle" d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line className="path-line1" x1="12" y1="9" x2="12" y2="13" />
    <line className="path-line2" x1="12" y1="17" x2="12.01" y2="17" />
    <style>{`
      .path-triangle { stroke-dasharray: 200; stroke-dashoffset: 200; animation: draw 1s ease-out 0.5s forwards; }
      .path-line1, .path-line2 { opacity: 0; animation: fade-in 0.5s ease-out 1.5s forwards; }
      @keyframes draw { to { stroke-dashoffset: 0; } }
      @keyframes fade-in { to { opacity: 1; } }
    `}</style>
  </svg>
);

const IconInfo = () => (
  <svg className="w-12 h-12 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle className="path-circle" cx="12" cy="12" r="10" />
    <line className="path-line1" x1="12" y1="16" x2="12" y2="12" />
    <line className="path-line2" x1="12" y1="8" x2="12.01" y2="8" />
    <style>{`
      .path-circle { stroke-dasharray: 200; stroke-dashoffset: 200; animation: draw 1s ease-out 0.5s forwards; }
      .path-line1, .path-line2 { opacity: 0; animation: fade-in 0.5s ease-out 1.5s forwards; }
    `}</style>
  </svg>
);


export default SuccessAnimation;