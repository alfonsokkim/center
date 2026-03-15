import { useState, useEffect } from 'react';
import type { SessionData } from '../types';
import './BreakView.css';
import happySun   from '../assets/happy-sun.png';
import marsImg    from '../assets/mars.png';
import earthImg   from '../assets/planet-earth.png';
import neptuneImg from '../assets/uranus.png';
import purpleImg  from '../assets/planet.png';
import mercuryImg from '../assets/mercury.png';

interface BreakProps {
  data: SessionData;
  onUpdate: (newData: Partial<SessionData> | null) => void;
}

// ── Decorative background elements (styling only, no logic) ──────────────────
function Star({ x, y, size = 12, opacity = 0.6 }: { x: number; y: number; size?: number; opacity?: number }) {
  return (
    <svg className="star" style={{ left: x, top: y, width: size, height: size, opacity }} viewBox="0 0 20 20" fill="white">
      <path d="M10 0 L11.2 8.8 L20 10 L11.2 11.2 L10 20 L8.8 11.2 L0 10 L8.8 8.8 Z" />
    </svg>
  );
}
function Dot({ x, y, size = 5, opacity = 0.4 }: { x: number; y: number; size?: number; opacity?: number }) {
  return <div className="star" style={{ left: x, top: y, width: size, height: size, borderRadius: '50%', background: 'white', opacity }} />;
}

const DECOR_PLANETS = [
  { img: marsImg,    x: 280, y: 55,  size: 52 },
  { img: neptuneImg, x: 12,  y: 120, size: 48 },
  { img: earthImg,   x: 175, y: 510, size: 56 },
  { img: purpleImg,  x: 290, y: 500, size: 44 },
  { img: mercuryImg, x: 14,  y: 55,  size: 36 },
  { img: mercuryImg, x: 290, y: 180, size: 32 },
];

export default function BreakView({ data, onUpdate }: BreakProps) {
  const [timeLeft, setTimeLeft] = useState(data.minutes * 60);

  // 1. Create the resume handler to talk to the background script
  const handleResume = async () => {
    // Grab the tab the user is currently looking at
    const [tabInfo] = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentUrl = tabInfo?.url || "";

    // Tell the background script to wake up and start tracking this tab
    chrome.runtime.sendMessage({
      action: "RESUME_SESSION",
      url: currentUrl
    });

    // Tell React to switch the UI back to the Session screen
    onUpdate({ status: 'session' });
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      // 2. Call the new handler when the timer hits zero automatically
      handleResume();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]); // Leaving handleResume out of deps for now to avoid re-triggering, but safe since it doesn't change

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="view-container break-mode">
      {/* Background decoration */}
      <Star x={20}  y={40}  size={12} opacity={0.5} />
      <Star x={295} y={55}  size={10} opacity={0.6} />
      <Star x={28}  y={380} size={12} opacity={0.4} />
      <Star x={308} y={400} size={10} opacity={0.5} />
      <Dot  x={148} y={22}  size={6}  opacity={0.5} />
      <Dot  x={22}  y={220} size={5}  opacity={0.35} />
      <Dot  x={335} y={240} size={5}  opacity={0.35} />

      {/* Background planets */}
      <div className="break-bg-planets">
        <div className="break-orbit-ring" />
        {DECOR_PLANETS.map((p, i) => (
          <img key={i} src={p.img} alt="" className="break-planet"
            style={{ left: p.x, top: p.y, width: p.size, height: p.size }} />
        ))}
      </div>

      {/* Break card */}
      <div className="break-card">
        <header><h3>Centr <span className="badge break">BREAK</span></h3></header>
        <main className="content center-content">
          {/* Task reminder */}
          <div className="break-task-reminder">
            <img src={happySun} alt="Sun" className="break-sun" />
            <div>
              <p className="break-task-label">WORKING ON</p>
              <p className="break-task-name">{data.task}</p>
            </div>
          </div>

          <div className="timer-display">
            <p>Break Ends In:</p>
            <h1 className="timer-digits">{formatTime(timeLeft)}</h1>
          </div>
          {/* 3. Attach the handler to the manual button */}
          <button className="start-btn" onClick={handleResume}>
            Back to Work
          </button>
        </main>
      </div>
    </div>
  );
}
