# CENTR

CENTR is a focus-support system built around two connected experiences:

- a Chrome extension for starting and managing focus sessions
- a web dashboard for visualising attention patterns and focus-state feedback

The project is designed around a softer approach to productivity tooling. Instead of hard blocking everything, CENTR is aimed at helping users notice distraction earlier, reflect on what they are doing, and get nudged back toward the task they actually intended to complete.

## What This Repo Contains

This repository currently includes two frontends:

| Project | Purpose | Stack |
| --- | --- | --- |
| `browser-extension/` | Chrome extension popup and session flow | React, TypeScript, Vite, CRXJS |
| `dashboard/` | Visual focus dashboard / landing page | React, TypeScript, Vite |

## Product Direction

CENTR is being shaped around a few core ideas:

- focus sessions should start with a clear goal
- browsing behavior should be interpreted in the context of that goal
- distraction should be surfaced with friction and visibility, not just brute-force restriction
- analytics should help users understand their patterns over time

The broader product concept includes:

- goal-based study and work sessions
- tracking of tab titles and URLs during a session
- tab-switch and context-switch analytics
- relevance scoring over time
- a dashboard view for patterns, sessions, and distraction triggers
- optional break states where focus monitoring is relaxed

## Current State

### Browser Extension

The extension currently includes:

- a setup screen where the user defines a task
- support for unlimited or timed sessions
- a live session state
- a break flow
- local persistence using `chrome.storage.local`

At the moment, the extension architecture is centered on popup-driven session state stored locally in the browser.

### Dashboard

The dashboard is currently implemented as a stylised 2D landing page with:

- a space-themed gradient background
- orbit rings centered around a sun
- animated orbiting planets
- scroll-driven orbital motion with easing
- hoverable planet tooltips / modals

It is being used both as a visual brand surface and as a place where richer data visualisation can later live.

## Repository Structure

```text
center/
├── browser-extension/
│   ├── manifest.json
│   ├── src/
│   │   ├── App.tsx
│   │   ├── background.ts
│   │   ├── content.tsx
│   │   ├── views/
│   │   │   ├── SetupView.tsx
│   │   │   ├── SessionView.tsx
│   │   │   └── BreakView.tsx
│   │   └── types.ts
│   └── package.json
├── dashboard/
│   ├── pages/
│   │   └── Dashboard.tsx
│   ├── public/
│   │   └── assets/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── package.json
└── README.md
```

## Local Development

### 1. Browser Extension

Install dependencies:

```bash
cd browser-extension
npm install
```

Start development:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Lint the code:

```bash
npm run lint
```

### 2. Dashboard

Install dependencies:

```bash
cd dashboard
npm install
```

Start development:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Lint the code:

```bash
npm run lint
```

## Loading the Extension in Chrome

After building or running the extension locally:

1. Open `chrome://extensions`
2. Enable `Developer mode`
3. Click `Load unpacked`
4. Select the `browser-extension/` directory or the built output you want to test

If you are working from the generated build output, make sure you reload the extension after rebuilding.

## Dashboard Deployment

The dashboard is a Vite app and can be deployed as a static frontend.

For Vercel, the important settings are:

- Root Directory: `dashboard`
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

If your Vercel production domain is returning `404`, the most common causes are:

- the project root is set incorrectly
- the wrong branch is marked as the production branch
- a preview deployment exists, but it has not been promoted to production

## Data and Permissions Notes

The extension currently relies on:

- `tabs`
- `storage`

The reason for these permissions is straightforward:

- `tabs` is used for active tab metadata such as URL and title, and for focus-related tab behavior
- `storage` is used to persist session state between popup openings

If page contents are not being read, broad host permissions and content script matches should be kept as narrow as possible or removed entirely.

## Design Notes

The dashboard visual language currently leans into:

- deep indigo and blue gradients
- orbital motion
- soft focus-state metaphors
- light interaction rather than dense controls

This visual system helps the product feel supportive rather than punishing, which fits the overall direction of the project.

## Planned Enhancements

Some natural next steps for the project include:

- a real analytics view for focus score and distraction trends
- session history and saved reports
- better browser-event tracking around tab switching
- richer task-to-tab relevance logic
- clearer friction flows when distraction patterns are detected
- privacy-policy and extension-store publishing polish

## Contributing

If you are contributing to CENTR, a good working rhythm is:

1. choose whether the change belongs to the extension, the dashboard, or both
2. run the relevant app locally
3. keep permission usage minimal and well-justified
4. validate with `npm run build` and `npm run lint`

## Why CENTR

CENTR is trying to sit in the middle ground between doing nothing and locking users out of the internet.

For many people, especially users who struggle with context switching and time blindness, the real challenge is not simply access to distracting content. The challenge is noticing the drift early enough, in a way that feels respectful and actually usable day to day.

That is the space this project is aiming to explore.
