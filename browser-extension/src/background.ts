import { postSessionGoal, postUrl, sendTabTime, postSessionEnd } from "./server";

// 1. Added sessionId to the state shape
interface BackgroundState {
  isSessionActive: boolean;
  isOnBreak: boolean;
  currentTabUrl: string;
  tabStartTime: number;
  sessionId: string;
}

const getState = async (): Promise<BackgroundState> => {
  const res = await chrome.storage.local.get([
    'isSessionActive', 'isOnBreak', 'currentTabUrl', 'tabStartTime', 'sessionId'
  ]);
  
  return {
    isSessionActive: Boolean(res.isSessionActive),
    isOnBreak: Boolean(res.isOnBreak),
    currentTabUrl: String(res.currentTabUrl || ""),
    tabStartTime: Number(res.tabStartTime || 0),
    sessionId: String(res.sessionId || "")
  };
};

// --- NEW HELPER: Combined Sync & Score Check ---
// Now requires the sessionId to pass to postUrl
async function handleRelevancyCheck(tabId: number, url: string, title: string, sessionId: string) {
  try {
    await chrome.tabs.sendMessage(tabId, { action: 'showLoading' });

    const data = await postUrl(url, title, sessionId);
    
    await chrome.tabs.sendMessage(tabId, { 
      action: 'showResult', 
      score: data?.score !== undefined ? data.score : 'Error' 
    });
  } catch (error) {
    console.log("Could not communicate with tab:", error);
  }
}

// --- LISTENER 1: Tab Switches ---
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const state = await getState();
  // We now also abort if there's no sessionId, as we can't track without it
  if (!state.isSessionActive || state.isOnBreak || !state.sessionId) return;

  const tab = await chrome.tabs.get(activeInfo.tabId);
  const newUrl = tab.url || "";
  const newTitle = tab.title || ""; 
  const now = Date.now();

  if (state.currentTabUrl && state.tabStartTime > 0) {
    const elapsedSeconds = Math.floor((now - state.tabStartTime) / 1000);
    await sendTabTime(state.currentTabUrl, elapsedSeconds, state.sessionId);
  }

  await chrome.storage.local.set({
    currentTabUrl: newUrl,
    tabStartTime: now
  });
  
  if (newUrl && !newUrl.startsWith('chrome://')) {
    await handleRelevancyCheck(activeInfo.tabId, newUrl, newTitle, state.sessionId);
  }
});

// --- LISTENER 2: URL Changes (User types a new link in the current tab) ---
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  const state = await getState();
  if (!state.isSessionActive || state.isOnBreak || !state.sessionId) return;

  if (changeInfo.url) {
    const newUrl = changeInfo.url;
    const newTitle = tab.title || ""; 
    const now = Date.now();

    if (state.currentTabUrl && state.tabStartTime > 0) {
      const elapsedSeconds = Math.floor((now - state.tabStartTime) / 1000);
      await sendTabTime(state.currentTabUrl, elapsedSeconds, state.sessionId);
    }

    await chrome.storage.local.set({
      currentTabUrl: newUrl,
      tabStartTime: now
    });

    if (newUrl && !newUrl.startsWith('chrome://')) {
      await handleRelevancyCheck(tabId, newUrl, newTitle, state.sessionId);
    }
  }
});

// --- LISTENER 3: Messages from React App (Popup) ---
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  const now = Date.now();

  (async () => {
    const state = await getState();

    if (message.action === "START_SESSION") {
      // 1. HALT AND WAIT FOR THE SESSION ID FIRST
      // (Assumes your popup passes message.goal when starting)
      const goalResponse = await postSessionGoal(message.goal || "Focus Session");
      const fetchedSessionId = goalResponse?.sessionId;

      if (!fetchedSessionId) {
        console.error("Failed to get sessionId from backend. Session aborted.");
        sendResponse({ success: false, error: "No Session ID" });
        return; 
      }

      // 2. ONLY SAVE TO STORAGE AFTER WE HAVE THE ID
      await chrome.storage.local.set({
        isSessionActive: true,
        isOnBreak: false,
        currentTabUrl: message.url,
        tabStartTime: now,
        sessionId: fetchedSessionId
      });

      // 3. NOW WE CAN FIRE THE FIRST TAB REQUEST
      if (message.url && !message.url.startsWith('chrome://')) {
        await postUrl(message.url, message.title || "", fetchedSessionId);
      }
    }

    if (message.action === "START_BREAK") {
      if (state.currentTabUrl && state.tabStartTime > 0 && state.sessionId) {
        const elapsedSeconds = Math.floor((now - state.tabStartTime) / 1000);
        await sendTabTime(state.currentTabUrl, elapsedSeconds, state.sessionId);
      }
      await chrome.storage.local.set({
        isOnBreak: true,
        currentTabUrl: "",
        tabStartTime: 0
      });
    }

    if (message.action === "RESUME_SESSION") {
      await chrome.storage.local.set({
        isOnBreak: false,
        currentTabUrl: message.url,
        tabStartTime: now
      });
      if (message.url && !message.url.startsWith('chrome://') && state.sessionId) {
        await postUrl(message.url, message.title || "", state.sessionId);
      }
    }

    if (message.action === "END_SESSION") {
      if (state.currentTabUrl && state.tabStartTime > 0 && state.sessionId) {
        const elapsedSeconds = Math.floor((now - state.tabStartTime) / 1000);
        await sendTabTime(state.currentTabUrl, elapsedSeconds, state.sessionId);
      }
      
      // Ping the backend with the sessionId AND the total time
      if (state.sessionId) {
        // Expect the React popup to send 'totalTime' in the message payload
        const finalTime = message.totalTime || 0; 
        await postSessionEnd(state.sessionId, finalTime);
      }

      await chrome.storage.local.set({
        isSessionActive: false,
        isOnBreak: false,
        currentTabUrl: "",
        tabStartTime: 0,
        sessionId: "" 
      });
    }

    sendResponse({ success: true });
  })();

  return true; 
});