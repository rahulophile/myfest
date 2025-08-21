import React, { useEffect, useRef, useState } from 'react';

const SplashScreen = ({ onFinished }) => {
  const [phase, setPhase] = useState('enter'); // 'enter', 'clash', 'boom', 'fade'
  const clashAudioRef = useRef(null);
  const boomAudioRef = useRef(null);

  useEffect(() => {
    // Audio elements create karein
    clashAudioRef.current = new Audio('/clash-sound.mp3');
    boomAudioRef.current = new Audio('/boom-sound.mp3');
    clashAudioRef.current.volume = 0.5;
    boomAudioRef.current.volume = 0.7;

    // Phase 1: Eyes enter (1.5 seconds)
    setTimeout(() => {
      setPhase('clash');
      clashAudioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }, 1500);

    // Phase 2: Clash (4.5 seconds)
    setTimeout(() => {
      setPhase('boom');
      clashAudioRef.current.pause();
      boomAudioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }, 6000); // 1.5s + 4.5s

    // Phase 3: Boom & Fade (1 second)
    setTimeout(() => {
      setPhase('fade');
      setTimeout(onFinished, 500); // Fade out ke baad onFinished call karein
    }, 7000); // 6s + 1s

    // Cleanup
    return () => {
      if (clashAudioRef.current) clashAudioRef.current.pause();
    };
  }, [onFinished]);

  return (
    <>
      <style>{`
        /* --- KEYFRAMES --- */
        @keyframes slideInLeft { from { transform: translate(-100%, -50%); } to { transform: translate(0, -50%); } }
        @keyframes slideInRight { from { transform: translate(100%, -50%); } to { transform: translate(0, -50%); } }
        @keyframes screenShake { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(2px, -2px); } 50% { transform: translate(-2px, 2px); } 75% { transform: translate(2px, 2px); } }
        @keyframes energyBeam { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes particleBurst {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes boom {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
        }

        /* --- STYLES --- */
        .splash-container { position: fixed; inset: 0; background-color: #000; z-index: 100; overflow: hidden; }
        .eye { position: absolute; top: 50%; width: 200px; height: auto; }
        .hero-eye { left: 0; animation: slideInLeft 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        .evil-eye { right: 0; animation: slideInRight 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        .beam-container { position: absolute; top: 50%; width: 50%; height: 100%; overflow: hidden; }
        .beam { position: absolute; top: 50%; height: 4px; background: currentColor; box-shadow: 0 0 15px 3px currentColor; }
        .hero-beam-container { left: 0; }
        .evil-beam-container { right: 0; }
        .hero-beam { color: #06b6d4; right: 0; transform-origin: right; animation: energyBeam 0.5s ease-out 1.5s forwards; }
        .evil-beam { color: #ef4444; left: 0; transform-origin: left; animation: energyBeam 0.5s ease-out 1.5s forwards; }
        .clash-point { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100px; height: 100px; animation: screenShake 0.1s linear infinite; }
        .particle { position: absolute; border-radius: 50%; background: white; animation: particleBurst 0.5s ease-out forwards; }
        .boom-effect { position: absolute; top: 50%; left: 50%; width: 100vw; height: 100vw; border-radius: 50%; background: white; animation: boom 0.5s ease-out forwards; }
      `}</style>

      <div className={`splash-container transition-opacity duration-500 ${phase === 'fade' ? 'opacity-0' : 'opacity-100'}`}>
        {/* Hero Eye (Left) */}
        <div className="hero-eye eye">
          <img src="/hero-eye.png" alt="Hero Eye" />
        </div>

        {/* Evil Eye (Right) */}
        <div className="evil-eye eye">
          <img src="/evil-eye.png" alt="Evil Eye" />
        </div>

        {/* Beams and Clash Effect */}
        {phase === 'clash' && (
          <>
            <div className="hero-beam-container">
              <div className="hero-beam w-full"></div>
            </div>
            <div className="evil-beam-container">
              <div className="evil-beam w-full"></div>
            </div>
            {/* Particle burst at clash point */}
            <div className="clash-point">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="particle"
                  style={{
                    backgroundColor: Math.random() > 0.5 ? '#06b6d4' : '#ef4444',
                    width: `${Math.random() * 6 + 2}px`,
                    height: `${Math.random() * 6 + 2}px`,
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${Math.random() * 360}deg) translateX(${Math.random() * 50}px) scale(0)`,
                    animationDelay: `${Math.random() * 0.1}s`,
                    animationDuration: `${Math.random() * 0.4 + 0.3}s`
                  }}
                />
              ))}
            </div>
          </>
        )}
        
        {/* Boom Effect */}
        {phase === 'boom' && <div className="boom-effect"></div>}
      </div>
    </>
  );
};

export default SplashScreen;