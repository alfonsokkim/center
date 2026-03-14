import { useState } from 'react';
import type { SessionData } from '../types';
import './SetupView.css'
import { postSessionGoal } from '../server';

interface SetupProps {
  onStart: (data: Omit<SessionData, 'status'>) => void;
}

export default function SetupView({ onStart }: SetupProps) {
  const [tab, setTab] = useState<'new' | 'history'>('new');
  const [task, setTask] = useState('');
  const [sessionType, setSessionType] = useState<'timed' | 'unlimited'>('unlimited');
  const [hours, setHours] = useState<number | "">("");
  const [minutes, setMinutes] = useState<number | "">("");

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
    const [tabInfo] = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentUrl = tabInfo?.url || "";

    const sessionPayload: Omit<SessionData, 'status'> = {
      task: task.trim(),
      sessionType,
      hours: sessionType === 'timed' ? (Number(hours) || 0) : 0,
      minutes: sessionType === 'timed' ? (Number(minutes) || 0) : 0,
      startTime: new Date().toISOString(),
      url: currentUrl
    };

    // 1. Send the goal directly from React (Background doesn't need to know the goal)
    await postSessionGoal(task.trim());

    // 2. Wake up the Background Script and tell it to start tracking!
    chrome.runtime.sendMessage({ 
      action: "START_SESSION", 
      url: currentUrl 
    });

    // 3. Switch the UI to the active session view
    onStart(sessionPayload);
  };

  return (
    <div className="view-container">
      {/* ... rest of your JSX ... */}
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
            <p>Past sessions will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}