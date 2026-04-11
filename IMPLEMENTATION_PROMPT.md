# Implementation Prompt: Dynamic Portfolio with JSON + Admin Panel

## Mission

Refactor a React 19 + Vite portfolio SPA (GitHub Pages hosted) to load all content
from a static `public/portfolio-data.json` file at runtime, and build a password-protected
admin panel at `/admin` where the owner can view and edit every section of the portfolio.
Changes made in the admin panel persist to **localStorage**, and an **"Export JSON"**
button lets the owner download the updated file to replace `public/portfolio-data.json`
and redeploy. This is a stepping stone — the localStorage + export pattern will later
be swapped for Firebase Firestore with zero component rewrites.

---

## Project Context

- **Stack:** React 19.2.5, Vite 6.4.2, styled-components v6, MUI v5, React Router v6
- **Hosting:** GitHub Pages (static only — no server, no write API)
- **Current data source:** `src/data/constants.js` (~66 KB of hardcoded JS)
- **Working directory:** `d:/SelfProjects/mahfuzullahmufi.github.io`
- **Dev server:** `npm start` → http://localhost:5173 (or 5174 if port taken)
- **Deploy:** `npm run build` → `npm run deploy` (outputs to `dist/`, pushed to `gh-pages` branch)

---

## Data Architecture

### Source of Truth Priority (runtime)

```
1. localStorage['portfolio-data']   ← admin edits land here first
2. /portfolio-data.json             ← fetched if localStorage is empty
```

On first load: fetch JSON → store in Context.  
After any admin save: update localStorage → Context re-reads from localStorage.  
Export: serialize current Context state → download as `portfolio-data.json`.

### `public/portfolio-data.json` — Complete Shape

```json
{
  "bio": {
    "name": "Md. Mahfuzullah Mufi",
    "roles": ["Full Stack Web Developer", "Programmer"],
    "description": "I am a motivated and versatile individual...",
    "github": "https://github.com/mahfuzullahmufi",
    "resume": "https://drive.google.com/file/d/...",
    "linkedin": "https://www.linkedin.com/in/mahfuzullah/",
    "twitter": "",
    "insta": "",
    "facebook": "https://www.facebook.com/..."
  },
  "skills": [
    {
      "title": "Frontend",
      "skills": [
        { "name": "React Js", "image": "https://..." },
        { "name": "TypeScript", "image": "https://..." }
      ]
    },
    { "title": "Backend", "skills": [...] },
    { "title": "Tools", "skills": [...] },
    { "title": "Others", "skills": [...] }
  ],
  "experiences": [
    {
      "id": 1,
      "img": "https://...",
      "role": "Associate Software Engineer",
      "company": "Brain Station-23",
      "date": "Aug 2023 - Present",
      "desc": "Description text...",
      "skills": ["React", "TypeScript", "Node.js"],
      "doc": ""
    }
  ],
  "education": [
    {
      "id": 1,
      "img": "https://...",
      "school": "University Name",
      "degree": "B.Sc. in Computer Science",
      "date": "2018 - 2022",
      "grade": "3.75/4.00",
      "desc": "Description..."
    }
  ],
  "projects": [
    {
      "id": 1,
      "title": "Project Title",
      "date": "Jan 2024",
      "description": "Project description...",
      "image": "https://...",
      "tags": ["React", "Node.js"],
      "category": "personal project",
      "github": "https://github.com/...",
      "webapp": "https://...",
      "member": [
        {
          "name": "Member Name",
          "img": "https://...",
          "github": "https://...",
          "linkedin": "https://"
        }
      ]
    }
  ]
}
```

**Important note on skill icons:** `constants.js` has 10 base64-encoded SVG strings
(~40 KB combined) and 29 external URLs. When creating `portfolio-data.json`, replace
ALL base64 strings with equivalent external CDN URLs. Use these mappings:

| Skill | Replace base64 with URL |
|---|---|
| React Js | `https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg` |
| TypeScript | `https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg` |
| Angular | `https://upload.wikimedia.org/wikipedia/commons/c/cf/Angular_full_color_logo.svg` |
| Node Js | `https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg` |
| Express | `https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png` |
| Python | `https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg` |
| Java | `https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg` |
| MongoDB | `https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg` |
| Firebase | `https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg` |
| GitHub (dark) | `https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png` |

Keep all skills that already have external `https://` URLs unchanged.

---

## Files to Create / Modify

