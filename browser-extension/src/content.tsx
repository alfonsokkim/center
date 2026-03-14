// ─────────────────────────────────────────────────────────────────────────────
// content.tsx — Chrome content script
//
// This file is injected by the browser into every web page the user visits
// while the extension is active (as declared in manifest.json).
//
// Its job is to extract the title of the current page and send it to the
// backend so the backend can score how relevant that page is to the
// user's current study goal.
//
// Unlike popup scripts, this script runs in the context of the web page itself
// (not the extension popup), so it has access to document, window, etc.
// ─────────────────────────────────────────────────────────────────────────────

console.log("Content script injected!");
