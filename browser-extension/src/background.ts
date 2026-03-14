import { postUrl, sendTabTime } from "./server";

// 1. Define the exact shape of our background state
interface BackgroundState {
  isSessionActive: boolean;
  isOnBreak: boolean;
  currentTabUrl: string;
  tabStartTime: number;
}

// 2. Tell TypeScript this function returns a Promise containing that state
const getState = async (): Promise<BackgroundState> => {
  const res = await chrome.storage.local.get([
    'isSessionActive', 'isOnBreak', 'currentTabUrl', 'tabStartTime'
  ]);
  
  // 3. Explicitly cast the raw storage data to the correct types
  return {
    isSessionActive: Boolean(res.isSessionActive),
    isOnBreak: Boolean(res.isOnBreak),
    currentTabUrl: String(res.currentTabUrl || ""),
    tabStartTime: Number(res.tabStartTime || 0)
  };
};

// 1. Listen for Tab Switches
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const state = await getState();
  if (!state.isSessionActive || state.isOnBreak) return;

  const tab = await chrome.tabs.get(activeInfo.tabId);
  const newUrl = tab.url || "";
  const now = Date.now();

  // If we were tracking a previous tab, calculate the time and send it
  if (state.currentTabUrl && state.tabStartTime > 0) {
    const elapsedSeconds = Math.floor((now - state.tabStartTime) / 1000);
    await sendTabTime(state.currentTabUrl, elapsedSeconds);
  }

  // Save the new tab state to storage
  await chrome.storage.local.set({
    currentTabUrl: newUrl,
    tabStartTime: now
  });
  
  // Send the new URL to the backend
  await postUrl(newUrl); 
});

// 2. Listen for messages from your React App (Popup)
// 1. Add the underscore to _sender
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  const now = Date.now();

  (async () => {
    const state = await getState();

    if (message.action === "START_SESSION") {
      await chrome.storage.local.set({
        isSessionActive: true,
        isOnBreak: false,
        currentTabUrl: message.url,
        tabStartTime: now
      });
      await postUrl(message.url);
    }

    if (message.action === "START_BREAK") {
      if (state.currentTabUrl && state.tabStartTime > 0) {
        const elapsedSeconds = Math.floor((now - state.tabStartTime) / 1000);
        await sendTabTime(state.currentTabUrl, elapsedSeconds);
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
      await postUrl(message.url);
    }

    if (message.action === "END_SESSION") {
      if (state.currentTabUrl && state.tabStartTime > 0) {
        const elapsedSeconds = Math.floor((now - state.tabStartTime) / 1000);
        await sendTabTime(state.currentTabUrl, elapsedSeconds);
      }
      await chrome.storage.local.set({
        isSessionActive: false,
        isOnBreak: false,
        currentTabUrl: "",
        tabStartTime: 0
      });
    }

    // 2. Actually use sendResponse here so Chrome knows we finished!
    sendResponse({ success: true });
  })();

  return true; 
});