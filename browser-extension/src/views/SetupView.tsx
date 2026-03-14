import { useState } from 'react';
import type { SessionData } from '../types';

export default function SetupView({ onStart }: { onStart: (data: Omit<SessionData, 'status'>) => void}) {
  const [tab, setTab] = useState<'new' | 'history'>('new');
  const [task, setTask] = useState('');
  // ... (Your existing hours/minutes/sessionType state here)

  return (
    <div className="view-container">
      <nav className="tab-nav">
        <button className={tab === 'new' ? 'active' : ''} onClick={() => setTab('new')}>New Session</button>
        <button className={tab === 'history' ? 'active' : ''} onClick={() => setTab('history')}>History</button>
      </nav>

      <div className="content">
        {tab === 'new' ? (
          <div className="setup-form">
            <input value={task} onChange={e => setTask(e.target.value)} placeholder="What are you working on?" />
            {/* ... Radio buttons and duration picker ... */}
            <button onClick={() => onStart({ task, sessionType: 'unlimited', hours: 0, minutes: 0 })}>
              Start Session
            </button>
          </div>
        ) : (
          <div className="history-list">Past sessions go here.</div>
        )}
      </div>
    </div>
  );
}