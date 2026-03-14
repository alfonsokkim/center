// SetupView.tsx — Pre-session screens: home landing, session setup form, history list.
// Calls onStart() when the user submits, which App.tsx uses to switch to SessionView.

import { useState, useEffect } from 'react';
import type { SessionData, SessionHistory } from '../types';
import happySun from '../assets/happy-sun.png';
import { postUrl, sendSessionGoal } from '../Server';

// Skip chrome.* calls when running in Vite dev mode
const isExtension = typeof chrome !== 'undefined' && !!chrome?.storage?.local;

// Converts seconds → readable string: "45s", "30m", "1h 30m"
function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m > 0 ? `${m}m` : ''}`.trim();
  return `${m}m`;
}

// Decorative background stars/dots — space theme, no interaction
function Star({ x, y, size = 14, opacity = 0.7 }: { x: number; y: number; size?: number; opacity?: number }) {
  return (
    <svg className="star" style={{ left: x, top: y, width: size, height: size, opacity }} viewBox="0 0 20 20" fill="white">
      <path d="M10 0 L11.2 8.8 L20 10 L11.2 11.2 L10 20 L8.8 11.2 L0 10 L8.8 8.8 Z" />
    </svg>
  );
}
function Dot({ x, y, size = 5, opacity = 0.5 }: { x: number; y: number; size?: number; opacity?: number }) {
  return <div className="star" style={{ left: x, top: y, width: size, height: size, borderRadius: '50%', background: 'white', opacity }} />;
}

interface SetupProps {
  onStart: (data: Omit<SessionData, 'status'>) => void;
}

// Colour for the circular score ring in history: green / yellow / red
function scoreColor(r: number) {
  if (r >= 70) return '#4dffa0';
  if (r >= 45) return '#F5C518';
  return '#ff6b6b';
}

export default function SetupView({ onStart }: SetupProps) {
  const [screen, setScreen]           = useState<'home' | 'setup' | 'history'>('home');
  const [task, setTask]               = useState('');
  const [sessionType, setSessionType] = useState<'timed' | 'unlimited'>('timed');
  const [hours, setHours]             = useState<number | ''>(0);
  const [minutes, setMinutes]         = useState<number | ''>(30);
  const [history, setHistory]         = useState<SessionHistory[]>([]);

  // Fetch history from storage when the history screen is opened
  useEffect(() => {
    if (screen !== 'history' || !isExtension) return;
    chrome.storage.local.get(['sessionHistory'], (res: { sessionHistory?: SessionHistory[] }) => {
      setHistory(res.sessionHistory || []);
    });
  }, [screen]);

  const hasTime       = sessionType === 'unlimited' || (Number(hours) > 0 || Number(minutes) > 0);
  const isStartDisabled = !task.trim() || !hasTime;

  // Clamp hours (0–23) and minutes (0–59) on input change
  const handleTimeChange = (val: string, setter: (n: number | '') => void, max: number) => {
    if (val === '') { setter(''); return; }
    const num = parseInt(val, 10);
    if (!isNaN(num)) setter(Math.min(max, Math.max(0, num)));
  };

  const pad          = (n: number | '') => String(n || 0).padStart(2, '0');
  const timerDisplay = `${pad(hours)}:${pad(minutes)}:00`; // read-only formatted display

  // Session start: get current tab URL → POST to backend → call onStart()
  const handleStart = async () => {
    const tabs = await new Promise<any[]>(resolve =>
      isExtension
        ? chrome.tabs.query({ active: true, currentWindow: true }, resolve)
        : resolve([{ url: '' }])
    );
    const currentUrl = tabs[0]?.url || '';

    const sessionPayload = {
      task: task.trim(),
      sessionType,
      hours:     sessionType === 'timed' ? (Number(hours)   || 0) : 0,
      minutes:   sessionType === 'timed' ? (Number(minutes) || 0) : 0,
      startTime: new Date().toISOString(),
      url:       currentUrl,
    };

    await postUrl(currentUrl);       // tell backend which URL we started on
    await sendSessionGoal(task.trim()); // send goal for relevance scoring
    onStart(sessionPayload);
  };

  // ── HOME SCREEN ──────────────────────────────────────────────────────────────
  if (screen === 'home') {
    return (
      <div className="centr-screen" style={{ justifyContent: 'space-between', paddingBottom: 40 }}>
        {/* Background decoration */}
        <Star x={24} y={90} size={16} /><Star x={290} y={60} size={12} /><Star x={60} y={280} size={10} />
        <Star x={310} y={300} size={14} /><Star x={180} y={500} size={10} /><Star x={40} y={480} size={8} opacity={0.5} />
        <Star x={300} y={480} size={12} opacity={0.6} /><Dot x={148} y={38} size={6} opacity={0.6} />
        <Dot x={26} y={170} size={5} opacity={0.4} /><Dot x={330} y={200} size={5} opacity={0.4} />
        <Dot x={80} y={400} size={4} opacity={0.3} /><Dot x={260} y={420} size={6} opacity={0.5} />

        {/* Nav buttons */}
        <div style={{ display: 'flex', gap: 10, padding: '20px 20px 0', width: '100%', zIndex: 1 }}>
          <button className="btn-sky" style={{ flex: 1, borderRadius: 12, fontSize: 13, padding: '11px 0' }} onClick={() => setScreen('setup')}>
            NEW SESSION
          </button>
          <button className="btn-navy" style={{ flex: 1, borderRadius: 12, fontSize: 13 }} onClick={() => setScreen('history')}>
            VIEW HISTORY
          </button>
        </div>

        {/* Sun mascot + app name */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, zIndex: 1 }}>
          <img src={happySun} alt="Centr Sun" style={{ width: 160, height: 160, objectFit: 'contain', filter: 'drop-shadow(0 0 30px rgba(245,197,24,0.5))' }} />
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '0.08em', lineHeight: 1 }}>CENTR</h1>
            <p style={{ fontSize: 15, fontStyle: 'italic', color: 'rgba(255,255,255,0.8)', marginTop: 8 }}>
              Stay close to what matters
            </p>
          </div>
        </div>
        <div style={{ height: 40 }} />
      </div>
    );
  }

  // ── HISTORY SCREEN ───────────────────────────────────────────────────────────
  if (screen === 'history') {
    return (
      <div className="centr-screen" style={{ paddingTop: 16, alignItems: 'stretch' }}>
        {/* Background decoration */}
        <Star x={24} y={80} size={12} opacity={0.5} /><Star x={300} y={60} size={10} opacity={0.5} />
        <Star x={30} y={500} size={10} opacity={0.4} /><Star x={305} y={490} size={12} opacity={0.5} />
        <Dot x={148} y={22} size={6} opacity={0.5} /><Dot x={338} y={200} size={5} opacity={0.35} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px', zIndex: 1, gap: 12 }}>
          <button onClick={() => setScreen('home')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: 0 }}>←</button>
          <h2 style={{ fontSize: 20, fontWeight: 900, letterSpacing: '0.06em' }}>SESSION HISTORY</h2>
        </div>

        {/* Summary cards: total sessions, avg focus %, best score */}
        <div style={{ display: 'flex', gap: 8, padding: '14px 20px 0', zIndex: 1 }}>
          {[
            { label: 'Sessions', value: history.length || '—' },
            { label: 'Avg Focus', value: history.length ? `${Math.round(history.reduce((s, h) => s + h.relevanceScore, 0) / history.length)}%` : '—' },
            { label: 'Best',      value: history.length ? `${Math.max(...history.map(h => h.relevanceScore))}%` : '—' },
          ].map(stat => (
            <div key={stat.label} style={{ flex: 1, background: 'rgba(14,21,96,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 4px', textAlign: 'center' }}>
              <p style={{ fontSize: 18, fontWeight: 800 }}>{stat.value}</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Past session rows — up to 5, newest first */}
        <div style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: 10, zIndex: 1 }}>
          {history.length === 0 && (
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 13, padding: '20px 0' }}>
              No past sessions yet. Complete a session to see it here.
            </p>
          )}
          {history.slice(0, 5).map((session, i) => (
            <div key={session.id} style={{ background: 'rgba(14,21,96,0.65)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 700, minWidth: 16 }}>{i + 1}</span>

              {/* Task + duration */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{session.task}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{formatDuration(session.durationSeconds)}</p>
              </div>

              {/* Circular score ring — arc length = (score/100) × circumference (88) */}
              <svg width={36} height={36} viewBox="0 0 36 36">
                <circle cx={18} cy={18} r={14} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={3} />
                <circle cx={18} cy={18} r={14} fill="none" stroke={scoreColor(session.relevanceScore)} strokeWidth={3}
                  strokeDasharray={`${(session.relevanceScore / 100) * 88} 88`} strokeLinecap="round"
                  transform="rotate(-90 18 18)" style={{ filter: `drop-shadow(0 0 4px ${scoreColor(session.relevanceScore)})` }}
                />
                <text x={18} y={22} textAnchor="middle" fontSize={9} fontWeight="800" fill={scoreColor(session.relevanceScore)}>{session.relevanceScore}%</text>
              </svg>
            </div>
          ))}
        </div>

        <div style={{ padding: '16px 20px', zIndex: 1, marginTop: 'auto' }}>
          <button className="btn-yellow" onClick={() => setScreen('setup')}>NEW SESSION</button>
        </div>
      </div>
    );
  }

  // ── SETUP SCREEN ─────────────────────────────────────────────────────────────
  return (
    <div className="centr-screen" style={{ paddingTop: 16 }}>
      {/* Background decoration */}
      <Star x={24} y={100} size={14} /><Star x={290} y={80} size={12} /><Star x={60} y={260} size={10} opacity={0.6} />
      <Star x={310} y={320} size={12} /><Star x={180} y={520} size={10} /><Star x={30} y={480} size={8} opacity={0.5} />
      <Star x={305} y={470} size={10} opacity={0.6} /><Dot x={145} y={36} size={7} opacity={0.5} />
      <Dot x={22} y={190} size={5} opacity={0.4} /><Dot x={338} y={210} size={5} opacity={0.4} /><Dot x={250} y={450} size={6} opacity={0.5} />

      {/* History shortcut */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', padding: '0 20px 0', zIndex: 1 }}>
        <button className="btn-navy" onClick={() => setScreen('history')}>VIEW HISTORY</button>
      </div>

      {/* Sun */}
      <div style={{ marginTop: 20, zIndex: 1 }}>
        <img src={happySun} alt="Sun" style={{ width: 120, height: 120, objectFit: 'contain', filter: 'drop-shadow(0 0 24px rgba(245,197,24,0.5))' }} />
      </div>

      <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: '0.08em', marginTop: 12, zIndex: 1 }}>NEW SESSION</h2>

      <div style={{ width: '100%', padding: '20px 24px 0', display: 'flex', flexDirection: 'column', gap: 14, zIndex: 1 }}>
        {/* Task input */}
        <input className="white-input" value={task} onChange={e => setTask(e.target.value)} placeholder="What are you working on?" />

        {/* TIMED / UNTIMED toggle */}
        <div className="pill-toggle">
          <button className={sessionType === 'timed'     ? 'active' : ''} onClick={() => setSessionType('timed')}>TIMED</button>
          <button className={sessionType === 'unlimited' ? 'active' : ''} onClick={() => setSessionType('unlimited')}>UNTIMED</button>
        </div>

        {/* Duration picker — only for timed sessions */}
        {sessionType === 'timed' && (
          <div style={{ position: 'relative' }}>
            {/* Formatted read-only display */}
            <input className="white-input" style={{ textAlign: 'center', fontSize: 18, fontWeight: 700, letterSpacing: '0.08em', padding: '12px 16px' }}
              value={timerDisplay} readOnly onFocus={e => e.target.blur()} />
            {/* Editable hours + minutes inputs */}
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <div style={{ flex: 1 }}>
                <input className="white-input" type="number" value={hours} onChange={e => handleTimeChange(e.target.value, setHours, 23)}
                  placeholder="HH" style={{ textAlign: 'center', padding: '8px', fontSize: 13 }} min={0} max={23} />
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: 3 }}>hours</p>
              </div>
              <div style={{ flex: 1 }}>
                <input className="white-input" type="number" value={minutes} onChange={e => handleTimeChange(e.target.value, setMinutes, 59)}
                  placeholder="MM" style={{ textAlign: 'center', padding: '8px', fontSize: 13 }} min={0} max={59} />
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: 3 }}>minutes</p>
              </div>
            </div>
          </div>
        )}

        {/* Start button — disabled until task + time are valid */}
        <button className="btn-yellow" style={{ marginTop: 4 }} disabled={isStartDisabled} onClick={handleStart}>
          START
        </button>
      </div>
    </div>
  );
}
