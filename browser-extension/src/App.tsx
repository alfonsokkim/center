// App.tsx — Root component. Owns session state, persists it to chrome.storage,
// and routes to the correct view (idle → setup, session, break).

import { useState, useEffect } from 'react';
import SetupView from './views/SetupView';
import SessionView from './views/SessionView';
import BreakView from './views/BreakView';
import type { SessionStatus, SessionData, SessionHistory } from './types';
import './App.css';

// Lets the app run in a normal browser (Vite dev) without crashing on chrome.*
const isExtension = typeof chrome !== 'undefined' && !!chrome?.storage?.local;

// Saves a summary of the completed session to the history array in storage.
// relevanceScore is a placeholder — real value would come from the backend.
function saveToHistory(data: SessionData) {
  if (!data.startTime || !isExtension) return;
  const durationSeconds =
    Math.floor((Date.now() - new Date(data.startTime).getTime()) / 1000) +
    (data.workedSeconds || 0);

  const entry: SessionHistory = {
    id: Date.now().toString(),
    task: data.task,
    relevanceScore: 75, // TODO: replace with real backend score
    durationSeconds,
  };

  chrome.storage.local.get(['sessionHistory'], (res: { sessionHistory?: SessionHistory[] }) => {
    const history = res.sessionHistory || [];
    history.unshift(entry);
    chrome.storage.local.set({ sessionHistory: history.slice(0, 20) }); // keep newest 20
  });
}

function App() {
  const [status, setStatus]         = useState<SessionStatus>('idle');
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading]       = useState(true); // wait for storage before rendering

  // On popup open: restore whichever session state was last saved
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

  // Single handler for all state changes. Pass null to end the session.
  const updateSession = (newData: Partial<SessionData> | null) => {
    if (!newData) {
      // End session: save to history, wipe storage, go idle
      if (sessionData) saveToHistory(sessionData);
      if (isExtension) {
        chrome.storage.local.remove('sessionData', () => { setStatus('idle'); setSessionData(null); });
      } else {
        setStatus('idle'); setSessionData(null);
      }
      return;
    }

    const updated = { ...sessionData, ...newData } as SessionData;

    // TIME-SHIFT: when resuming from a break, rewind startTime so the work
    // timer reads "time worked" not "time since original start (incl. break)".
    // e.g. worked 20 min → break → resume: new startTime = now − 1200s
    if (sessionData?.status === 'break' && newData.status === 'session') {
      const workedMillis = (sessionData.workedSeconds || 0) * 1000;
      updated.startTime  = new Date(Date.now() - workedMillis).toISOString();
    }

    if (isExtension) {
      chrome.storage.local.set({ sessionData: updated }, () => {
        setSessionData(updated); setStatus(updated.status);
      });
    } else {
      setSessionData(updated); setStatus(updated.status);
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
    case 'session': return <SessionView data={sessionData!} onUpdate={updateSession} />;
    case 'break':   return <BreakView   data={sessionData!} onUpdate={updateSession} />;
    default:        return <SetupView   onStart={(data) => updateSession({ ...data, status: 'session' })} />;
  }
}

export default App;
