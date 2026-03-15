import { useState, useEffect } from 'react';
import type { SessionData } from '../types';

interface BreakProps {
  data: SessionData;
  onUpdate: (newData: Partial<SessionData> | null) => void;
}

export default function BreakView({ data, onUpdate }: BreakProps) {
  const [timeLeft, setTimeLeft] = useState(data.minutes * 60);

  // 1. Create the resume handler to talk to the background script
  const handleResume = async () => {
    // Grab the tab the user is currently looking at
    const [tabInfo] = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentUrl = tabInfo?.url || "";

    // Tell the background script to wake up and start tracking this tab
    chrome.runtime.sendMessage({ 
      action: "RESUME_SESSION", 
      url: currentUrl 
    });

    // Tell React to switch the UI back to the Session screen
    onUpdate({ status: 'session' });
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      // 2. Call the new handler when the timer hits zero automatically
      handleResume();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]); // Leaving handleResume out of deps for now to avoid re-triggering, but safe since it doesn't change

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
        {/* 3. Attach the handler to the manual button */}
        <button className="start-btn" onClick={handleResume}>
          Back to Work
        </button>
      </main>
    </div>
  );
}