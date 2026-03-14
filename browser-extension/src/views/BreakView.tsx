import { useState, useEffect } from 'react';
import type { SessionData } from '../types';

interface BreakProps {
  data: SessionData;
  onUpdate: (newData: Partial<SessionData> | null) => void;
}

export default function BreakView({ data, onUpdate }: BreakProps) {
  const [timeLeft, setTimeLeft] = useState(data.minutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      onUpdate({ status: 'session' })
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="view-container break-mode">
      <header><h3>Centr <span className="badge break">BREAK</span></h3></header>
      <main className="content center-content">
        <div className="timer-display">
          <p>Break Ends In:</p>
          <h1 className="timer-digits">{formatTime(timeLeft)}</h1>
        </div>
        <button className="start-btn" onClick={() => onUpdate({ status: 'session' })}>
          Back to Work
        </button>
      </main>
    </div>
  );
}