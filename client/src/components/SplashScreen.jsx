import React, { useEffect, useState } from "react";

// Animation ke stages
const stages = [
  { progress: 0, text: "Calibrating Robotic Arm..." },
  { progress: 25, text: "Assembling RoboCar Chassis..." },
  { progress: 50, text: "Integrating Humanoid AI Core..." },
  { progress: 75, text: "Deploying Spider-Drone Scout..." },
  { progress: 100, text: "SYSTEM ONLINE. Welcome to Vision'25" },
];

// --- SVG ICON COMPONENTS ---
const IconRoboArm = () => (
  <svg
    viewBox="0 0 64 64"
    className="w-full h-full text-cyan-400 drop-shadow-[0_0_10px_#06b6d4]"
  >
    {" "}
    <path
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 52 V 32 H 24 L 32 24 L 40 32 L 48 24 L 52 28"
      fill="none"
    />{" "}
    <circle cx="12" cy="52" r="4" fill="currentColor" />{" "}
    <circle
      cx="28"
      cy="28"
      r="3"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />{" "}
  </svg>
);
const IconRoboCar = () => (
  <svg
    viewBox="0 0 64 64"
    className="w-full h-full text-cyan-400 drop-shadow-[0_0_10px_#06b6d4]"
  >
    {" "}
    <rect
      x="12"
      y="30"
      width="40"
      height="16"
      rx="4"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />{" "}
    <circle cx="20" cy="50" r="6" fill="currentColor" />{" "}
    <circle cx="44" cy="50" r="6" fill="currentColor" />{" "}
    <path
      d="M24 30 L 28 22 H 36 L 40 30"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />{" "}
  </svg>
);
const IconHumanoid = () => (
  <svg
    viewBox="0 0 64 64"
    className="w-full h-full text-cyan-400 drop-shadow-[0_0_10px_#06b6d4]"
  >
    {" "}
    <circle
      cx="32"
      cy="18"
      r="6"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />{" "}
    <path d="M32 24 V 44" stroke="currentColor" strokeWidth="2" />{" "}
    <path d="M22 32 H 42" stroke="currentColor" strokeWidth="2" />{" "}
    <path d="M32 44 L 26 58" stroke="currentColor" strokeWidth="2" />{" "}
    <path d="M32 44 L 38 58" stroke="currentColor" strokeWidth="2" />{" "}
  </svg>
);
const IconSpiderBot = () => (
  <svg
    viewBox="0 0 64 64"
    className="w-full h-full text-cyan-400 drop-shadow-[0_0_10px_#06b6d4]"
  >
    {" "}
    <circle cx="32" cy="32" r="8" fill="currentColor" />{" "}
    <path d="M32 40 L 20 54" stroke="currentColor" strokeWidth="2" />{" "}
    <path d="M32 40 L 44 54" stroke="currentColor" strokeWidth="2" />{" "}
    <path d="M32 24 L 20 10" stroke="currentColor" strokeWidth="2" />{" "}
    <path d="M32 24 L 44 10" stroke="currentColor" strokeWidth="2" />{" "}
    <path d="M24 32 L 10 32" stroke="currentColor" strokeWidth="2" />{" "}
    <path d="M40 32 H 54" stroke="currentColor" strokeWidth="2" />{" "}
  </svg>
);
const IconVisionLogo = () => (
  <div className="text-5xl font-extrabold text-white flex items-center justify-center h-full">
    <span className="tech-outline">V'25</span>
  </div>
);

const stageIcons = [
  <IconRoboArm />,
  <IconRoboCar />,
  <IconHumanoid />,
  <IconSpiderBot />,
  <IconVisionLogo />,
];

const SplashScreen = ({ onFinished }) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Stage change interval
    const stageInterval = setInterval(() => {
      setCurrentStageIndex((prev) =>
        prev < stages.length - 1 ? prev + 1 : prev
      );
    }, 2000); // Har 2 second mein stage change

    return () => clearInterval(stageInterval);
  }, []);

  // Progress bar animation
  useEffect(() => {
    const targetProgress = stages[currentStageIndex].progress;
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < targetProgress) {
          return prev + 1;
        }
        if (prev >= 100) {
          clearInterval(progressInterval);
          // 100% hone ke baad thoda ruk kar fade out karein
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(onFinished, 1000); // Fade-out ke baad finish
          }, 1500);
        }
        return prev;
      });
    }, 20); // Speed of progress bar filling

    return () => clearInterval(progressInterval);
  }, [currentStageIndex, onFinished]);

  return (
    <>
      <style>{`
        @keyframes text-glitch { 0%, 100% { transform: translate(0, 0) skewX(0); opacity: 1; } 20% { transform: translate(-3px, 2px) skewX(5deg); } 40% { transform: translate(3px, -2px) skewX(-5deg); } 60% { transform: translate(-2px, 1px) skewX(2deg); } 80% { transform: translate(1px, -2px) skewX(-2deg); } }
        .glitch-out { animation: text-glitch 0.5s forwards; }
      `}</style>
      <div
        className={`fixed inset-0 bg-black z-[100] flex items-center justify-center transition-opacity duration-1000 ${
          isFadingOut ? "opacity-0 glitch-out" : "opacity-100"
        }`}
      >
        <div className="w-full max-w-lg p-4 text-center">
          {/* Animated Icons Container */}
          <div className="relative h-48 w-48 mx-auto mb-8">
            {stages.map((stage, index) => (
              <div
                key={index}
                className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out"
                style={{
                  opacity: currentStageIndex === index ? 1 : 0,
                  transform: `scale(${currentStageIndex === index ? 1 : 0.8})`,
                }}
              >
                {stageIcons[index]}
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-sm mx-auto">
            <div className="h-2 bg-cyan-900/50 rounded-full overflow-hidden border border-cyan-500/30">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 rounded-full transition-all duration-300"
                style={{ width: `${progress}%`, boxShadow: "0 0 10px #06b6d4" }}
              ></div>
            </div>

            {/* Status Text */}
            <div className="relative h-8 mt-4 text-white/80 font-mono">
              <p className="absolute inset-0 transition-opacity duration-500">
                {stages[currentStageIndex].text} [{Math.floor(progress)}%]
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SplashScreen;
