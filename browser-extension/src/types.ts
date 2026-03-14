// ─────────────────────────────────────────────────────────────────────────────
// types.ts — Shared TypeScript type definitions
//
// All interfaces and type aliases used across the extension live here.
// Importing from one place keeps the types consistent and easy to update.
// ─────────────────────────────────────────────────────────────────────────────

// ── SessionStatus ─────────────────────────────────────────────────────────────
// The three possible states of a session.
// App.tsx uses this to decide which view to render:
//   'idle'    → SetupView    (no session running)
//   'session' → SessionView  (actively studying)
//   'break'   → BreakView    (on a timed break)
export type SessionStatus = 'idle' | 'session' | 'break';

// ── SessionData ───────────────────────────────────────────────────────────────
// The full data shape for an active or paused session.
// Stored in chrome.storage.local so it persists across popup opens.
export interface SessionData {
  status: SessionStatus;           // current session state (see above)
  task: string;                    // the study goal the user typed in
  sessionType: 'timed' | 'unlimited'; // whether the session has a time limit
  hours: number;                   // goal hours (only relevant when timed)
  minutes: number;                 // goal minutes OR break duration (context-dependent)
  startTime?: string;              // ISO timestamp — set when session starts, recalibrated after break
  url?: string;                    // URL of the tab active when the session started
  workedSeconds?: number;          // seconds worked before a break — used by App.tsx time-shift logic
}

// ── SessionHistory ────────────────────────────────────────────────────────────
// A summary record saved after each session ends.
// Stored as an array in chrome.storage.local under the key 'sessionHistory'.
// Displayed in SetupView's history screen.
export interface SessionHistory {
  id: string;                // unique ID (timestamp string) — used as React list key
  task: string;              // the study goal from that session
  relevanceScore: number;    // 0–100 average relevance score (currently a placeholder)
  durationSeconds: number;   // total seconds worked (excluding break time)
}
