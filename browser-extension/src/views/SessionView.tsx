import { useState, useEffect } from 'react';
import type { SessionData } from '../types';
import './SessionView.css';

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

interface SessionProps {
  data: SessionData;
  onUpdate: (newData: Partial<SessionData> | null) => void;
}

const formatSeconds = (totalSeconds: number) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
};

export default function SessionView({ data, onUpdate }: SessionProps) {
  const [tab, setTab] = useState<'break' | 'end'>('break');
  const [breakMinutes, setBreakMinutes] = useState<number | "">("");

  const getInitialTime = () => {
    if (!data.startTime) return "00:00:00";

    const start = new Date(data.startTime).getTime();
    const now = new Date().getTime();
    const secondsElapsed = Math.floor((now - start) / 1000);

    if (data.sessionType === 'timed') {
      const totalSecondsGoal = (data.hours * 3600) + (data.minutes * 60);
      const remaining = totalSecondsGoal - secondsElapsed;
      return formatSeconds(remaining > 0 ? remaining : 0);
    } else {
      return formatSeconds(secondsElapsed);
    }
  };

  const [displayTime, setDisplayTime] = useState(getInitialTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayTime(getInitialTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [data]);

  const handleBreakChange = (val: string) => {
    if (val === "") {
      setBreakMinutes("");
      return;
    }
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      setBreakMinutes(Math.min(120, Math.max(0, num)));
    }
  };

  const handleStartBreak = () => {
    const finalMinutes = Number(breakMinutes) > 0 ? Number(breakMinutes) : 5;

    const start = new Date(data.startTime || "").getTime();
    const now = new Date().getTime();
    const workedSeconds = Math.floor((now - start) / 1000);

    // Tell the Background Script to pause tracking and send the final tab time
    chrome.runtime.sendMessage({ action: "START_BREAK" });

    onUpdate({
      status: 'break',
      minutes: finalMinutes,
      workedSeconds: workedSeconds
    });
  };

  return (
    <div className="view-container session-mode">
      <Star x={18} y={30} size={10} opacity={0.5} /><Star x={295} y={50} size={12} opacity={0.6} />
      <Star x={30} y={350} size={10} opacity={0.4} /><Star x={315} y={370} size={12} opacity={0.5} />
      <Dot x={145} y={22} size={6} opacity={0.5} /><Dot x={22} y={200} size={5} opacity={0.35} />
      <Dot x={335} y={220} size={5} opacity={0.35} />

      <header>
        <h3>Centr <span className="badge">FOCUSING</span></h3>
      </header>

      <main className="content">
        <div className="timer-display-container">
          <h1 className="main-timer">{displayTime}</h1>
          <div className="current-task-display">
            <h4>Working on</h4>
            <p>{data.task}</p>
          </div>
        </div>

        <nav className="tab-nav">
          <button
            className={tab === 'break' ? 'active' : ''}
            onClick={() => setTab('break')}
          >
            Take A Break
          </button>
          <button
            className={tab === 'end' ? 'active' : ''}
            onClick={() => setTab('end')}
          >
            End Session
          </button>
        </nav>

        <div className="tab-content">
          {tab === 'break' ? (
            <div className="break-setup">
              <p>How long would you like to rest?</p>
              <div className="duration-picker">
                <div className="time-unit">
                  <input
                    type="number"
                    value={breakMinutes}
                    onChange={(e) => handleBreakChange(e.target.value)}
                    placeholder="5"
                  />
                  <span>minutes</span>
                </div>
              </div>
              <button
                className="break-btn"
                onClick={handleStartBreak}
                disabled={breakMinutes === "" || breakMinutes === 0}
              >
                Start Break
              </button>
            </div>
          ) : (
            <div className="end-confirmation">
              <p>Are you sure you want to end your focus session?</p>
              <button
                className="end-btn"
                onClick={() => {
                  // Tell Background script to halt and send final tab time
                  chrome.runtime.sendMessage({ action: "END_SESSION" });

                  // Tell React to go back to SetupView
                  onUpdate(null);
                }}
              >
                Yes, End Session
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
