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

  // Sync with storage on load
  useEffect(() => {
    // Define what the storage object looks like
    chrome.storage.local.get(['sessionData'], (res: { sessionData?: SessionData }) => {
      if (res.sessionData) {
        // Now TS knows res.sessionData exists and is a SessionData type
        setStatus(res.sessionData.status);
        setSessionData(res.sessionData);
      }
      setLoading(false);
    });
  }, []);

  // Centralized update function
  const updateSession = (newData: Partial<SessionData> | null) => {
    if (!newData) {
      chrome.storage.local.remove('sessionData', () => {
        setStatus('idle');
        setSessionData(null);
      });
      return;
    }

    const updated = { ...sessionData, ...newData } as SessionData;
    chrome.storage.local.set({ sessionData: updated }, () => {
      setSessionData(updated);
      setStatus(updated.status);
    });
  };

  if (loading) return <div className="p-4">Loading Centr...</div>;

  // State-Driven Router
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

