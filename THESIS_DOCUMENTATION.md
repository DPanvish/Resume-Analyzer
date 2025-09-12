# Resumind – Full Technical Documentation (Thesis Edition)

Last updated: 2025-09-12 23:05

This document explains the complete architecture, workflow, components, pages, and core logic of the Resumind application. It is organized to start from the user and data workflow, then goes deeper into each component and module. It’s suitable as a thesis-level reference and for onboarding new contributors.


## 1. Executive Summary
Resumind is a single-page application that analyzes a user’s resume (PDF) and returns structured AI feedback. It provides:
- ATS-style scoring with category breakdown (Tone & Style, Content, Structure, Skills)
- A preview image of the uploaded resume (first page)
- A history of previously analyzed resumes

The app uses:
- React 19 + React Router 7 for the UI and routing
- Tailwind CSS 4 for styling
- Puter.js for authentication, file storage (FS), key-value (KV) data, and AI chat
- pdf.js (via pdfjs-dist) to convert a PDF’s first page to a preview image

Deployment target: Netlify (SPA build output in build/client, SPA fallback configured in netlify.toml). Server-side rendering (SSR) is disabled for Netlify compatibility.


## 2. End-to-End Workflow (User Journey)
This section describes the system behavior from the user’s perspective and the underlying data flow step-by-step.

1) Application bootstrap and auth check
- The root layout (app/root.tsx) includes the external Puter.js script.
- A Zustand store (usePuterStore from app/lib/puter.ts) initializes and checks whether the user is signed in.
- If a page requires auth (e.g., /, /upload, /resume/:id, /wipe), the route guards redirect to /auth when not authenticated.

2) Upload & analyze (on /upload)
- The user fills optional context (Company Name, Job Title, Job Description) and uploads a PDF using FileUploader.
- The app:
  a. Uploads the PDF to Puter FS.
  b. Converts the first page of the PDF to a PNG via app/lib/pdf2img.ts and uploads that PNG to Puter FS.
  c. Creates a new resume record with a UUID and stores it in Puter KV under key resume:{uuid}.
  d. Calls the AI feedback endpoint (usePuterStore.ai.feedback) with the PDF file and structured instructions (constants/prepareInstructions) designed to produce a strict JSON response.
  e. Parses the JSON feedback and updates the KV record.
  f. Navigates the user to /resume/{uuid} to view the results.

3) Review (on /resume/:id)
- The app loads the KV record, fetches the PDF and image blobs from FS, builds object URLs, and renders:
  - A resume preview image (linked to the PDF)
  - A summary gauge with overall score
  - ATS card with visual cues and tips
  - A detailed accordion per category (Tone & Style, Content, Structure, Skills)

4) History and navigation (on /)
- The home page lists previously analyzed resumes by listing KV keys matching resume:* and parsing their values.
- Each item links to its /resume/:id page and shows a small score visualization and a thumbnail.

5) Optional maintenance (on /wipe)
- For authenticated users, the wipe page lists FS files and allows wiping FS and KV data to reset the app state.


## 3. System Architecture Overview

- Frontend SPA: React + React Router 7 with Vite build (@react-router/dev). SSR is disabled for Netlify SPA deployment.
- State management: Zustand store exposes a high-level API (auth, fs, kv, ai) wrapping Puter.js SDK available on window.puter.
- External services: Puter provides Authentication, File Storage, Key-Value store, and AI chat. The app never handles API tokens directly; Puter.js runs in the browser.
- Data persistence:
  - Files (original PDF and generated PNG) are stored in Puter FS.
  - Resume metadata and AI feedback are stored in Puter KV (under resume:{id}).
- Styling: Tailwind CSS 4 with utility classes and a small set of component-level styles defined in app/app.css.


## 4. Routing and Pages
File: app/routes.ts
- index('routes/home.tsx') → / (Home)
- route('/auth', 'routes/auth.tsx') → /auth (Auth/login flow)
- route('/upload', 'routes/upload.tsx') → /upload (Upload and analyze)
- route('/resume/:id', 'routes/resume.tsx') → /resume/{id} (Detailed review)
- route('/wipe', 'routes/wipe.tsx') → /wipe (Maintenance; optional)

