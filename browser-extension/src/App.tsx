import { useState, useEffect } from 'react';
import SetupView from './views/SetupView';
import SessionView from './views/SessionView';
import BreakView from './views/BreakView';
import type { SessionStatus, SessionData } from './types';
import './App.css';

function App() {
  const [status, setStatus] = useState<SessionStatus>('idle');
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chrome.storage.local.get(['sessionData'], (res: { sessionData?: SessionData }) => {
      if (res.sessionData) {
        setStatus(res.sessionData.status);
        setSessionData(res.sessionData);
      }
      setLoading(false);
    });
  }, []);

  const updateSession = (newData: Partial<SessionData> | null) => {
    if (!newData) {
      chrome.storage.local.remove('sessionData', () => {
        setStatus('idle');
        setSessionData(null);
      });
      return;
    }

    // 1. Create the merged object
    const updated = { ...sessionData, ...newData } as SessionData;

    // 2. TIME-SHIFT LOGIC: If moving from break -> session, recalibrate startTime
    // This ensures the work timer "resumes" from where it left off.
    if (sessionData?.status === 'break' && newData.status === 'session') {
      const now = new Date().getTime();
      // We take the seconds worked before the break and subtract them from "now"
      const workedMillis = (sessionData.workedSeconds || 0) * 1000;
      updated.startTime = new Date(now - workedMillis).toISOString();
    }

    chrome.storage.local.set({ sessionData: updated }, () => {
      setSessionData(updated);
      setStatus(updated.status);
    });
  };

  if (loading) return <div className="p-4">Loading Centr...</div>;

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