```
CREATE  public/portfolio-data.json
CREATE  src/context/PortfolioContext.jsx
CREATE  src/pages/AdminPage.jsx
CREATE  src/components/admin/AdminShell.jsx
CREATE  src/components/admin/LoginForm.jsx
CREATE  src/components/admin/BioForm.jsx
CREATE  src/components/admin/SkillsForm.jsx
CREATE  src/components/admin/ExperienceForm.jsx
CREATE  src/components/admin/EducationForm.jsx
CREATE  src/components/admin/ProjectsForm.jsx
CREATE  src/components/admin/AdminStyles.js   (styled-components for admin UI)
MODIFY  src/App.jsx
MODIFY  src/components/HeroSection/index.jsx
MODIFY  src/components/Navbar/index.jsx
MODIFY  src/components/Skills/index.jsx
MODIFY  src/components/Experience/index.jsx
MODIFY  src/components/Education/index.jsx
MODIFY  src/components/Projects/index.jsx
MODIFY  src/components/Footer/index.jsx
DELETE  src/data/constants.js               (after all components migrated)
```

---

## Step 1 — Create `public/portfolio-data.json`

Translate ALL data from `src/data/constants.js` into JSON format using the shape above.
Replace all base64 image strings with external URLs (see mapping table).
Validate: the file must be valid JSON (no trailing commas, no JS-only syntax).

---

## Step 2 — Create `src/context/PortfolioContext.jsx`

```jsx
import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'portfolio-data';
const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setData(JSON.parse(stored));
        setLoading(false);
        return;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    fetch('/portfolio-data.json')
      .then(r => r.json())
      .then(json => { setData(json); setLoading(false); });
  }, []);

  // Called by admin panel to persist changes
  const updateSection = useCallback((section, value) => {
    setData(prev => {
      const next = { ...prev, [section]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Export current data as downloadable JSON file
  const exportJSON = useCallback(() => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  // Reset localStorage to re-fetch from JSON file
  const resetToDefault = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }, []);

  return (
    <PortfolioContext.Provider value={{ ...data, loading, updateSection, exportJSON, resetToDefault }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export const usePortfolio = () => useContext(PortfolioContext);
```

---

## Step 3 — Modify `src/App.jsx`

Changes required:
1. Import `PortfolioProvider` and `usePortfolio`
2. Import `Routes`, `Route` (already has `BrowserRouter`)
3. Add `AdminPage` import
4. Split into `AppContent` (inner, uses `usePortfolio`) and `App` (outer, provides context)
5. Show loading state while data is loading

```jsx
// Rough structure — preserve all existing styled-components and logic
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Routes, Route } from 'react-router-dom';
import AdminPage from './pages/AdminPage';

const LoadingScreen = styled.div`
  width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  font-size: 20px; font-family: 'Poppins', sans-serif;
`;

function PortfolioHome({ openModal, setOpenModal }) {
  // Move all the current JSX from App() return into here
  // (Navbar, Body with all sections, ProjectDetails modal)
}

function AppContent() {
  const { loading } = usePortfolio();
  const [darkMode] = useState(true);
  const [openModal, setOpenModal] = useState({ state: false, project: null });

  if (loading) return <LoadingScreen>Loading...</LoadingScreen>;

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Routes>
        <Route path="/" element={<PortfolioHome openModal={openModal} setOpenModal={setOpenModal} />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </ThemeProvider>
  );
}

function App() {
  return (
    <PortfolioProvider>
      <Router>
        <AppContent />
      </Router>
    </PortfolioProvider>
  );
}
```

Note: `ThemeProvider` must stay INSIDE `Router` and INSIDE `PortfolioProvider` since
admin components also need the theme. Move `darkMode` state into `AppContent`.
Remove the stray `console.log(openModal)`.

---

## Step 4 — Update Portfolio Components (replace imports with hook)

For each component below, remove the `import { X } from '../../data/constants'` line
and replace with `const { x } = usePortfolio()` inside the component function.

### `src/components/HeroSection/index.jsx`
```jsx
// Remove: import { Bio } from '../../data/constants';
// Add:
import { usePortfolio } from '../../context/PortfolioContext';
const { bio } = usePortfolio();
// Then rename all Bio.x references to bio.x
```

### `src/components/Navbar/index.jsx`
```jsx
// Remove: import { Bio } from '../../data/constants';
// Add inside Navbar():
const { bio } = usePortfolio();
// Rename Bio.github → bio.github
```