4.1 Layout and Root (app/root.tsx)
- Injects the Puter.js script (<script src="https://js.puter.com/v2/"></script>).
- Calls usePuterStore().init() inside a useEffect to bootstrap Puter and check auth.
- Provides document head via Links, Meta; sets up Scripts and ScrollRestoration.
- Layout renders <Outlet />; pages render within this shell.

4.2 Home page (app/routes/home.tsx)
- On mount: If not authenticated, navigates to /auth?next=/.
- Loads history by listing KV with pattern resume:* (returnValues = true) and parsing stored JSON.
- Shows “Upload Resume” CTA if no items found; otherwise renders a grid of ResumeCard components.

4.3 Upload page (app/routes/upload.tsx)
- Controlled form fields: Company Name, Job Title, Job Description.
- FileUploader component used for PDF drag-and-drop or click-to-select.
- On submit (handleSubmit → handleAnalyze):
  1) Upload PDF using fs.upload
  2) Convert to image (convertPdfToImage) and upload the generated PNG
  3) Generate UUID (generateUUID from lib/utils)
  4) Save initial KV record resume:{uuid}
  5) Invoke ai.feedback with prepareInstructions(jobTitle, jobDescription)
  6) Parse feedback JSON (string vs array content handling) and update KV
  7) Navigate to /resume/{uuid}
- Shows a progress/status text and animation during processing.

4.4 Resume details page (app/routes/resume.tsx)
- Route param id is used to fetch KV record and read associated files from FS.
- Builds object URLs from blobs for inline display and link-out to the PDF.
- Renders components:
  - Summary: overall and per-category metrics
  - ATS: ATS score card and suggestions
  - Details: Accordion per category showing tips and explanations
- If still loading or feedback is missing, a scan animation is displayed.

4.5 Auth page (app/routes/auth.tsx)
- Uses usePuterStore().auth for signIn/signOut and auth state.
- If already authenticated, redirects to the next query parameter value (e.g., back to / or /upload).
- Renders a single button that toggles login/logout based on state.

4.6 Wipe page (app/routes/wipe.tsx)
- Auth-protected; redirects to /auth if not signed in.
- Lists existing FS files, and provides a button to delete all FS files and flush KV store.
- Designed for development/maintenance.


## 5. Global State and Services (Zustand + Puter.js)
File: app/lib/puter.ts

- Purpose: Wrap the window.puter SDK to provide a typed, ergonomic interface with minimal boilerplate and consistent error handling.
- Shape: usePuterStore returns { isLoading, error, puterReady, auth, fs, ai, kv, init, clearError }.

5.1 Auth API
- auth.signIn(), auth.signOut(): delegates to puter.auth
- auth.checkAuthStatus(): checks puter.auth.isSignedIn(); updates user and isAuthenticated in store
- auth.refreshUser(), auth.getUser()

5.2 FS API
- fs.write(path, data), fs.read(path) → Blob, fs.upload(files) → FSItem, fs.delete(path), fs.readDir(path)

5.3 AI API
- ai.chat(prompt, imageURL?, testMode?, options?)
- ai.feedback(path, message): calls puter.ai.chat with a message array including the file and the structured prompt; uses model: "claude-3-7-sonnet"
- ai.img2txt(image)

5.4 KV API
- kv.get(key), kv.set(key, value), kv.delete(key), kv.list(pattern, returnValues?), kv.flush()

5.5 Initialization pattern
- init(): Detects window.puter; if not yet available, polls briefly until loaded; then set puterReady and check auth.

Security and privacy note: All APIs are client-side via Puter.js. No keys are embedded here. User data lives in Puter’s storage tied to the authenticated user/session.


## 6. PDF to Image Conversion
File: app/lib/pdf2img.ts

- Uses pdfjs-dist’s ESM build to load pdf.js lazily (dynamic import) and sets the workerSrc to a CDN URL for reliability.
- Function convertPdfToImage(file: File):
  1) Ensures library loaded (singleton loadPdfJs)
  2) Reads file.arrayBuffer(), opens document, gets page 1
  3) Renders to a high-resolution canvas (scale: 4.0)
  4) Converts canvas to Blob (image/png)
  5) Wraps as a File and returns imageUrl + file
- Errors are caught and returned in PdfConversionResult.error

Fallback commented code shows how to use a local worker in public/pdf.worker.min.mjs if desired.


## 7. Constants and AI Prompting
File: constants/index.ts

