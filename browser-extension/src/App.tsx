import { useState, useEffect } from 'react';
import SetupView from './views/SetupView';
import SessionView from './views/SessionView';
import BreakView from './views/BreakView';
import type { SessionStatus, SessionData, SessionHistory } from './types';
import './App.css';

const isExtension = typeof chrome !== 'undefined' && !!chrome?.storage?.local;

// ── Save completed session to history ──────────────────────────────────────
function saveToHistory(data: SessionData) {
  if (!data.startTime || !isExtension) return;
  const start = new Date(data.startTime).getTime();
  const now   = new Date().getTime();
  // workedSeconds carries time worked before a break; add it back
  const durationSeconds = Math.floor((now - start) / 1000) + (data.workedSeconds || 0);

  const entry: SessionHistory = {
    id: Date.now().toString(),
    task: data.task,
    relevanceScore: 75, // placeholder — real value would come from backend
    durationSeconds,
  };

  chrome.storage.local.get(['sessionHistory'], (res: { sessionHistory?: SessionHistory[] }) => {
    const history = res.sessionHistory || [];
    history.unshift(entry);
    chrome.storage.local.set({ sessionHistory: history.slice(0, 20) });
  });
}

function App() {
  const [status, setStatus] = useState<SessionStatus>('idle');
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isExtension) {
      chrome.storage.local.get(['sessionData'], (res: { sessionData?: SessionData }) => {
        if (res.sessionData) {
          setStatus(res.sessionData.status);
          setSessionData(res.sessionData);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const updateSession = (newData: Partial<SessionData> | null) => {
    // ── End session ───────────────────────────────────────────────────────
    if (!newData) {
      if (sessionData) saveToHistory(sessionData);
      if (isExtension) {
        chrome.storage.local.remove('sessionData', () => {
          setStatus('idle');
          setSessionData(null);
        });
      } else {
        setStatus('idle');
        setSessionData(null);
      }
      return;
    }

    const updated = { ...sessionData, ...newData } as SessionData;

    // ── TIME-SHIFT: resuming from break → recalibrate startTime ──────────
    // This makes the work timer "resume" from where it left off instead of
    // restarting from the current wall-clock time.
    if (sessionData?.status === 'break' && newData.status === 'session') {
      const now          = new Date().getTime();
      const workedMillis = (sessionData.workedSeconds || 0) * 1000;
      updated.startTime  = new Date(now - workedMillis).toISOString();
    }

    if (isExtension) {
      chrome.storage.local.set({ sessionData: updated }, () => {
        setSessionData(updated);
        setStatus(updated.status);
      });
    } else {
      setSessionData(updated);
      setStatus(updated.status);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 600, background: '#151f70', color: '#fff', fontSize: 14 }}>
        Loading Centr…
      </div>
    );
  }

  switch (status) {
    case 'session':
      return <SessionView data={sessionData!} onUpdate={updateSession} />;
    case 'break':
      return <BreakView data={sessionData!} onUpdate={updateSession} />;
    case 'idle':
    default:
      return <SetupView onStart={(data) => updateSession({ ...data, status: 'session' })} />;
  }
}

export default App;
