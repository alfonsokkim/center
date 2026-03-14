import { useState, useEffect, useCallback } from 'react';
import type { SessionData } from '../types';

import happySun  from '../assets/happy-sun.png';
import sadSun    from '../assets/sad-sun.png';
import marsImg   from '../assets/mars.png';
import earthImg  from '../assets/planet-earth.png';
import neptuneImg from '../assets/uranus.png';
import purpleImg from '../assets/planet.png';
import venusImg  from '../assets/venus.png';
import mercuryImg from '../assets/mercury.png';

// 4-pointed sparkle
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

// ── Coloured planet pool (non-grey) ────────────────────────────────────────
const COLOUR_PLANETS = [marsImg, earthImg, neptuneImg, purpleImg, venusImg];

function randomPlanet() {
  return COLOUR_PLANETS[Math.floor(Math.random() * COLOUR_PLANETS.length)];
}

// ── Mock tab data ──────────────────────────────────────────────────────────
interface TabInfo {
  id: number;
  name: string;
  url: string;
  relevance: number;
  planet: string;
}

const PRESET_TABS: Omit<TabInfo, 'planet'>[] = [
  { id: 1, name: 'Stack Overflow', url: 'stackoverflow.com', relevance: 88 },
  { id: 2, name: 'YouTube',        url: 'youtube.com',       relevance: 12 },
  { id: 3, name: 'Wikipedia',      url: 'wikipedia.org',     relevance: 74 },
  { id: 4, name: 'Reddit',         url: 'reddit.com',        relevance: 18 },
  { id: 5, name: 'GitHub',         url: 'github.com',        relevance: 92 },
  { id: 6, name: 'Instagram',      url: 'instagram.com',     relevance:  6 },
  { id: 7, name: 'MDN Web Docs',   url: 'developer.mozilla.org', relevance: 85 },
  { id: 8, name: 'Gmail',          url: 'gmail.com',         relevance: 22 },
  { id: 9, name: 'ChatGPT',        url: 'chatgpt.com',       relevance: 79 },
];

function resolveTab(t: Omit<TabInfo, 'planet'>): TabInfo {
  return { ...t, planet: t.relevance >= 30 ? randomPlanet() : mercuryImg };
}

// orbit configs — each planet gets a radius & duration so they don't all overlap
const ORBIT_CONFIGS = [
  { r: 108, dur: 13 },
  { r: 118, dur: 16 },
  { r: 108, dur: 11 },
  { r: 118, dur: 18 },
  { r: 108, dur: 14 },
  { r: 118, dur: 20 },
  { r: 108, dur: 12 },
  { r: 118, dur: 17 },
  { r: 108, dur: 15 },
];


interface SessionProps {
  data: SessionData;
  onUpdate: (newData: Partial<SessionData> | null) => void;
}

// ── friend's persistent timer helpers ────────────────────────────────────
const formatSeconds = (total: number) => {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
};