- AIResponseFormat: Defines the JSON schema the AI must return for feedback.
- prepareInstructions({ jobTitle, jobDescription }): Builds a precise prompt instructing the model to output only JSON matching the format.
- This strict prompt design minimizes parsing errors when saving to KV and rendering UI.


## 8. Components Library

8.1 Navbar (app/components/Navbar.tsx)
- Simple top navigation with brand link to "/" and a CTA to "/upload".

8.2 FileUploader (app/components/FileUploader.tsx)
- Uses react-dropzone to accept .pdf files only (max 20MB), single file.
- Exposes onFileSelect callback; shows selected file name and size (formatSize from utils) and a removable badge.
- Provides a friendly empty state with iconography.

8.3 ResumeCard (app/components/ResumeCard.tsx)
- Given a Resume object, loads the stored preview image from FS and displays a thumbnail, company/job labels (if any), and a circular score (ScoreCircle). Links to /resume/{id}.

8.4 Summary (app/components/Summary.tsx)
- Shows an overall gauge (ScoreGuage) and per-category score badges (ScoreBadge) for Tone & Style, Content, Structure, Skills.

8.5 ATS (app/components/ATS.tsx)
- Visual card summarizing ATS score with a color gradient, icon, and a list of suggestions marked as good or improve.

8.6 Details (app/components/Details.tsx)
- Accordion-based view for each category’s tips and explanations.
- Uses a small internal ScoreBadge and visual indicators per tip type.

8.7 ScoreGauge (app/components/ScoreGuage.tsx)
- Animated semicircular gauge using SVG path length to show the overall score.

8.8 ScoreCircle (app/components/ScoreCircle.tsx)
- Circular progress indicator with a gradient stroke and centered score text.

8.9 Accordion (app/components/Accordion.tsx)
- Lightweight context-based accordion with controlled expansion logic and simple icons.


## 9. Utilities and Types

9.1 Utilities
- cn, formatSize, generateUUID are defined in app/lib/utils (used by components and upload logic). Note: cn helps with className composition; formatSize shows a human-readable file size; generateUUID creates resume IDs.

