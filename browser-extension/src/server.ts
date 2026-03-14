const BASE_URL = 'http://localhost:8000';

export const postSessionGoal = async (goal: string) => {
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
    const response = await fetch(`${BASE_URL}/session/start`, {
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

export const sendTabTime = async (url: string, elapsedSeconds: number) => {
  try {
    const response = await fetch(`${BASE_URL}/session/tabtime`, { // Adjust endpoint as needed
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        url: url, 
        duration: elapsedSeconds 
      }),
    });

    if (!response.ok) throw new Error(`Tab time sync failed: ${response.status}`);
    return await response.json();
  } catch (err) {
    console.error("Backend Tab Time Error:", err);
    return null;
  }
};

export const postSessionEnd = async () => {
  try {
    // No headers, no body, just a simple POST ping to the endpoint
    const response = await fetch(`${BASE_URL}/session/end`, { 
      method: 'POST' 
    });

    if (!response.ok) throw new Error(`End session sync failed: ${response.status}`);
    return await response.json();
  } catch (err) {
    console.error("Backend End Session Error:", err);
    return null;
  }
};

