# CLAUDE.md — mahfuzullahmufi.github.io

Context file for AI-assisted refactoring and UI enhancement work.

---

## 1. Project Overview

**Type:** Personal portfolio website (single-page application)
**Owner:** Mahfuzullah Mufi — Full Stack Developer
**Hosted at:** https://mahfuzullahmufi.github.io

**Tech Stack:**
- React 19.2.5 (Vite 6.4.2 — migrated from Create React App)
- JavaScript (no TypeScript)
- Styled-components v6 (CSS-in-JS, primary styling approach)
- Material-UI (MUI) v5.18 — Timeline, Modal, Snackbar, Icons
- React Router DOM v6 (used for `<BrowserRouter>` only, no routes)
- React Scroll v1.9 (smooth scroll to sections)
- Typewriter Effect v2.21 (hero section typing animation)
- EmailJS (client-side contact form email delivery)
- gh-pages (GitHub Pages deployment; Vite outputs to `dist/`)

---

## 2. Folder Structure

```
src/
├── App.jsx                     # Root: theme, modal state, layout assembly
├── App.css                     # Global styles (font, scroll, scrollbar)
├── index.js                    # React entry point
├── data/
│   └── constants.js            # ALL site data: Bio, skills, experience, education, projects
├── utils/
│   └── Themes.js               # Dark + Light theme token objects
├── themes/
│   └── default.js              # Default theme re-export (redundant)
├── images/                     # Project screenshots and skill icons
└── components/
    ├── Navbar/                 # Sticky nav with mobile menu toggle
    ├── HeroSection/            # Hero banner with profile, typewriter, resume button
    ├── HeroBgAnimation/        # Animated SVG background (CSS keyframes on paths)
    ├── Skills/                 # Skill category grid
    ├── Experience/             # MUI Timeline of work history
    ├── Education/              # MUI Timeline of education
    ├── Projects/               # Filterable project grid
    ├── Contact/                # EmailJS contact form
    ├── Footer/                 # Social links and nav links
    ├── About/                  # UNIMPLEMENTED — returns <div>About</div>
    ├── Cards/
    │   ├── ProjectCards.jsx    # Project card with tags, links, image
    │   ├── ExperienceCard.jsx  # Single experience timeline entry
    │   └── EducationCard.jsx   # Single education timeline entry
    └── ProjectDetails/
        └── index.jsx           # MUI Modal for full project detail view
```

`public/` contains `index.html`, profile photos (`.jpg`, `.png`).
`build/` is the production output (git-ignored, deployed via gh-pages).

---

## 3. Key Dependencies and Roles

| Package | Role |
|---|---|
| `react`, `react-dom` | UI framework |
| `react-scripts` | CRA build toolchain (Webpack under the hood) |
| `styled-components` v5 | All component-level styling (CSS-in-JS with theme support) |
| `@mui/material`, `@mui/lab`, `@mui/icons-material` | Timeline, Modal, Snackbar, icon set |
| `@emotion/react`, `@emotion/styled` | MUI peer dependency |
| `react-router-dom` v6 | Provides `<BrowserRouter>` context only — no `<Route>` used |
| `react-scroll` | Smooth scroll-to-section behavior |
| `typewriter-effect` | Animated role titles in hero section |
| `@emailjs/browser`, `emailjs-com` | Send contact form emails client-side (redundant dual install) |
| `gh-pages` | Deployment script to GitHub Pages |
| `react-icons` | Additional icon set (alongside MUI icons) |

---

## 4. Component Hierarchy and Routing

**No page routing.** All navigation is anchor-based (`href="#skills"`, `href="#experience"`, etc.) with CSS `scroll-behavior: smooth`.

```
App
├── ThemeProvider (styled-components)
│   └── BrowserRouter
│       ├── Navbar (sticky, mobile-togglable)
│       └── Body
│           ├── HeroSection → HeroBgAnimation
│           ├── Skills
│           ├── Experience → ExperienceCard[]
│           ├── Projects → ProjectCards[] + ProjectDetails (modal)
│           ├── Education → EducationCard[]
│           ├── Contact (EmailJS form)
│           └── Footer
```

`openModal` state lives in `App.js` and is passed down as props to `Projects` and `ProjectDetails`.

---

## 5. Styling Approach

**Primary:** `styled-components` v5 with a theme object passed via `ThemeProvider`.

