// import type { SessionData } from "./types";

const BASE_URL = 'http://localhost:8000';

export const sendSessionGoal = async (goal: string) => {
  try {
    const response = await fetch(`${BASE_URL}/session/goal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal }),
    });

    if (!response.ok) throw new Error(`Goal sync failed: ${response.status}`);
    return await response.json();
  } catch (err) {
    console.error("Backend Goal Error:", err);
    return null;
  }
};

export const postUrl = async (url: string) => {
  try {
    const response = await fetch(`${BASE_URL}/sessionstart`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server Error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Failed to sync URL with backend:", err);
    return null; 
  }
};

