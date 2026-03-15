// src/ToastNotification.tsx
import React, { useState, useEffect } from 'react';

// 1. Define the exact shapes of the messages we expect from background.ts
type ToastMessage = 
  | { action: 'showLoading' }
  | { action: 'showResult'; score: number | string };

export default function ToastNotification() {
  const [toastData, setToastData] = useState<{ text: string; isLoading: boolean } | null>(null);

  useEffect(() => {
    // 2. Replace 'any' with strict Chrome and custom types
    const messageListener = (
      message: ToastMessage, 
      _sender: chrome.runtime.MessageSender, 
      sendResponse: (response: { success: boolean }) => void
    ) => {
      if (message.action === 'showLoading') {
        setToastData({ text: 'Centr: Checking Relevancy...', isLoading: true });
        sendResponse({ success: true });
      } 
      
      if (message.action === 'showResult') {
        setToastData({ text: `Centr Score: ${message.score}`, isLoading: false });
        sendResponse({ success: true });
        
        setTimeout(() => setToastData(null), 3500);
      }
      return true; 
    };

    chrome.runtime.onMessage.addListener(messageListener);
    return () => chrome.runtime.onMessage.removeListener(messageListener);
  }, []);

  if (!toastData) return null;

  const toastStyle: React.CSSProperties = {
    position: 'fixed',
    top: '24px',
    right: '24px',
    padding: '12px 20px',
    borderRadius: '8px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '14px',
    fontWeight: 600,
    color: 'white',
    zIndex: 2147483647, 
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    backgroundColor: toastData.isLoading ? '#4a90e2' : '#2c3e50',
    transition: 'background-color 0.3s ease',
    pointerEvents: 'none', 
  };

  return (
    <div style={toastStyle}>
      {toastData.text}
    </div>
  );
}