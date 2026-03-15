// src/content.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import ToastNotification from './ToastNotification'; // Adjust the import path if needed

console.log("Centr Content script injected!");

// ==========================================
// 1. PAGE TITLE SCRAPER
// ==========================================
const getPageTitle = () => {
  return (
    document.title?.trim() ||
    document.querySelector('meta[property="og:title"]')?.getAttribute("content")?.trim() ||
    document.querySelector('meta[name="twitter:title"]')?.getAttribute("content")?.trim() ||
    ""
  );
};

const sendPageTitleToBackend = async () => {
  const title = getPageTitle();
  if (!title) return;

  try {
    await fetch("http://localhost:8000/page-title", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, url: window.location.href }),
    });
  } catch (error) {
    console.error("Failed to send page title:", error);
  }
};

sendPageTitleToBackend();

// ==========================================
// 2. INJECT REACT INTO THE WEBPAGE
// ==========================================
if (!document.getElementById('centr-react-root')) {
  const rootDiv = document.createElement('div');
  rootDiv.id = 'centr-react-root';
  document.body.appendChild(rootDiv);

  const root = createRoot(rootDiv);
  root.render(<ToastNotification />);
}