### `src/components/Skills/index.jsx`
```jsx
// Remove: import { skills } from '../../data/constants';
// Add inside Skills():
const { skills } = usePortfolio();
// Data shape: skills is array of { title, skills[] }
// Same structure as before — no other changes needed
```

### `src/components/Experience/index.jsx`
```jsx
// Remove: import { experiences } from '../../data/constants';
// Add inside the component:
const { experiences } = usePortfolio();
// experiences is now an array directly (not experiences.items)
// Same structure as before
```

### `src/components/Education/index.jsx`
```jsx
// Remove: import { education, experiences } from '../../data/constants';
// Add inside the component:
const { education, experiences } = usePortfolio();
// Fix existing bug: change  `index !== experiences.length`
//                  to      `index !== education.length - 1`
// education and experiences are arrays directly
```

### `src/components/Projects/index.jsx`
```jsx
// Remove: import { projects } from '../../data/constants';
// Add inside Projects():
const { projects } = usePortfolio();
// projects is array directly — same structure, no other changes
```

### `src/components/Footer/index.jsx`
```jsx
// Remove: import { Bio } from '../../data/constants';  (if present)
// Add inside Footer():
const { bio } = usePortfolio();
// Rename Bio.x → bio.x
```

---

## Step 5 — Admin Login System

**Mechanism:** Simple password stored in an environment variable. On login, compare the
entered password against `import.meta.env.VITE_ADMIN_PASSWORD`. Store auth state in
`sessionStorage` (clears on browser close). This is suitable for a personal portfolio.

Add to `.env` (create if not exists):
```
VITE_ADMIN_PASSWORD=your_chosen_password_here
```

Add `.env` to `.gitignore` if not already present.

**`src/components/admin/LoginForm.jsx`**

```jsx
import { useState } from 'react';
// (use AdminStyles for styling)

export default function LoginForm({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      sessionStorage.setItem('admin-auth', 'true');
      onLogin();
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginTitle>Admin Login</LoginTitle>
        <form onSubmit={handleSubmit}>
          <LoginInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <ErrorText>{error}</ErrorText>}
          <LoginButton type="submit">Login</LoginButton>
        </form>
      </LoginCard>
    </LoginContainer>
  );
}
```

---

## Step 6 — Admin Shell (`src/components/admin/AdminShell.jsx`)

Wraps the authenticated admin experience. Contains:
- Top header bar: "Portfolio Admin" title + "Export JSON" button + "Reset to Default" button + "Logout" button
- Tab navigation: Bio | Skills | Experience | Education | Projects
- Renders the active form

```jsx
import { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import BioForm from './BioForm';
import SkillsForm from './SkillsForm';
import ExperienceForm from './ExperienceForm';
import EducationForm from './EducationForm';
import ProjectsForm from './ProjectsForm';

const TABS = ['Bio', 'Skills', 'Experience', 'Education', 'Projects'];

export default function AdminShell({ onLogout }) {
  const [activeTab, setActiveTab] = useState('Bio');
  const { exportJSON, resetToDefault } = usePortfolio();

  const handleLogout = () => {
    sessionStorage.removeItem('admin-auth');
    onLogout();
  };

  return (
    <AdminContainer>
      <AdminHeader>
        <AdminTitle>Portfolio Admin</AdminTitle>
        <HeaderActions>
          <ActionButton onClick={exportJSON}>⬇ Export JSON</ActionButton>
          <ActionButton onClick={resetToDefault} $variant="warning">↺ Reset to Default</ActionButton>
          <ActionButton onClick={handleLogout} $variant="danger">Logout</ActionButton>
        </HeaderActions>
      </AdminHeader>

      <TabBar>
        {TABS.map(tab => (
          <Tab key={tab} $active={activeTab === tab} onClick={() => setActiveTab(tab)}>
            {tab}
          </Tab>
        ))}
      </TabBar>

      <FormArea>
        {activeTab === 'Bio' && <BioForm />}
        {activeTab === 'Skills' && <SkillsForm />}
        {activeTab === 'Experience' && <ExperienceForm />}
        {activeTab === 'Education' && <EducationForm />}
        {activeTab === 'Projects' && <ProjectsForm />}
      </FormArea>
    </AdminContainer>
  );
}
```

---

## Step 7 — Admin Page (`src/pages/AdminPage.jsx`)