**Theme tokens** (`src/utils/Themes.js`):
```js
// Dark theme (currently always active)
bg, bgLight, primary (#854CE6 purple), text_primary, text_secondary, card, button, white, black
```

**Light theme** is defined but never used — `darkMode` state is hardcoded to `true` in `App.js`.

**Global styles** in `App.css`: Poppins font (Google Fonts), scroll behavior, custom scrollbar.

**Responsive breakpoints** inside styled-components: 960px, 768px, 640px, 500px.

**MUI styling** coexists alongside styled-components — MUI components are styled via `sx` prop or wrapper styled-components.

---

## 6. Build / Dev Commands

```bash
npm start          # Vite dev server → http://localhost:5173
npm run build      # Production build → /dist
npm run preview    # Preview the production build locally
npm test           # Run Vitest tests
npm run deploy     # Build + push to gh-pages branch (GitHub Pages)
```

No `.env` file is currently used. No environment-specific configuration.

**Build toolchain:** Vite 6.4.2 + `@vitejs/plugin-react` 4.7.0 (replaced Create React App).
All JSX files use the `.jsx` extension (Vite 6 requirement for rollup's parser).

---

## 7. Known Issues and Areas for Improvement

### Bugs
- **Projects filter broken:** toggle state uses `'machine learning'` but click handler sets `'research paper'` — mismatched strings cause filter to malfunction. (`src/components/Projects/index.js`)
- **Education timeline connector:** `experiences.length` is referenced instead of `education.length` (`src/components/Education/index.js:97`)
- **Footer theme token missing:** `theme.soft2` is referenced but does not exist in either theme object, causing undefined color. (`src/components/Footer/index.js:84`)
- **`console.log(openModal)`** left in production code (`src/App.js`)

### React Anti-Patterns
- **Missing `key` props** in all `.map()` renders (Skills, ProjectCards, ExperienceCard, EducationCard). Causes React reconciliation warnings and silent bugs.
- **Dual emailjs packages** installed (`@emailjs/browser` and `emailjs-com`) — redundant.
- Inline `onClick` arrow functions inside map loops — creates new functions on every render.
- No error boundary — a single component crash takes down the entire page.

### Accessibility
- Icon buttons lack `aria-label` attributes.
- Mobile nav menu has no `aria-expanded` / `aria-controls`.
- Project card images missing `alt` text in some cases.
- Contact form inputs lack `<label>` elements (uses placeholder text only).
- No skip-to-main-content link.

### Performance
- `src/data/constants.js` embeds skill icons as **base64 strings** — bloats the JS bundle significantly.
- No code splitting or `React.lazy()` — entire app loads upfront.
- Profile and project images not optimized (no WebP, no `srcset`).
- No `React.memo()` on card components — re-render unnecessarily on parent state updates.
- `HeroBgAnimation` SVG is fixed at 600×500px — not responsive.

### UX / Feature Gaps
- **Light theme toggle non-functional** — `darkMode` is hardcoded `true`, setter never called.
- **Contact form** shows no error feedback to user on EmailJS failure (only `console.error`).
- **About component** is a stub — never implemented.
- No form validation (email format, required fields).
- EmailJS credentials hardcoded in source; should use `.env` variables.
- Theme choice not persisted to `localStorage`.

### Code Style
- Mixed `.js` and `.jsx` extensions with no consistent rule.
- Magic strings for project category filters — should be constants.
- `src/themes/default.js` is a redundant re-export of `src/utils/Themes.js`.
- Inline style objects mixed with styled-components in a few places.

### Dependency Updates Available
- `styled-components` v5 → v6 (breaking changes, requires migration)
- `react-router-dom` 6.3.0 → 6.20+ (patch updates, safe)
- MUI v5 → v6 (breaking, optional)

---

## 8. Refactoring Priorities

**Fix first (bugs):**
1. Missing `key` props across all list renders
2. Projects category filter string mismatch
3. Education `experiences.length` → `education.length`
4. Footer `theme.soft2` undefined

**High value improvements:**
1. Move base64 icons to actual image files in `/src/images/`
2. Add `aria-label` to all icon buttons and fix form labels
3. Implement contact form error handling and input validation
4. Wire up light/dark theme toggle with `localStorage` persistence
5. Add `.env` for EmailJS credentials

**Modernization (when refactoring):**
- Migrate to TypeScript
- Replace CRA with Vite (faster dev/build)
- Add `React.lazy` + `Suspense` for code splitting
- Consider Next.js if SEO or SSR becomes a concern
