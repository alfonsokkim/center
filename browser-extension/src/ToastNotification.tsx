// src/ToastNotification.tsx
import React, { useState, useEffect } from 'react';
import happySun from './assets/happy-sun.png';
import sadSun   from './assets/sad-sun.png';

// 1. Define the exact shapes of the messages we expect from background.ts
type ToastMessage =
  | { action: 'showLoading' }
  | { action: 'showResult'; score: number | string };

export default function ToastNotification() {
  const [toastData, setToastData] = useState<{ text: string; isLoading: boolean; score: number | null } | null>(null);

  useEffect(() => {
    // 2. Replace 'any' with strict Chrome and custom types
    const messageListener = (
      message: ToastMessage,
      _sender: chrome.runtime.MessageSender,
      sendResponse: (response: { success: boolean }) => void
    ) => {
      if (message.action === 'showLoading') {
        setToastData({ text: 'CHECKING RELEVANCY...', isLoading: true, score: null });
        sendResponse({ success: true });
      }

      if (message.action === 'showResult') {
        const score = typeof message.score === 'number' ? message.score : null;
        setToastData({ text: `CENTR SCORE: ${message.score}`, isLoading: false, score });
        sendResponse({ success: true });

        setTimeout(() => setToastData(null), 3500);
      }
      return true;
    };

    chrome.runtime.onMessage.addListener(messageListener);
    return () => chrome.runtime.onMessage.removeListener(messageListener);
  }, []);

  if (!toastData) return null;

  const isBad = toastData.score !== null && toastData.score < 20;
  const sunSrc = isBad ? sadSun : happySun;

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 16px 10px 10px',
    borderRadius: '14px',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '0.06em',
    color: '#ffffff',
    zIndex: 2147483647,
    boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
    background: 'linear-gradient(135deg, #2e3a9e 0%, #1e2878 40%, #0e1560 100%)',
    border: '1px solid rgba(255,255,255,0.15)',
    pointerEvents: 'none',
    overflow: 'hidden',
  };

  const sunStyle: React.CSSProperties = {
    width: '28px',
    height: '28px',
    objectFit: 'contain',
    flexShrink: 0,
    position: 'relative',
    zIndex: 1,
  };

  const starPath = 'M10 0 L11.2 8.8 L20 10 L11.2 11.2 L10 20 L8.8 11.2 L0 10 L8.8 8.8 Z';
  const stars: { x: number; y: number; size: number; opacity: number }[] = [
    { x: 6,  y: 4,  size: 7,  opacity: 0.5 },
    { x: 88, y: 6,  size: 5,  opacity: 0.4 },
    { x: 72, y: 28, size: 6,  opacity: 0.35 },
    { x: 18, y: 30, size: 5,  opacity: 0.3 },
  ];

  return (
    <div style={containerStyle}>
      {stars.map((s, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="white"
          style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y * 2}px`, width: s.size, height: s.size, opacity: s.opacity, flexShrink: 0 }}>
          <path d={starPath} />
        </svg>
      ))}
      {!toastData.isLoading && <img src={sunSrc} alt="" style={sunStyle} />}
      <span style={{ color: toastData.isLoading ? '#ffffff' : isBad ? '#ff6b6b' : '#4dffa0', position: 'relative', zIndex: 1 }}>
        {toastData.text}
      </span>
    </div>
  );
}
