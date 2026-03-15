import { useState, useEffect } from 'react';
import type { SessionData, SessionHistory } from '../types';
import happySun from '../assets/happy-sun.png';
import './SetupView.css';

// ── Decorative background elements (styling only, no logic) ──────────────────
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

// ── History helpers (styling only) ───────────────────────────────────────────
function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m > 0 ? `${m}m` : ''}`.trim();
  return `${m}m`;
}
function scoreColor(r: number) {
  if (r >= 70) return '#4dffa0';
  if (r >= 45) return '#F5C518';
  return '#ff6b6b';
}

const isExtension = typeof chrome !== 'undefined' && !!chrome?.storage?.local;

interface SetupProps {
  onStart: (data: Omit<SessionData, 'status'>) => void;
}

export default function SetupView({ onStart }: SetupProps) {
  // ── UI state ─────────────────────────────────────────────────────────────
  const [showHome, setShowHome] = useState(true);               // home screen gate
  const [tab, setTab] = useState<'new' | 'history'>('new');    // original tab logic unchanged
  const [task, setTask] = useState('');
  const [sessionType, setSessionType] = useState<'timed' | 'unlimited'>('unlimited');
  const [hours, setHours] = useState<number | "">("");
  const [minutes, setMinutes] = useState<number | "">("");
  const [history, setHistory] = useState<SessionHistory[]>([]);

  useEffect(() => {
    if (tab !== 'history' || !isExtension) return;
    chrome.storage.local.get(['sessionHistory'], (res: { sessionHistory?: SessionHistory[] }) => {
      setHistory(res.sessionHistory || []);
    });
  }, [tab]);

  const hasTime = sessionType === 'unlimited' || (Number(hours) > 0 || Number(minutes) > 0);
  const isStartDisabled = !task.trim() || !hasTime;

  const handleTimeChange = (val: string, setter: (n: number | "") => void, max: number) => {
    if (val === "") {
      setter("");
      return;
    }
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      const clamped = Math.min(max, Math.max(0, num));
      setter(clamped);
    }
  };

  const handleStart = async () => {
    // 1. Grab both the URL and the Title from the active tab
    const [tabInfo] = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentUrl = tabInfo?.url || "";
    const currentTitle = tabInfo?.title || "";

    const sessionPayload: Omit<SessionData, 'status'> = {
      task: task.trim(),
      sessionType,
      hours: sessionType === 'timed' ? (Number(hours) || 0) : 0,
      minutes: sessionType === 'timed' ? (Number(minutes) || 0) : 0,
      startTime: new Date().toISOString(),
      url: currentUrl
    };

    // 2. Wake up the Background Script and pass all the necessary data
    chrome.runtime.sendMessage({
      action: "START_SESSION",
      url: currentUrl,
      title: currentTitle,
      goal: task.trim() // Send the goal text here!
    }, (response) => {
      // 3. Switch the UI to the active session view ONLY if the background script succeeded
      if (response && response.success) {
        onStart(sessionPayload);
      } else {
        console.error("Failed to start session:", response?.error);
        // Optional: You could add a state here to show a "Failed to connect to server" error message to the user
      }
    });
  };

  // ── Home screen ───────────────────────────────────────────────────────────
  if (showHome) {
    return (
      <div className="view-container home-screen">
        <Star x={24} y={90} size={16} /><Star x={290} y={60} size={12} /><Star x={60} y={280} size={10} />
        <Star x={310} y={300} size={14} /><Star x={180} y={500} size={10} /><Star x={40} y={480} size={8} opacity={0.5} />
        <Star x={300} y={480} size={12} opacity={0.6} /><Dot x={148} y={38} size={6} opacity={0.6} />
        <Dot x={26} y={170} size={5} opacity={0.4} /><Dot x={330} y={200} size={5} opacity={0.4} />
        <Dot x={80} y={400} size={4} opacity={0.3} /><Dot x={260} y={420} size={6} opacity={0.5} />

        <div className="home-nav">
          <button className="btn-sky" onClick={() => setShowHome(false)}>NEW SESSION</button>
          <button className="btn-navy" onClick={() => { setShowHome(false); setTab('history'); }}>VIEW HISTORY</button>
        </div>

        <div className="home-hero">
          <img src={happySun} alt="Centr Sun" className="home-sun" />
          <div className="home-title">
            <h1>CENTR</h1>
            <p>Stay close to what matters</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="view-container">
      <Star x={24} y={80} size={12} opacity={0.5} /><Star x={300} y={60} size={10} opacity={0.5} />
      <Star x={30} y={500} size={10} opacity={0.4} /><Star x={305} y={490} size={12} opacity={0.5} />
      <Dot x={148} y={22} size={6} opacity={0.5} /><Dot x={338} y={200} size={5} opacity={0.35} />

      <div className="heading-container">
        <img src={happySun} alt="Sun" className="setup-sun" />
        <h2>CENTR</h2>
        <h4>Stay focused on your work</h4>
      </div>

      <nav className="tab-nav">
        <button
          className={tab === 'new' ? 'active' : ''}
          onClick={() => setTab('new')}
        >
          New Session
        </button>
        <button
          className={tab === 'history' ? 'active' : ''}
          onClick={() => setTab('history')}
        >
          History
        </button>
      </nav>

      <div className="content">
        {tab === 'new' ? (
          <div className="setup-screen">
            <p>What are you working on? (Be descriptive!)</p>
            <textarea
              className="task-input"
              value={task}
              onChange={e => setTask(e.target.value)}
              placeholder="Example: I am working on my UNSW COMP1511 linked lists assignment"
            />

            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  checked={sessionType === 'unlimited'}
                  onChange={() => setSessionType('unlimited')}
                />
                Unlimited
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  checked={sessionType === 'timed'}
                  onChange={() => setSessionType('timed')}
                />
                Timed
              </label>
            </div>

            {sessionType === 'timed' && (
              <div className="duration-picker">
                <div className="time-unit">
                  <input
                    type="number"
                    value={hours || ''}
                    onChange={(e) => handleTimeChange(e.target.value, setHours, 23)}
                    placeholder=""
                  />
                  <span>hours</span>
                </div>
                <div className="time-unit">
                  <input
                    type="number"
                    value={minutes || ''}
                    onChange={(e) => handleTimeChange(e.target.value, setMinutes, 59)}
                    placeholder=""
                  />
                  <span>minutes</span>
                </div>
              </div>
            )}

            <button
              className="start-btn"
              disabled={isStartDisabled}
              onClick={handleStart}
            >
              Start Session
            </button>
          </div>
        ) : (
          <div className="history-list">
            {/* Summary cards */}
            <div className="history-stats">
              {[
                { label: 'Sessions', value: history.length || '—' },
                { label: 'Avg Focus', value: history.length ? `${Math.round(history.reduce((s, h) => s + h.relevanceScore, 0) / history.length)}%` : '—' },
                { label: 'Best',      value: history.length ? `${Math.max(...history.map(h => h.relevanceScore))}%` : '—' },
              ].map(stat => (
                <div key={stat.label} className="history-stat-card">
                  <p className="stat-value">{stat.value}</p>
                  <p className="stat-label">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Past session rows */}
            <div className="history-rows">
              {history.length === 0 && (
                <p className="history-empty">No past sessions yet. Complete a session to see it here.</p>
              )}
              {history.slice(0, 5).map((session, i) => (
                <div key={session.id} className="history-row">
                  <span className="history-rank">{i + 1}</span>
                  <div className="history-info">
                    <p className="history-task">{session.task}</p>
                    <p className="history-duration">{formatDuration(session.durationSeconds)}</p>
                  </div>
                  <svg width={36} height={36} viewBox="0 0 36 36" className="score-ring">
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

            <button className="start-btn" onClick={() => setTab('new')}>NEW SESSION</button>
          </div>
        )}
      </div>
    </div>
  );
}
