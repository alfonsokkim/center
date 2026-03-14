import { useState, useEffect } from 'react';
import type { SessionData } from '../types';
import happySun   from '../assets/happy-sun.png';
import marsImg    from '../assets/mars.png';
import earthImg   from '../assets/planet-earth.png';
import neptuneImg from '../assets/uranus.png';
import purpleImg  from '../assets/planet.png';
import mercuryImg from '../assets/mercury.png';

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

// Static background planets (no interaction, just decorative)
const DECOR_PLANETS = [
  { img: marsImg,    x: 280, y: 55,  size: 52 },
  { img: neptuneImg, x: 12,  y: 120, size: 48 },
  { img: earthImg,   x: 175, y: 510, size: 56 },
  { img: purpleImg,  x: 290, y: 500, size: 44 },
  { img: mercuryImg, x: 14,  y: 55,  size: 36 },
  { img: mercuryImg, x: 290, y: 180, size: 32 },
];

// Orbit ring for background visual
function OrbitRing() {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: 280,
      height: 280,
      borderRadius: '50%',
      border: '1.5px solid rgba(255,255,255,0.15)',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
    }} />
  );
}

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function BreakView({ data, onUpdate }: { data: SessionData; onUpdate: (d: Partial<SessionData> | null) => void }) {
  const totalBreakSeconds = (data.minutes || 5) * 60;
  const [remaining, setRemaining] = useState(totalBreakSeconds);

  useEffect(() => {
    // ── friend's logic: auto-return to session when break timer ends ──────
    if (remaining <= 0) {
      onUpdate({ status: 'session' });
      return;
    }
    const id = setInterval(() => setRemaining(r => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, [remaining]);

  return (
    <div className="centr-screen" style={{ justifyContent: 'center', position: 'relative' }}>
      {/* Stars */}
      <Star x={20}  y={40}  size={12} opacity={0.5} />
      <Star x={295} y={55}  size={10} opacity={0.6} />
      <Star x={28}  y={380} size={12} opacity={0.4} />
      <Star x={308} y={400} size={10} opacity={0.5} />
      <Star x={155} y={555} size={8}  opacity={0.4} />
      <Dot  x={148} y={22}  size={6}  opacity={0.5} />
      <Dot  x={22}  y={220} size={5}  opacity={0.35} />
      <Dot  x={335} y={240} size={5}  opacity={0.35} />

      {/* Decorative background orbit */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <OrbitRing />
        {DECOR_PLANETS.map((p, i) => (
          <img
            key={i}
            src={p.img}
            alt=""
            style={{
              position: 'absolute',
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.35))',
              pointerEvents: 'none',
            }}
          />
        ))}
      </div>

      {/* Break card */}
      <div className="break-card">
        {/* Card header: sun icon + task name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <img
            src={happySun}
            alt="Sun"
            style={{ width: 42, height: 42, objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(245,197,24,0.5))' }}
          />
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.55)' }}>
              WORKING ON
            </p>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginTop: 1 }}>
              {data.task}
            </p>
          </div>
        </div>

        {/* Break time label + countdown */}
        <p className="timer-label" style={{ textAlign: 'left', marginBottom: 6 }}>
          BREAK TIME REMAINING
        </p>
        <div className="timer-box" style={{ fontSize: 30, padding: '12px 24px', marginBottom: 20 }}>
          {remaining > 0 ? formatTime(remaining) : '00:00:00'}
        </div>

        {/* Finished state */}
        {remaining === 0 && (
          <p style={{ fontSize: 12, color: '#4dffa0', fontWeight: 700, textAlign: 'center', marginBottom: 12 }}>
            Break complete! Ready to focus? 🌟
          </p>
        )}

        {/* END button */}
        <button
          className="btn-yellow"
          onClick={() => onUpdate({ status: 'session' })}
        >
          END BREAK
        </button>
      </div>
    </div>
  );
}
