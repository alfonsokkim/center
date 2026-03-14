// ─────────────────────────────────────────────────────────────────────────────
// Server.ts — Backend API client
//
// All communication with the Python/FastAPI backend goes through this file.
// The backend runs locally at http://localhost:8000.
//
// Current endpoints:
//   POST /session/goal    — sends the user's study goal text
//   POST /sessionstart    — sends the starting tab URL
//
// Both functions fail silently (return null on error) so a backend being
// offline doesn't crash the extension UI.
// ─────────────────────────────────────────────────────────────────────────────

// Base URL for the local backend server.
// Change this if the backend runs on a different port.
const BASE_URL = 'http://localhost:8000';

// ── sendSessionGoal ───────────────────────────────────────────────────────────
// Sends the user's study goal to the backend when a session starts.
// The backend stores this to use as a reference when scoring tab relevance —
// i.e. "how related is this page to what the user said they're working on?"
//
// Called from: SetupView.tsx → handleStart()
// Payload: { goal: string }
export const sendSessionGoal = async (goal: string) => {
  try {
    const response = await fetch(`${BASE_URL}/session/goal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal }),
    });

    // Throw if the server returned a non-2xx status code
    if (!response.ok) throw new Error(`Goal sync failed: ${response.status}`);

    return await response.json(); // returns whatever the backend sends back
  } catch (err) {
    // Log but don't crash — the session will still start even if this fails
    console.error("Backend Goal Error:", err);
    return null;
  }
};

// ── postUrl ───────────────────────────────────────────────────────────────────
// Sends the URL of the tab that was active when the session started.
// The backend uses this to initialise its context for relevance scoring —
// knowing what page the user began on helps anchor the session topic.
//
// Called from: SetupView.tsx → handleStart()
// Payload: { url: string }
export const postUrl = async (url: string) => {
  try {
    const response = await fetch(`${BASE_URL}/sessionstart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      // Include server error text in the thrown message for easier debugging
      const errorText = await response.text();
      throw new Error(`Server Error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (err) {
    // Fail gracefully — session proceeds even if the backend is offline
    console.error("Failed to sync URL with backend:", err);
    return null;
  }
};