9.2 Types (types/*.d.ts)
- index.d.ts: Defines Job, Resume, Feedback types (including nested tip shapes).
- puter.d.ts: Declares FSItem, PuterUser, ChatMessage, AIResponse, and PuterChatOptions to help type check interactions with Puter.


## 10. Styling System
File: app/app.css
- Tailwind 4 with custom design tokens and utilities.
- Component-level class compositions (e.g., navbar, resume-card, resume-summary) for consistent design.
- Utilities for gradients and shadows (primary-gradient, bg-gradient-btn, inset-shadow).
- Animations and responsive rules for card grid and resume details layout.


## 11. Data Model and Storage Layout

- KV Keys: resume:{uuid}
- KV Value shape (JSON):
  {
    id: string,
    resumePath: string,
    imagePath: string,
    companyName?: string,
    jobTitle?: string,
    jobDescription?: string,
    feedback: Feedback
  }
- FS files: The uploaded PDF and generated PNG are stored under user’s Puter FS paths (paths returned by fs.upload).
- Listing history: kv.list('resume:*', true) returns either keys or key/value items, which the app parses to display history.


## 12. AI Integration Details

- Model: "claude-3-7-sonnet" configured in ai.feedback.
- Prompt: Composed by prepareInstructions with jobTitle and jobDescription. Instructs to return only JSON matching AIResponseFormat.
- Response parsing:
  - If AI returns a string in message.content, parse it as JSON.
  - If message.content is an array (common in some providers), pick content[0].text and parse.
- Errors during parsing lead to status messages on the Upload page and prevent navigation until fixed.


## 13. Error Handling and Edge Cases

- Puter.js not available: usePuterStore.setError("Puter.js not available"); init polls for availability for up to 10 seconds.
- Auth required: Pages check auth state; redirects to /auth if unauthenticated, preserving a next parameter for post-login navigation.
- PDF conversion failures: convertPdfToImage returns { file: null, error }. Upload flow shows user-friendly statusText.
- AI feedback failures: Shows statusText error and does not navigate; integrates basic console logging for troubleshooting.
- File size/type constraints: react-dropzone accept filter for application/pdf, max size 20MB.


## 14. Accessibility and UX Considerations

- Keyboard navigable forms and buttons with clear focus states via Tailwind defaults.
- Sufficient color contrast in primary components; semantic HTML used for structure.
- Icons include alt text; animations are decorative and not essential for comprehension.


## 15. Security and Privacy Considerations

- Authentication handled entirely by Puter; no credentials stored in this app.
- User files and KV data reside in the user’s Puter account.
- AI processing references file paths via Puter; the app does not upload data to third-party services directly—Puter mediates the interactions.


## 16. Build and Deployment

- Build: npm run build (react-router build with Vite). Output:
  - Client: build/client (published on Netlify)
  - Server: build/server (ignored in SPA deploy)
- Netlify (netlify.toml):
  - [build] publish = "build/client"
  - SPA redirect: /* → /index.html (status 200)
  - Node 20 runtime
- SSR: Disabled in react-router.config.ts (ssr: false) for SPA deployment on Netlify.


## 17. Local Development and Testing

- npm run dev → Vite dev server with HMR
- npm run typecheck → Generate React Router types and run tsc
- Manual testing scenarios:
  - Auth: Log in/out via /auth; navigate back using next param
  - Upload: Try valid/invalid PDFs, large files, no file selected
  - AI: Provide job description and verify JSON feedback saved to KV
  - History: Ensure entries appear on / and open on /resume/:id
  - Wipe: After tests, wipe FS and KV from /wipe (dev only)


## 18. Extensibility Roadmap

- Multiple-page previews: Extend pdf2img to render multiple pages, store thumbnails, and display a pager/carousel.
- Editable feedback: Allow users to annotate AI output or mark action items as done.
- Export/Share: Generate a PDF/HTML report, toggle sharable access via Puter FS permissions.
- Model configurability: Expose temperature/max_tokens, or swap models based on role context.
- Internationalization: Add i18n for wider audiences.


## 19. Known Limitations

- AI may occasionally return non-strict JSON; current parser handles common formats but assumes well-formed content.
- The app currently renders only the first page as preview.
- All operations depend on Puter’s client SDK availability (network/availability required).


## 20. Glossary

- ATS: Applicant Tracking System; automated resume screening tool used by employers.
- Puter.js: Client SDK providing auth, file storage, key-value store, and AI endpoints in the browser.
- FS: File System API of Puter for reading/writing files.
- KV: Key-Value store in Puter for simple records.
- Feedback: Structured JSON with overall score and category-wise tips.


## 21. File Inventory (Key Files)

- app/root.tsx — App shell; loads Puter.js and bootstraps store
- app/routes.ts — Route definitions
- app/routes/home.tsx — History listing
- app/routes/upload.tsx — Upload + AI analysis workflow
- app/routes/resume.tsx — Detailed review page
- app/routes/auth.tsx — Sign-in/out and redirect logic
- app/routes/wipe.tsx — Dev tools to clear FS/KV
- app/components/* — UI components (Navbar, FileUploader, Summary, ATS, Details, Score components, Accordion)
- app/lib/puter.ts — Zustand store wrapping Puter SDK
- app/lib/pdf2img.ts — PDF → image conversion logic
- constants/index.ts — AI prompt template and response format
- app/app.css — Tailwind config and component styles
- react-router.config.ts — Router build config (ssr: false for Netlify)
- netlify.toml — Netlify build/deploy settings (SPA)


## 22. Appendix: Sequence (Text) Diagrams

A) Upload and Analyze
- User → Upload Page: Select PDF, fill fields
- Upload Page → Puter FS: upload(PDF) → path
- Upload Page → pdf2img: convertPdfToImage(PDF) → image File
- Upload Page → Puter FS: upload(image) → image path
- Upload Page → KV: set(resume:{id}, initial data)
- Upload Page → Puter AI: feedback(file path, prepareInstructions) → JSON feedback
- Upload Page → KV: set(resume:{id}, with feedback)
- Upload Page → Router: navigate(/resume/{id})

B) Resume Details
- Resume Page → KV: get(resume:{id}) → data
- Resume Page → Puter FS: read(pdf path) → Blob → object URL
- Resume Page → Puter FS: read(image path) → Blob → object URL
- Resume Page → UI: render Summary, ATS, Details

C) Home / History
- Home Page → KV: list('resume:*', true) → items
- Home Page → UI: map to ResumeCard with thumbnail + score


— End of Document —
