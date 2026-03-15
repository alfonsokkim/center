const BASE_URL = 'http://localhost:8000';

export const postSessionGoal = async (goal: string) => {
  try {
    const response = await fetch(`${BASE_URL}/session/goal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal }),
    });

    if (!response.ok) throw new Error(`Goal sync failed: ${response.status}`);
    // This will return the JSON containing your new sessionId
    return await response.json(); 
  } catch (err) {
    console.error("Backend Goal Error:", err);
    return null;
  }
};

export const postUrl = async (url: string, title: string, sessionId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/session/url`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'sessionId': sessionId // INJECTED HEADER
      },
      body: JSON.stringify({ url, title }),
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

export const sendTabTime = async (url: string, elapsedSeconds: number, sessionId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/session/tabtime`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'sessionId': sessionId // INJECTED HEADER
      },
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

export const postSessionEnd = async (sessionId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/session/end`, { 
      method: 'POST',
      headers: {
        'sessionId': sessionId // INJECTED HEADER
      }
    });

    if (!response.ok) throw new Error(`End session sync failed: ${response.status}`);
    return await response.json();
  } catch (err) {
    console.error("Backend End Session Error:", err);
    return null;
  }
};