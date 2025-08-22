import React, { useState, useEffect, useRef, forwardRef } from "react";

// forwardRef ka use karenge taaki parent component iske position ko access kar sake
const DeveloperCredit = forwardRef(({ onClick, isModalOpen }, ref) => {
  const [position, setPosition] = useState({ top: "85%", left: "90%" });
  const intervalRef = useRef(null);

  useEffect(() => {
    const moveIcon = () => {
      const newTop = Math.random() * 70 + 15; // 15% to 85%
      const newLeft = Math.random() * 70 + 15; // 15% to 85%
      setPosition({ top: `${newTop}%`, left: `${newLeft}%` });
    };

    if (isModalOpen) {
      clearInterval(intervalRef.current);
    } else {
      moveIcon(); // Start with a random position
      intervalRef.current = setInterval(moveIcon, 7000); // Move every 7 seconds
    }

    return () => clearInterval(intervalRef.current);
  }, [isModalOpen]);

  return (
    <>
      <style>{`
        @keyframes float-light { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes orbit-fast { from { transform: rotate(0deg) translateX(35px) rotate(0deg); } to { transform: rotate(360deg) translateX(35px) rotate(-360deg); } }
        @keyframes orbit-slow { from { transform: rotate(0deg) translateX(40px) rotate(0deg); } to { transform: rotate(-360deg) translateX(40px) rotate(360deg); } }
        @keyframes blinking-cursor { 50% { opacity: 0; } }
        @keyframes core-glow {
          0%, 100% { box-shadow: 0 0 15px 3px rgba(10, 236, 234, 0.4); }
          50% { box-shadow: 0 0 25px 8px rgba(10, 236, 234, 0.2); }
        }
      `}</style>
      <button
        ref={ref}
        onClick={onClick}
        className={`fixed z-50 group transition-all duration-[3000ms] ease-in-out`}
        aria-label="Developer Details"
        style={{
          top: position.top,
          left: position.left,
          animation: isModalOpen
            ? "none"
            : "float-light 4s ease-in-out infinite",
        }}
      >
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Orbiting Particles */}
          <div
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{ animation: "orbit-fast 3s linear infinite" }}
          ></div>
          <div
            className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-70"
            style={{ animation: "orbit-slow 6s linear infinite" }}
          ></div>

          {/* Main Orb */}
          <div
            className="absolute inset-0 rounded-full bg-gray-900/50 border border-cyan-400/50"
            style={{ animation: "core-glow 3s ease-in-out infinite" }}
          ></div>

          {/* Coder Icon: { _ } */}
          <svg
            className="relative z-10 w-8 h-8 text-cyan-300 group-hover:text-white transition-colors duration-300"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 3H9V21H8V19C8 17.042 6.458 15.5 4.5 15.5V8.5C6.458 8.5 8 6.958 8 5V3Z"
            />
            <path
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 21H15V3H16V5C16 6.958 17.542 8.5 19.5 8.5V15.5C17.542 15.5 16 17.042 16 19V21Z"
            />
            <rect
              x="11"
              y="4"
              width="2"
              height="16"
              fill="currentColor"
              style={{ animation: "blinking-cursor 1.2s step-end infinite" }}
            />
          </svg>
        </div>
      </button>
    </>
  );
});

export default DeveloperCredit;