```jsx
import { useState } from 'react';
import LoginForm from '../components/admin/LoginForm';
import AdminShell from '../components/admin/AdminShell';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('admin-auth') === 'true'
  );

  if (!isAuthenticated) {
    return <LoginForm onLogin={() => setIsAuthenticated(true)} />;
  }
  return <AdminShell onLogout={() => setIsAuthenticated(false)} />;
}
```

---

## Step 8 — Admin Form Components

Each form follows this pattern:
1. Initialize local form state from `usePortfolio()` data
2. User edits fields
3. On "Save" click → call `updateSection(sectionKey, newValue)` → success toast

### `src/components/admin/BioForm.jsx`

Fields: name (text), roles (tag list — add/remove), description (textarea),
github (text), resume (text), linkedin (text), twitter (text), insta (text), facebook (text).

```jsx
import { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export default function BioForm() {
  const { bio, updateSection } = usePortfolio();
  const [form, setForm] = useState(bio || {});
  const [newRole, setNewRole] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (bio) setForm(bio); }, [bio]);

  const handleChange = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const addRole = () => {
    if (!newRole.trim()) return;
    handleChange('roles', [...(form.roles || []), newRole.trim()]);
    setNewRole('');
  };

  const removeRole = (index) => {
    handleChange('roles', form.roles.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    updateSection('bio', form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <FormSection>
      <SectionTitle>Bio</SectionTitle>
      <Field label="Name"><Input value={form.name || ''} onChange={e => handleChange('name', e.target.value)} /></Field>
      <Field label="Roles">
        <TagList>
          {(form.roles || []).map((r, i) => (
            <Tag key={i}>{r} <RemoveBtn onClick={() => removeRole(i)}>×</RemoveBtn></Tag>
          ))}
        </TagList>
        <Row>
          <Input value={newRole} onChange={e => setNewRole(e.target.value)} placeholder="New role..." />
          <AddBtn onClick={addRole}>+ Add</AddBtn>
        </Row>
      </Field>
      <Field label="Description"><Textarea rows={4} value={form.description || ''} onChange={e => handleChange('description', e.target.value)} /></Field>
      <Field label="GitHub URL"><Input value={form.github || ''} onChange={e => handleChange('github', e.target.value)} /></Field>
      <Field label="Resume URL"><Input value={form.resume || ''} onChange={e => handleChange('resume', e.target.value)} /></Field>
      <Field label="LinkedIn"><Input value={form.linkedin || ''} onChange={e => handleChange('linkedin', e.target.value)} /></Field>
      <Field label="Twitter"><Input value={form.twitter || ''} onChange={e => handleChange('twitter', e.target.value)} /></Field>
      <Field label="Instagram"><Input value={form.insta || ''} onChange={e => handleChange('insta', e.target.value)} /></Field>
      <Field label="Facebook"><Input value={form.facebook || ''} onChange={e => handleChange('facebook', e.target.value)} /></Field>
      <SaveButton onClick={handleSave}>{saved ? '✓ Saved!' : 'Save Bio'}</SaveButton>
    </FormSection>
  );
}
```

### `src/components/admin/SkillsForm.jsx`

Data: `skills` = array of `{ title, skills: [{ name, image }] }`

Features:
- List of skill categories, each expandable
- Within each category: list of skill items (name + image URL) with edit/delete
- "Add Skill Item" per category
- "Add Category" button
- "Delete Category" button per category
- Save All button

### `src/components/admin/ExperienceForm.jsx`

Data: `experiences` = array of `{ id, img, role, company, date, desc, skills[], doc }`

Features:
- List of experience items (role + company shown as header)
- Expand each to edit all fields
- `skills` field: tag-list input (add/remove skill strings)
- "Add Experience" button (adds blank item with new id)
- "Delete" button per item
- "Save All" button

### `src/components/admin/EducationForm.jsx`

Data: `education` = array of `{ id, img, school, degree, date, grade, desc }`

Features same pattern as ExperienceForm.

### `src/components/admin/ProjectsForm.jsx`

Data: `projects` = array of `{ id, title, date, description, image, tags[], category, github, webapp, member[] }`

Features:
- List of projects (title shown as header, category badge)
- Expand each to edit all fields
- `tags`: tag-list input
- `category`: dropdown with options: `"personal project"`, `"professional project"`, `"research paper"`
- `member`: array of `{ name, img, github, linkedin }` — list with add/remove
- Image field: URL text input + preview of the image
- "Add Project" button
- "Delete Project" per item
- "Save All" button

