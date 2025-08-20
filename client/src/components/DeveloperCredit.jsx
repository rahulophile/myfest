import React from 'react';

const DeveloperCredit = ({ onClick }) => {
  return (
    <>
      {/* CSS Animations ko component ke andar hi define kar rahe hain */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(10, 236, 234, 0.4)); }
          50% { filter: drop-shadow(0 0 16px rgba(10, 236, 234, 0.8)); }
        }
        @keyframes orbit-zero {
          from { transform: rotate(0deg) translateX(35px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(35px) rotate(-360deg); }
        }
        @keyframes orbit-one {
          from { transform: rotate(180deg) translateX(35px) rotate(-180deg); }
          to { transform: rotate(540deg) translateX(35px) rotate(-540deg); }
        }
        @keyframes blinking-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      <button
        onClick={onClick}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Developer Details"
        style={{ animation: 'float 4s ease-in-out infinite' }}
      >
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Core Glassmorphism Orb with Glow */}
          <div 
            className="absolute inset-0 rounded-full glass-card border border-cyan-400/30 group-hover:border-cyan-400/80 transition-all duration-300"
            style={{ animation: 'glow 3s ease-in-out infinite' }}
          ></div>
          
          {/* Orbiting Binary Particles */}
          <span 
            className="absolute w-4 h-4 text-xs text-cyan-300 flex items-center justify-center"
            style={{ animation: 'orbit-zero 8s linear infinite' }}
          >
            0
          </span>
          <span 
            className="absolute w-4 h-4 text-xs text-cyan-300 flex items-center justify-center"
            style={{ animation: 'orbit-one 8s linear infinite' }}
          >
            1
          </span>

          {/* Coder Icon: { _ } */}
          <svg 
            className="relative z-10 w-8 h-8 text-cyan-400 group-hover:text-white transition-colors duration-300 group-hover:scale-110"
            fill="none" viewBox="0 0 24 24"
          >
            {/* Curly Braces */}
            <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M8 3H9V21H8V19C8 17.042 6.458 15.5 4.5 15.5V8.5C6.458 8.5 8 6.958 8 5V3Z" />
            <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M16 21H15V3H16V5C16 6.958 17.542 8.5 19.5 8.5V15.5C17.542 15.5 16 17.042 16 19V21Z" />
            {/* Blinking Cursor */}
            <rect x="11" y="4" width="2" height="16" fill="currentColor" style={{ animation: 'blinking-cursor 1.2s step-end infinite' }} />
          </svg>
        </div>
      </button>
    </>
  );
};

export default DeveloperCredit;