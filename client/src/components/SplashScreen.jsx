import React, { useEffect, useRef, useState } from "react";

// System boot messages jo ek-ek karke aayenge
const bootUpLines = [
  "INITIALIZING VISION_OS...",
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
  const [bootMessages, setBootMessages] = useState([]);
  const [phase, setPhase] = useState("booting"); // booting -> loading -> complete -> fade

  const bootAudioRef = useRef(null);
  const completeAudioRef = useRef(null);
  const glitchAudioRef = useRef(null);

  useEffect(() => {
    // Audio setup
    bootAudioRef.current = new Audio("/clash-sound.mp3");
    completeAudioRef.current = new Audio("/boom-sound.mp3");
    glitchAudioRef.current = new Audio("/boom-sound.mp3");
    bootAudioRef.current.volume = 0.3;
    completeAudioRef.current.volume = 0.5;
    glitchAudioRef.current.volume = 0.4;

    // --- Animation Sequence ---

    // 1. Booting Messages
    bootAudioRef.current.play();
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      setBootMessages((prev) => [...prev, bootUpLines[messageIndex]]);
      messageIndex++;
      if (messageIndex === bootUpLines.length) {
        clearInterval(messageInterval);
        setTimeout(() => setPhase("loading"), 500); // Start loading after last message
      }
    }, 300); // Har 300ms par naya message

    // Cleanup for timeouts
    const timeouts = [];

    return () => {
      clearInterval(messageInterval);
      timeouts.forEach(clearTimeout);
      if (bootAudioRef.current) bootAudioRef.current.pause();
    };
  }, []);

  // 2. Loading Progress Bar (yeh phase change par trigger hoga)
  useEffect(() => {
    if (phase === "loading") {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => setPhase("complete"), 200);
            return 100;
          }
          return prev + 1;
        });
      }, 30); // 3 seconds mein 0 se 100

      return () => clearInterval(progressInterval);
    }
  }, [phase]);

  // 3. Completion and Fade out
  useEffect(() => {
    if (phase === "complete") {
      bootAudioRef.current.pause();
      completeAudioRef.current.play();

      const fadeTimeout = setTimeout(() => setPhase("fade"), 1000); // 1s tak "SYSTEM INITIALIZED" dikhayein
      const finishTimeout = setTimeout(() => {
        glitchAudioRef.current.play();
        onFinished();
      }, 1500); // 0.5s fade out ke liye

      return () => {
        clearTimeout(fadeTimeout);
        clearTimeout(finishTimeout);
      };
    }
  }, [phase, onFinished]);

  return (
    <>
      <style>{`
        @keyframes blinking-cursor { 50% { opacity: 0; } }
        @keyframes text-glitch { 0%, 100% { transform: translate(0, 0); } 20% { transform: translate(-2px, 2px); } 40% { transform: translate(2px, -2px); } 60% { transform: translate(-1px, 1px); } 80% { transform: translate(1px, -1px); } }
        .glitch-out { animation: text-glitch 0.3s forwards; }
      `}</style>
      <div
        className={`fixed inset-0 bg-black z-[100] flex items-center justify-center font-mono text-green-400 transition-opacity duration-500 ${
          phase === "fade" ? "opacity-0 glitch-out" : "opacity-100"
        }`}
      >
        <div className="w-full max-w-2xl p-4">
          {/* Booting Messages */}
          {phase === "booting" && (
            <div>
              {bootMessages.map((msg, i) => (
                <p key={i}>&gt; {msg}</p>
              ))}
              <span
                className="w-2 h-4 bg-green-400 inline-block"
                style={{ animation: "blinking-cursor 1s step-end infinite" }}
              ></span>
            </div>
          )}

          {/* Loading Progress */}
          {(phase === "loading" || phase === "complete") && (
            <div className="text-center">
              <p className="text-2xl mb-4">[ {Math.floor(progress)}% ]</p>
              <div className="w-full h-4 bg-green-900/50 border border-green-500 p-0.5">
                <div
                  className="h-full bg-green-500 transition-all duration-100"
                  style={{
                    width: `${progress}%`,
                    boxShadow: "0 0 10px #22c55e",
                  }}
                ></div>
              </div>
              {phase === "complete" && (
                <p className="text-xl mt-4 text-white animate-pulse">
                  SYSTEM INITIALIZED... ACCESS GRANTED
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SplashScreen;
