import React, { useEffect, useRef, useState } from "react";

// System boot messages jo ek-ek karke aayenge
const bootUpLines = [
  "INITIALIZING V-OS...",
  "V-KERNEL V2.5 DETECTED",
  "LOADING CORE MODULES...",
  "MOUNTING VIRTUAL DOM...",
  "CONNECTING TO MATRIX_NODE_7...",
  "CONNECTION ESTABLISHED.",
  "DECRYPTING UI_PROTOCOLS...",
  "RENDERING INTERFACE...",
];

const SplashScreen = ({ onFinished }) => {
  const [progress, setProgress] = useState(0);
  const [bootMessage, setBootMessage] = useState("INITIALIZING...");
  const [phase, setPhase] = useState("booting"); // booting -> loading -> complete -> fade

  const bootAudioRef = useRef(null);
  const completeAudioRef = useRef(null);
  const glitchAudioRef = useRef(null);

  useEffect(() => {
    // Audio setup
    bootAudioRef.current = new Audio("/boot-sequence.mp3");
    completeAudioRef.current = new Audio("/boot-complete.mp3");
    glitchAudioRef.current = new Audio("/glitch-out.mp3");
    bootAudioRef.current.volume = 0.3;
    completeAudioRef.current.volume = 0.5;
    glitchAudioRef.current.volume = 0.4;

    bootAudioRef.current.play();

    // Booting messages animation
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      if (messageIndex < bootUpLines.length) {
        setBootMessage(bootUpLines[messageIndex]);
        messageIndex++;
      } else {
        clearInterval(messageInterval);
        setPhase("loading");
      }
    }, 400); // Har 400ms par naya message

    // Cleanup
    return () => clearInterval(messageInterval);
  }, []);

  // Loading progress bar animation
  useEffect(() => {
    if (phase === "loading") {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setPhase("complete");
            return 100;
          }
          return prev + 2; // Thoda fast
        });
      }, 50);

      return () => clearInterval(progressInterval);
    }
  }, [phase]);

  // Completion and fade out animation
  useEffect(() => {
    if (phase === "complete") {
      bootAudioRef.current.pause();
      completeAudioRef.current.play();
      setBootMessage("ACCESS GRANTED");

      const finishTimeout = setTimeout(() => {
        setPhase("fade");
        glitchAudioRef.current.play();
        setTimeout(onFinished, 500); // Animation ke baad finish call karein
      }, 1200);

      return () => clearTimeout(finishTimeout);
    }
  }, [phase, onFinished]);

  return (
    <>
      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes blink-cursor { 50% { opacity: 0; } }
        @keyframes text-glitch { 0%, 100% { transform: translate(0, 0) skewX(0); opacity: 1; } 20% { transform: translate(-3px, 2px) skewX(5deg); } 40% { transform: translate(3px, -2px) skewX(-5deg); } 60% { transform: translate(-2px, 1px) skewX(2deg); } 80% { transform: translate(1px, -2px) skewX(-2deg); } }
        .glitch-out { animation: text-glitch 0.5s forwards; }
        .progress-ring {
          stroke-dasharray: 283; /* 2 * PI * 45 */
          stroke-dashoffset: 283;
          transition: stroke-dashoffset 0.1s linear;
        }
      `}</style>
      <div
        className={`fixed inset-0 bg-black z-[100] flex items-center justify-center font-mono text-cyan-400 transition-opacity duration-500 ${
          phase === "fade" ? "opacity-0 glitch-out" : "opacity-100"
        }`}
      >
        <div className="w-full max-w-sm p-4 text-center">
          {/* Cybernetic Eye */}
          <div className="relative w-48 h-48 mx-auto mb-8">
            <div
              className="absolute inset-0 border-2 border-cyan-500/30 rounded-full animate-spin"
              style={{ animationName: "spin-slow", animationDuration: "10s" }}
            ></div>
            <div
              className="absolute inset-2 border-2 border-cyan-500/20 rounded-full animate-spin"
              style={{
                animationName: "spin-slow",
                animationDuration: "15s",
                animationDirection: "reverse",
              }}
            ></div>

            {/* Circular Progress Bar */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                stroke="#083344"
                strokeWidth="4"
              />
              <circle
                className="progress-ring"
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                stroke="#06b6d4"
                strokeWidth="4"
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                style={{ strokeDashoffset: 283 - (progress / 100) * 283 }}
              />
            </svg>

            {/* Percentage */}
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl font-bold text-white code-font">
                {Math.floor(progress)}
                <span className="text-2xl">%</span>
              </span>
            </div>
          </div>

          {/* Status Text */}
          <p className="text-lg text-white/90 h-6">
            {bootMessage}
            <span
              className="w-2 h-4 bg-cyan-400 inline-block ml-1"
              style={{ animation: "blink-cursor 1s step-end infinite" }}
            ></span>
          </p>
        </div>
      </div>
    </>
  );
};

export default SplashScreen;
