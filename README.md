# Resumind — AI‑Powered Resume Analyzer

Smart, visual feedback for your resume with ATS scoring, actionable tips, and progress tracking.

<p align="center">
  <img alt="resume scan animation" src="public/images/resume-scan.gif" width="680" />
</p>

<p align="center">
  <a href="https://react.dev"><img alt="React" src="https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=222&labelColor=fff"></a>
  <a href="https://reactrouter.com/"><img alt="React Router" src="https://img.shields.io/badge/React%20Router-7-CA4245?logo=reactrouter&logoColor=fff"></a>
  <a href="https://www.typescriptlang.org/"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=fff"></a>
  <a href="https://vitejs.dev/"><img alt="Vite" src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=fff"></a>
  <a href="https://tailwindcss.com/"><img alt="Tailwind" src="https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=fff"></a>
  <a href="https://zustand-demo.pmnd.rs/"><img alt="Zustand" src="https://img.shields.io/badge/Zustand-5-323232?logo=react&logoColor=fff"></a>
  <a href="https://puter.com/"><img alt="Puter" src="https://img.shields.io/badge/Puter.js-Cloud%20AI%20%26%20KV-7A5AF8?logo=icloud&logoColor=fff"></a>
</p>

## At a glance
- What it does: AI analyzes your PDF resume and returns an ATS score with clear tips you can act on.
- 3-step workflow:
  1. 📤 Upload — Drag & drop your PDF.
  2. 🧠 Analyze — AI reviews it against your target role.
  3. 📈 Review — See score, key insights, and improvement tips.

<p align="center">
  <a href="https://react.dev"><img alt="React" src="https://cdn.simpleicons.org/react/61DAFB" height="30"></a>&nbsp;&nbsp;
  <a href="https://www.typescriptlang.org/"><img alt="TypeScript" src="https://cdn.simpleicons.org/typescript/3178C6" height="30"></a>&nbsp;&nbsp;
  <a href="https://vitejs.dev/"><img alt="Vite" src="https://cdn.simpleicons.org/vite/646CFF" height="30"></a>&nbsp;&nbsp;
  <a href="https://tailwindcss.com/"><img alt="Tailwind" src="https://cdn.simpleicons.org/tailwindcss/06B6D4" height="30"></a>&nbsp;&nbsp;
  <a href="https://puter.com/"><img alt="Puter" src="https://cdn.simpleicons.org/icloud/7A5AF8" height="30"></a>
</p>

## What is this?
Resumind is a full‑stack React Router app that analyzes your resume using AI and provides:
- ATS score with context-specific tips
- Category insights (Tone & Style, Content, Structure, Skills)
- Visual summaries and badges for quick understanding
- Secure file storage and history of your analyzed resumes

Built around Puter.js for authentication, file storage, key‑value data, and AI chat (Claude 3.7 Sonnet), with a clean Tailwind UI.

## Key Features
- 🔐 One‑click auth via Puter.js
- ⬆️ PDF upload with drag & drop (react-dropzone)
- 🖼️ Resume preview image of the first page
- 🤖 AI feedback via Puter AI chat (Claude 3.7 Sonnet)
- 🧠 Structured JSON feedback with overall and category scores
- 🗂️ KV storage of analysis history; revisit anytime
- 🧭 SSR by default, Vite HMR in dev

## Tech Stack
- UI: React 19, React Router 7 (SSR), Tailwind CSS 4
- State: Zustand 5
- Build: Vite 6, TypeScript 5
- File/AI/KV: Puter.js v2 (auth, fs, kv, ai)
- Uploads: react-dropzone

<p>
  <img alt="React" src="https://cdn.simpleicons.org/react/61DAFB" height="26" />&nbsp;
  <img alt="TypeScript" src="https://cdn.simpleicons.org/typescript/3178C6" height="26" />&nbsp;
  <img alt="Vite" src="https://cdn.simpleicons.org/vite/646CFF" height="26" />&nbsp;
  <img alt="Tailwind CSS" src="https://cdn.simpleicons.org/tailwindcss/06B6D4" height="26" />&nbsp;
  <img alt="Puter" src="https://cdn.simpleicons.org/icloud/7A5AF8" height="26" />
</p>

## How it Works (Workflow)
1) Auth bootstrap
- On app mount, root.tsx loads Puter.js v2 and initializes a Zustand store (usePuterStore.init). Auth status is checked and persisted.

2) Upload & analyze
- In /upload, user drags a PDF.
- A preview image of the first page is generated for display.
- Both the PDF and the preview image are uploaded to Puter FS.
- A UUID record is saved in Puter KV under resume:{id} with file paths and form metadata.
- The app calls ai.feedback, sending the resume file and structured instructions (constants/prepareInstructions) to Puter AI chat (Claude 3.7 Sonnet).
- The JSON feedback (overallScore, ATS, toneAndStyle, content, structure, skills) is parsed and saved back to KV.
- User is redirected to /resume/{id}.

3) Review & history
- /resume/:id reads the KV record, fetches blobs from Puter FS, and displays:
  - A preview image of the resume
  - Summary gauge and category badges
  - ATS card with visual state and tips
  - Detailed accordion with explanations and icons
- Home (/) lists previously analyzed resumes from KV and links to detail pages.

## Project Structure
```
app/
  components/       # Navbar, FileUploader, Summary, ATS, Details, visuals
  lib/              # puter.ts (Zustand + Puter.js wrappers), utils.ts
  routes/           # home.tsx, auth.tsx, upload.tsx, resume.tsx
  app.css           # Tailwind + custom utilities and component classes
constants/          # Demo data + AI instruction builder
public/
  icons/            # SVG icons used by components
  images/           # Backgrounds and animations
```

## Run locally
1) Requirements
- Node.js 20+

2) Install
```bash
npm install
```

3) Dev (with HMR)
```bash
npm run dev
```
- App: http://localhost:5173

4) Type check (optional)
```bash
npm run typecheck
```

5) Build
```bash
npm run build
```

6) Start (SSR server)
```bash
npm start
```


## Configuration notes
- Puter.js script is loaded from https://js.puter.com/v2/ in app/root.tsx; no local API keys required.
- AI model is set to "claude-3-7-sonnet" inside app/lib/puter.ts feedback().
- File and KV access is via Puter SDK available on window.puter.

## Why this design?
- Developer ergonomics: A thin wrapper (app/lib/puter.ts) exposes auth, fs, kv, and ai with consistent error handling.
- UX clarity: Tailwind utility classes plus small components (ScoreBadge, ScoreGuage/Circle) keep visuals simple and informative.
- Performance: SSR by default and Vite HMR in dev.
- Simplicity: No backend code to write—Puter provides auth, storage, and AI.

## Roadmap Ideas
- Multi‑page PDF previews
- Editable job descriptions per resume record
- Export feedback report as PDF
- Shareable links with access rules

## Acknowledgments
- Icons in public/icons
- Animations and backgrounds in public/images
- Powered by Puter.js, Tailwind, React Router, and Vite