---

## Step 9 — Admin Styles (`src/components/admin/AdminStyles.js`)

Use styled-components. The admin panel has its own dark theme independent of the
portfolio theme. Use these design tokens for the admin UI:

```js
// Admin color palette (dark, professional)
const adminColors = {
  bg: '#0f0f1a',
  surface: '#1a1a2e',
  border: '#2a2a4a',
  primary: '#854CE6',
  text: '#e0e0f0',
  textMuted: '#888',
  success: '#4caf50',
  danger: '#f44336',
  warning: '#ff9800',
};
```

Export all styled-components from this file:
`AdminContainer`, `AdminHeader`, `AdminTitle`, `HeaderActions`, `ActionButton`,
`TabBar`, `Tab`, `FormArea`, `FormSection`, `SectionTitle`,
`Field` (wrapper with label), `Input`, `Textarea`, `Select`,
`SaveButton`, `Row`, `TagList`, `Tag`, `RemoveBtn`, `AddBtn`,
`ItemCard`, `ItemHeader`, `ItemBody`, `DeleteBtn`,
`LoginContainer`, `LoginCard`, `LoginTitle`, `LoginInput`, `LoginButton`, `ErrorText`

Import all of these in each admin component from `'./AdminStyles'`.

---

## Step 10 — Delete `src/data/constants.js`

After verifying all components work with the context hook and the build passes,
delete `src/data/constants.js`.

---

## Implementation Order

Execute in exactly this order to keep the app functional throughout:

1. Create `public/portfolio-data.json` (data migration)
2. Create `src/context/PortfolioContext.jsx`
3. Create `src/components/admin/AdminStyles.js`
4. Create `src/components/admin/LoginForm.jsx`
5. Create `src/components/admin/BioForm.jsx`
6. Create `src/components/admin/SkillsForm.jsx`
7. Create `src/components/admin/ExperienceForm.jsx`
8. Create `src/components/admin/EducationForm.jsx`
9. Create `src/components/admin/ProjectsForm.jsx`
10. Create `src/components/admin/AdminShell.jsx`
11. Create `src/pages/AdminPage.jsx`
12. Modify `src/App.jsx` (add PortfolioProvider + Routes + AdminPage route)
13. Modify all portfolio components (replace constants.js imports with usePortfolio())
14. Create/update `.env` with `VITE_ADMIN_PASSWORD`
15. Update `.gitignore` to include `.env`
16. Run `npm run build` — fix any errors
17. Delete `src/data/constants.js`
18. Run `npm run build` again — confirm clean build

---

## Key Constraints

1. **Do NOT break the existing portfolio UI** — only the data source changes, not styling
2. **Preserve all existing styled-components** in portfolio components — only touch imports and data references
3. **Admin panel is a completely separate visual space** — it does not use the portfolio's ThemeProvider or global styles; it has its own AdminStyles
4. **The `/admin` route must not appear in the portfolio navigation** — no link in Navbar
5. **GitHub Pages uses `HashRouter` or `BrowserRouter` with correct base** — current project uses `BrowserRouter`; the `/admin` route will work locally but GitHub Pages may redirect to 404 on direct URL access. This is acceptable for a local admin workflow. Note this limitation in a code comment.
6. **Field `label` in `Field` component** — implement as a wrapper that renders a styled label above the child input
7. **Do not add TypeScript** — stay in JavaScript (.jsx)
8. **All forms must handle `null`/`undefined` gracefully** — data may not be loaded yet when component first renders

---

## Verification Checklist

After implementation:

- [ ] `npm start` → portfolio loads at `localhost:5173/` with all data from JSON
- [ ] Navigate to `localhost:5173/admin` → login form shown
- [ ] Enter wrong password → "Incorrect password" error shown
- [ ] Enter correct password → admin panel opens
- [ ] Click "Bio" tab → all current bio fields shown pre-populated
- [ ] Edit name → click "Save Bio" → "✓ Saved!" feedback shown
- [ ] Refresh portfolio tab → edited name appears in hero section (reads from localStorage)
- [ ] Click "Export JSON" → file downloaded named `portfolio-data.json`
- [ ] Click "Logout" → returns to login form
- [ ] Click "Reset to Default" → localStorage cleared, original JSON reloaded
- [ ] `npm run build` → build succeeds, no errors
- [ ] `dist/portfolio-data.json` exists in build output
