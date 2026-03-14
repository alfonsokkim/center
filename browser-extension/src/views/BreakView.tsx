// ─────────────────────────────────────────────────────────────────────────────
// BreakView.tsx — Break countdown screen
//
// Shown when the user starts a break from SessionView.
// Displays a countdown timer and auto-returns to the session when it hits zero.
// The user can also return early by pressing "END BREAK".
//
// The break duration (in minutes) comes from data.minutes, which was set
// by handleStartBreak in SessionView.tsx before transitioning here.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import type { SessionData } from '../types';

// Planet images used for decorative background elements
import happySun   from '../assets/happy-sun.png';
import marsImg    from '../assets/mars.png';
import earthImg   from '../assets/planet-earth.png';
import neptuneImg from '../assets/uranus.png';
import purpleImg  from '../assets/planet.png';
import mercuryImg from '../assets/mercury.png';

// ── Decorative sparkle components ────────────────────────────────────────────
// Purely visual — no interaction. Creates the space atmosphere.
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

// ── DECOR_PLANETS ─────────────────────────────────────────────────────────────
// Background planet images positioned at fixed coordinates.
// They don't orbit — they're just decorative during the break.
// The two mercuryImg entries represent grey/dim planets to add variety.
const DECOR_PLANETS = [
  { img: marsImg,    x: 280, y: 55,  size: 52 },
  { img: neptuneImg, x: 12,  y: 120, size: 48 },
  { img: earthImg,   x: 175, y: 510, size: 56 },
  { img: purpleImg,  x: 290, y: 500, size: 44 },
  { img: mercuryImg, x: 14,  y: 55,  size: 36 },
  { img: mercuryImg, x: 290, y: 180, size: 32 },
];

// ── OrbitRing ────────────────────────────────────────────────────────────────
// A static circular ring in the background — gives the break screen
// a sense of continuity with the session orbit visual.
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
      pointerEvents: 'none', // doesn't block any clicks
    }} />
  );
}

// ── formatTime ────────────────────────────────────────────────────────────────
// Converts raw seconds into HH:MM:SS string for the break countdown display.
function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function BreakView({ data, onUpdate }: {
  data: SessionData;
  onUpdate: (d: Partial<SessionData> | null) => void;
}) {
  // Convert break duration from minutes → seconds for the countdown.
  // data.minutes was set by handleStartBreak in SessionView.
  // Default to 5 minutes if somehow not set.
  const totalBreakSeconds = (data.minutes || 5) * 60;
  const [remaining, setRemaining] = useState(totalBreakSeconds);

  // ── Countdown tick + auto-return (from friend's logic) ───────────────────
  // Runs every second. When the timer reaches 0, automatically returns
  // the user to the session by calling onUpdate({ status: 'session' }).
  //
  // App.tsx's time-shift logic will then recalibrate startTime so the
  // work timer resumes from where it left off (not from zero).
  useEffect(() => {
    if (remaining <= 0) {
      onUpdate({ status: 'session' }); // auto-return when break ends
      return;
    }
    const id = setInterval(() => setRemaining(r => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id); // cleanup on unmount or when remaining changes
  }, [remaining]);

  // ════════════════════════════════════════════════════════════════════════════
  // ── RENDER ──────────────────────────────────────────────────────────────────
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="centr-screen" style={{ justifyContent: 'center', position: 'relative' }}>

      {/* ── Background stars ─────────────────────────────── */}
      <Star x={20}  y={40}  size={12} opacity={0.5} />
      <Star x={295} y={55}  size={10} opacity={0.6} />
      <Star x={28}  y={380} size={12} opacity={0.4} />
      <Star x={308} y={400} size={10} opacity={0.5} />
      <Star x={155} y={555} size={8}  opacity={0.4} />
      <Dot  x={148} y={22}  size={6}  opacity={0.5} />
      <Dot  x={22}  y={220} size={5}  opacity={0.35} />
      <Dot  x={335} y={240} size={5}  opacity={0.35} />

      {/* ── Background planets + orbit ring ──────────────────
          These sit behind the break card and add visual depth.
          They don't animate during break — the session is paused. */}
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
              pointerEvents: 'none', // decorative only
            }}
          />
        ))}
      </div>

      {/* ── Break card ───────────────────────────────────────
          Floating card in the centre of the screen with:
          - current task reminder (so the user doesn't forget what they were doing)
          - live break countdown
          - "Break complete!" message when timer hits zero
          - END BREAK button to return early */}
      <div className="break-card">

        {/* Task reminder: sun icon + task text */}
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
            {/* Shows the study goal so the user stays mentally anchored to their task */}
            <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginTop: 1 }}>
              {data.task}
            </p>
          </div>
        </div>

        {/* Break countdown timer */}
        <p className="timer-label" style={{ textAlign: 'left', marginBottom: 6 }}>
          BREAK TIME REMAINING
        </p>
        <div className="timer-box" style={{ fontSize: 30, padding: '12px 24px', marginBottom: 20 }}>
          {/* Show 00:00:00 when break is over rather than negative numbers */}
          {remaining > 0 ? formatTime(remaining) : '00:00:00'}
        </div>

        {/* Completion message — only visible when the break timer reaches zero */}
        {remaining === 0 && (
          <p style={{ fontSize: 12, color: '#4dffa0', fontWeight: 700, textAlign: 'center', marginBottom: 12 }}>
            Break complete! Ready to focus? 🌟
          </p>
        )}

        {/* END BREAK button — returns to session early.
            Also called automatically by the useEffect when remaining hits 0. */}
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
