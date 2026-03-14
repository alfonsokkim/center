import { useState } from 'react';
import type { SessionData } from '../types';

interface SessionProps {
  data: SessionData;
  onUpdate: (newData: Partial<SessionData> | null) => void;
}

export default function SessionView({ data, onUpdate }: SessionProps) {
  const [tab, setTab] = useState<'break' | 'end'>('break');
  
  // 1. Allow state to be an empty string
  const [breakMinutes, setBreakMinutes] = useState<number | "">(""); 

  // 2. Handle the input change to allow backspacing
  const handleBreakChange = (val: string) => {
    if (val === "") {
      setBreakMinutes("");
      return;
    }
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      // We clamp the max (e.g., 120 mins) but allow 0/empty while typing
      setBreakMinutes(Math.min(120, Math.max(0, num)));
    }
  };

  const handleStartBreak = () => {
    // 3. Fallback to 1 minute if they leave it blank or 0 when clicking start
    const finalMinutes = Number(breakMinutes) > 0 ? Number(breakMinutes) : 1;
    
    onUpdate({ 
      status: 'break',
      minutes: finalMinutes 
    });
  };

  return (
    <div className="view-container session-mode">
      <header>
        <h3>Centr <span className="badge">FOCUSING</span></h3>
      </header>
      
      <main className="content">
        <div className="current-task-display">
          <h4>Working on</h4>
          <h1>{data.task}</h1>
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
                    // 4. Use the state directly
                    value={breakMinutes} 
                    onChange={(e) => handleBreakChange(e.target.value)}
                    placeholder=""
                  />
                  <span>minutes</span>
                </div>
              </div>
              <button 
                className="break-btn" 
                onClick={handleStartBreak}
                // Disable if they haven't typed a number yet
                disabled={breakMinutes === "" || breakMinutes === 0}
              >
                Start Break
              </button>
            </div>
          ) : (
            <div className="end-confirmation">
              <p>Are you sure you want to end your focus session?</p>
              <button className="end-btn" onClick={() => onUpdate(null)}>
                Yes, End Session
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}