export default function SessionView({ data, onUpdate }: SessionProps) {
  // ── Timer — reads from wall-clock startTime so it survives popup re-opens
  const getInitialTime = () => {
    if (!data.startTime) return '00:00:00';
    const start = new Date(data.startTime).getTime();
    const now   = new Date().getTime();
    const secondsElapsed = Math.floor((now - start) / 1000);
    if (data.sessionType === 'timed') {
      const goal      = data.hours * 3600 + data.minutes * 60;
      const remaining = goal - secondsElapsed;
      return formatSeconds(remaining > 0 ? remaining : 0);
    }
    return formatSeconds(secondsElapsed);
  };

  const [displayTime, setDisplayTime] = useState(getInitialTime);

  useEffect(() => {
    const interval = setInterval(() => setDisplayTime(getInitialTime()), 1000);
    return () => clearInterval(interval);
  }, [data]);

  const timerLabel = data.sessionType === 'timed' ? 'TIME REMAINING' : 'TOTAL TIME ELAPSED';

  // ── Tabs / planets ───────────────────────────────────────────────────────
  const [tabs, setTabs] = useState<TabInfo[]>([]);
  const [nextTabIndex, setNextTabIndex] = useState(0);

  // Auto-add first 3 tabs quickly for demo wow factor
  useEffect(() => {
    const delays = [400, 1200, 2200];
    delays.forEach((delay, i) => {
      setTimeout(() => {
        setTabs(prev => prev.length > i ? prev : [...prev, resolveTab(PRESET_TABS[i])]);
        setNextTabIndex(i + 1);
      }, delay);
    });
  }, []);

  const addNextTab = useCallback(() => {
    if (nextTabIndex < PRESET_TABS.length) {
      setTabs(prev => [...prev, resolveTab(PRESET_TABS[nextTabIndex])]);
      setNextTabIndex(i => i + 1);
    }
  }, [nextTabIndex]);

  // ── Focus score ──────────────────────────────────────────────────────────
  const focusScore = tabs.length === 0
    ? 100
    : Math.round(tabs.reduce((sum, t) => sum + t.relevance, 0) / tabs.length);
  const scoreGood = focusScore >= 30;

  // ── Bottom tab state ─────────────────────────────────────────────────────
  const [bottomTab, setBottomTab] = useState<'break' | 'end'>('break');
  const [breakMinutes, setBreakMinutes] = useState<number | ''>('');
  const [confirmEnd, setConfirmEnd] = useState(false);

  // ── Selected planet panel ─────────────────────────────────────────────────
  const [selectedTab, setSelectedTab] = useState<TabInfo | null>(null);

  const handlePlanetClick = (tab: TabInfo) => {
    setSelectedTab(tab === selectedTab ? null : tab);
  };

  // ── friend's handleStartBreak — captures workedSeconds for time-shift ────
  const handleStartBreak = () => {
    const finalMinutes = Number(breakMinutes) > 0 ? Number(breakMinutes) : 5;
    const start        = new Date(data.startTime || '').getTime();
    const now          = new Date().getTime();
    const workedSeconds = Math.floor((now - start) / 1000);
    onUpdate({ status: 'break', minutes: finalMinutes, workedSeconds });
  };

  return (
    <div className="centr-screen" style={{ justifyContent: 'flex-start', position: 'relative' }}>
      {/* Background stars */}
      <Star x={18}  y={30}  size={10} opacity={0.5} />
      <Star x={295} y={50}  size={12} opacity={0.6} />
      <Star x={30}  y={350} size={10} opacity={0.4} />
      <Star x={315} y={370} size={12} opacity={0.5} />
      <Star x={150} y={550} size={8}  opacity={0.4} />
      <Dot  x={145} y={22}  size={6}  opacity={0.5} />
      <Dot  x={22}  y={200} size={5}  opacity={0.35} />
      <Dot  x={335} y={220} size={5}  opacity={0.35} />
      <Dot  x={280} y={530} size={5}  opacity={0.4} />

      {/* ── Timer section ─────────────────────────────────── */}
      <div style={{ marginTop: 18, textAlign: 'center', zIndex: 1 }}>
        <p className="timer-label">{timerLabel}</p>
        <div className="timer-box">{displayTime}</div>
      </div>

      {/* ── Orbit area ────────────────────────────────────── */}
      <div className="orbit-area" style={{ margin: '4px 0 0', zIndex: 1 }}>
        {/* Orbit ring */}
        <div className="orbit-ring" style={{ width: 246, height: 246 }} />

        {/* Planets */}
        {tabs.map((tab, i) => {
          const cfg = ORBIT_CONFIGS[i % ORBIT_CONFIGS.length];
          // Spread planets so they start at different positions
          const delayFraction = i / Math.max(tabs.length, 1);
          const delayVal = -(delayFraction * cfg.dur);
          const isSelected = selectedTab?.id === tab.id;
          const isDistraction = tab.relevance < 30;

          return (
            <div
              key={tab.id}
              className={`planet-orbit-wrapper${isSelected ? ' selected' : ''}`}
              style={{
                '--orbit-r': `${cfg.r}px`,
                '--orbit-dur': `${cfg.dur}s`,
                '--orbit-delay': `${delayVal}s`,
              } as React.CSSProperties}
              onClick={() => handlePlanetClick(tab)}
              title={tab.name}
            >
              <img
                src={isDistraction ? mercuryImg : tab.planet}
                alt={tab.name}
                style={{ filter: isDistraction ? 'grayscale(0.3) brightness(0.9)' : undefined }}
              />
            </div>
          );
        })}

        {/* Sun center */}
        <div className="sun-center">
          <img
            src={scoreGood ? happySun : sadSun}
            alt="Sun"
            style={{
              width: 80,
              height: 80,
              objectFit: 'contain',
              filter: `drop-shadow(0 0 20px rgba(245,197,24,0.6))`,
            }}
          />
        </div>

        {/* Focus score */}
        <div
          className={`focus-score ${scoreGood ? 'good' : 'bad'}`}
          style={{ left: 'calc(50% + 44px)' }}
        >
          {focusScore}%
        </div>
      </div>

      {/* ── Tab detail panel ──────────────────────────────── */}
      {selectedTab && (
        <div className="tab-detail-panel" style={{ margin: '0 16px', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ fontSize: 14, fontWeight: 700 }}>{selectedTab.name}</h4>
            <button
              onClick={() => setSelectedTab(null)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}
            >✕</button>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{selectedTab.url}</p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Relevance</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: selectedTab.relevance >= 30 ? '#4dffa0' : '#ff4d4d' }}>
              {selectedTab.relevance}%
            </span>
          </div>
          <div className="relevance-bar-bg">
            <div
              className="relevance-bar-fill"
              style={{
                width: `${selectedTab.relevance}%`,
                background: selectedTab.relevance >= 30 ? '#4dffa0' : '#ff4d4d',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Status</span>
            <span style={{
              fontSize: 12,
              fontWeight: 700,
              color: selectedTab.relevance >= 30 ? '#4dffa0' : '#ff4d4d',
              background: selectedTab.relevance >= 30 ? 'rgba(77,255,160,0.12)' : 'rgba(255,77,77,0.12)',
              padding: '2px 8px',
              borderRadius: 99,
            }}>
              {selectedTab.relevance >= 30 ? 'Relevant' : 'Distracting'}
            </span>
          </div>

        </div>
      )}

      {/* ── Stats row ─────────────────────────────────────── */}
      {!selectedTab && (
        <div style={{
          display: 'flex',
          gap: 8,
          padding: '0 16px',
          zIndex: 1,
          width: '100%',
        }}>
          {[
            { label: 'Tabs', value: tabs.length },
            { label: 'Focused', value: `${tabs.filter(t => t.relevance >= 30).length}/${tabs.length}` },
            { label: 'Distractions', value: tabs.filter(t => t.relevance < 30).length },
          ].map(stat => (
            <div key={stat.label} style={{
              flex: 1,
              background: 'rgba(14,21,96,0.7)',
              borderRadius: 12,
              padding: '8px 4px',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <p style={{ fontSize: 16, fontWeight: 800 }}>{stat.value}</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{stat.label}</p>
            </div>
          ))}
          {/* Add Tab demo button */}
          {nextTabIndex < PRESET_TABS.length && (
            <button
              onClick={addNextTab}
              style={{
                flex: 1,
                background: 'rgba(127,184,245,0.15)',
                border: '1px dashed rgba(127,184,245,0.5)',
                borderRadius: 12,
                color: '#7fb8f5',
                fontSize: 10,
                fontWeight: 700,
                cursor: 'pointer',
                padding: '8px 4px',
              }}
            >
              + Add<br />Tab
            </button>
          )}
        </div>
      )}

      {/* ── Bottom: BREAK / END tabs ───────────────────────── */}
      <div style={{ width: '100%', padding: '10px 16px 16px', zIndex: 1, marginTop: 'auto' }}>
        <div className="pill-toggle" style={{ marginBottom: 12 }}>
          <button className={bottomTab === 'break' ? 'active' : ''} onClick={() => { setBottomTab('break'); setConfirmEnd(false); }}>
            BREAK
          </button>
          <button className={bottomTab === 'end' ? 'active' : ''} onClick={() => setBottomTab('end')}>
            END
          </button>
        </div>

        {bottomTab === 'break' && (
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>
              HOW LONG IS YOUR BREAK?
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                className="white-input"
                type="number"
                value={breakMinutes}
                onChange={e => {
                  const v = e.target.value;
                  if (v === '') { setBreakMinutes(''); return; }
                  const n = parseInt(v, 10);
                  if (!isNaN(n)) setBreakMinutes(Math.min(120, Math.max(0, n)));
                }}
                placeholder="0:00:00"
                style={{ flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 700 }}
              />
              <button
                className="btn-yellow"
                style={{ width: 70, padding: '0', fontSize: 13 }}
                onClick={handleStartBreak}
                disabled={breakMinutes === '' || breakMinutes === 0}
              >
                START
              </button>
            </div>
          </div>
        )}

        {bottomTab === 'end' && (
          <div>
            {!confirmEnd ? (
              <>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 8, textAlign: 'center' }}>
                  SESSION IS NOT OVER YET!
                </p>
                <button
                  className="btn-yellow"
                  onClick={() => setConfirmEnd(true)}
                >
                  END SESSION
                </button>
              </>
            ) : (
              <>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 8, textAlign: 'center' }}>
                  Are you sure you want to end?
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-navy" style={{ flex: 1 }} onClick={() => setConfirmEnd(false)}>
                    Cancel
                  </button>
                  <button className="btn-yellow" style={{ flex: 1 }} onClick={() => onUpdate(null)}>
                    Yes, End
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
