import { useState } from 'react';
import type { SessionData } from '../types';

interface SetupProps {
  onStart: (data: Omit<SessionData, 'status'>) => void;
}

export default function SetupView({ onStart }: SetupProps) {
  const [tab, setTab] = useState<'new' | 'history'>('new');
  const [task, setTask] = useState('');
  const [sessionType, setSessionType] = useState<'timed' | 'unlimited'>('unlimited');
  const [hours, setHours] = useState<number | "">("");
  const [minutes, setMinutes] = useState<number | "">("");

  // Validation logic
  // This ensures that if it's "timed", at least one box has a number greater than 0
  const hasTime = sessionType === 'unlimited' || (Number(hours) > 0 || Number(minutes) > 0);

  // Your button stays disabled if the task is empty OR the time isn't valid
  const isStartDisabled = !task.trim() || !hasTime;

  const handleTimeChange = (val: string, setter: (n: number | "") => void, max: number) => {
    // If the input is empty (backspaced), set state to empty string
    if (val === "") {
      setter("");
      return;
    }

    const num = parseInt(val, 10);

    // If it's a valid number, clamp it between 0 and your max
    if (!isNaN(num)) {
      const clamped = Math.min(max, Math.max(0, num));
      setter(clamped);
    }
  };

  const handleStart = () => {
  onStart({
    task: task.trim(),
    sessionType,
    // If it's "" (empty), treat it as 0 for the API/Storage
    hours: sessionType === 'timed' ? (hours || 0) : 0,
    minutes: sessionType === 'timed' ? (minutes || 0) : 0,
    startTime: new Date().toISOString(),
  });
};

  return (
    <div className="view-container">
      <div>
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
            <input 
              className="task-input"
              value={task} 
              onChange={e => setTask(e.target.value)} 
              placeholder="What are you working on?" 
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
            <p>Past sessions will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}