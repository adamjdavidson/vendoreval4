# Quickstart Guide: VendorEval3 Development

**Feature**: AI Vendor Evaluation Framework (001-ai-vendor-evaluation)
**Version**: 1.0.0
**Last Updated**: 2025-10-19

This guide helps developers get up and running with the VendorEval3 project.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 20.x or higher
  ```bash
  node --version  # Should be v20.0.0 or higher
  ```

- **npm**: Version 10.x or higher
  ```bash
  npm --version   # Should be 10.0.0 or higher
  ```

- **Git**: For version control
  ```bash
  git --version
  ```

**Recommended Editor**: Visual Studio Code with extensions:
- ESLint
- Prettier
- TypeScript Vue Plugin (Volar)
- Tailwind CSS IntelliSense

---

## Project Structure

VendorEval3 is a **monorepo** with two separate applications:

```
vendoreval3/
├── apps/
│   ├── evaluation-tool/    # React + Vite interactive app
│   └── docs/               # Docusaurus documentation site
├── shared/                 # Shared types (optional for alpha)
├── specs/                  # SpecKit specifications
├── .specify/               # SpecKit configuration
└── .beads/                 # Beads issue tracking
```

---

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url> vendoreval3
cd vendoreval3
```

### 2. Verify Branch

```bash
git branch  # Should show: 001-ai-vendor-evaluation
```

If not on the feature branch:
```bash
git checkout 001-ai-vendor-evaluation
```

---

## Running the Evaluation Tool

The evaluation tool is the primary interactive application.

### 1. Navigate to Evaluation Tool

```bash
cd apps/evaluation-tool
```

### 2. Install Dependencies

```bash
npm install
```

**Note**: First install may take 2-3 minutes.

### 3. Start Development Server

```bash
npm run dev
```

**Output**:
```
  VITE v6.x.x  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 4. Open in Browser

Navigate to: `http://localhost:5173/`

You should see the landing page with:
- Hero section explaining the framework
- Two action cards: "Learn Framework" and "Evaluate a Vendor"
- Pre-analyzed vendors section

### 5. Hot Module Replacement (HMR)

Vite provides instant updates when you edit files:
- Edit any `.tsx` or `.ts` file
- Save the file
- Browser updates automatically (no refresh needed)

---

## Running the Documentation Site

The documentation site uses Docusaurus.

### 1. Navigate to Docs

```bash
cd apps/docs  # From project root
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run start
```

**Output**:
```
[INFO] Starting the development server...
[SUCCESS] Docusaurus website is running at: http://localhost:3000/
```

### 4. Open in Browser

Navigate to: `http://localhost:3000/`

You should see:
- Documentation homepage
- Sidebar with framework sections
- Search bar
- Voice mode toggle (once implemented)

---

## Running Tests

### Evaluation Tool Tests

```bash
cd apps/evaluation-tool
npm run test
```

**Run with coverage**:
```bash
npm run test:coverage
```

**Run in watch mode** (recommended during development):
```bash
npm run test:watch
```

**Output**:
```
 ✓ src/utils/scoring.test.ts (5 tests) 250ms
 ✓ src/hooks/useEvaluation.test.ts (3 tests) 180ms
 ✓ src/components/Question.test.tsx (4 tests) 300ms

 Test Files  3 passed (3)
      Tests  12 passed (12)
   Duration  730ms
```

### Test Coverage Report

After running `npm run test:coverage`, open:
```
apps/evaluation-tool/coverage/index.html
```

---

## Building for Production

### Build Evaluation Tool

```bash
cd apps/evaluation-tool
npm run build
```

**Output**:
```
vite v6.x.x building for production...
✓ 150 modules transformed.
dist/index.html                   2.5 kB │ gzip: 1.2 kB
dist/assets/index-abc123.js     150.0 kB │ gzip: 50.0 kB
dist/assets/vendor-def456.js    140.0 kB │ gzip: 45.0 kB
✓ built in 3.5s
```

**Preview production build**:
```bash
npm run preview
```

Opens at: `http://localhost:4173/`

### Build Documentation Site

```bash
cd apps/docs
npm run build
```

**Output**:
```
[SUCCESS] Generated static files in "build"
[INFO] Use `npm run serve` to test your build locally
```

**Serve production build**:
```bash
npm run serve
```

---

## Environment Variables

### Evaluation Tool (.env)

Create `apps/evaluation-tool/.env` if needed:

```bash
# Development environment
VITE_APP_TITLE="AI Vendor Evaluation"
VITE_VERSION="1.0.0"

# Not used in alpha (no backend)
# VITE_API_URL=http://localhost:3001
```

**Note**: Vite requires `VITE_` prefix for environment variables.

### Documentation Site (.env)

Not needed for alpha (static site generation).

---

## Code Quality Tools

### Linting

**Check for issues**:
```bash
cd apps/evaluation-tool
npm run lint
```

**Auto-fix issues**:
```bash
npm run lint:fix
```

### Formatting

**Check formatting**:
```bash
npm run format:check
```

**Auto-format code**:
```bash
npm run format
```

### Type Checking

**Run TypeScript compiler** (no output, just type checking):
```bash
npm run typecheck
```

---

## Debugging

### Browser DevTools

1. Open browser DevTools (F12)
2. Go to "Sources" tab
3. Find your `.tsx` files (Vite maps them automatically)
4. Set breakpoints
5. Refresh page or trigger action

### VS Code Debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome against localhost",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/apps/evaluation-tool/src"
    }
  ]
}
```

Press F5 to start debugging.

### React DevTools

Install browser extension:
- Chrome: [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools)
- Firefox: [React Developer Tools](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

Provides:
- Component tree inspection
- Props and state viewer
- Profiler for performance analysis

---

## Common Issues & Solutions

### Issue: Port 5173 already in use

**Error**:
```
Port 5173 is in use, trying another one...
```

**Solution**:
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

### Issue: Module not found after npm install

**Error**:
```
Cannot find module 'react'
```

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript errors in editor but build works

**Solution**:
```bash
# Restart TypeScript server in VS Code
# Command Palette (Cmd+Shift+P): TypeScript: Restart TS Server
```

### Issue: Vite caching issues (stale imports)

**Solution**:
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

### Issue: LocalStorage data not persisting

**Check**:
1. Open DevTools → Application → Local Storage
2. Verify `ai-vendor-evaluations` key exists
3. Check browser privacy settings (incognito mode clears on close)

**Clear LocalStorage**:
```javascript
// In browser console
localStorage.clear()
```

---

## Development Workflow

### 1. Start Work Session

```bash
# Check Beads for ready work
bd ready --json

# Start dev server
cd apps/evaluation-tool
npm run dev
```

### 2. Make Changes

- Edit files in `src/`
- Browser updates automatically via HMR
- Check console for errors

### 3. Write Tests

- Create `.test.tsx` file next to component
- Run tests in watch mode: `npm run test:watch`
- Aim for 70% coverage on business logic

### 4. Check Code Quality

```bash
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm run format      # Prettier
```

### 5. Commit Changes

```bash
git add .
git commit -m "Add Question component with help modal"
```

**Commit Message Format**: `<verb> <what>`
- Add: New functionality
- Fix: Bug fix
- Update: Enhancement to existing feature
- Refactor: Code restructure without behavior change
- Test: Add or update tests
- Docs: Documentation only

---

## SpecKit Workflow Integration

This project uses **Spec-Driven Development** with SpecKit:

### Current Status

1. ✅ Constitution: `.specify/memory/constitution.md`
2. ✅ Specification: `specs/001-ai-vendor-evaluation/spec.md`
3. ✅ Plan: `specs/001-ai-vendor-evaluation/plan.md`
4. ✅ Research: `specs/001-ai-vendor-evaluation/research.md`
5. ✅ Data Model: `specs/001-ai-vendor-evaluation/data-model.md`
6. ✅ Contracts: `specs/001-ai-vendor-evaluation/contracts/types.ts`
7. ⏳ Tasks: To be generated with `/speckit.tasks`
8. ⏳ Implementation: To be executed with `/speckit.implement`

### Reference Documents

- **Constitution**: Development principles and quality standards
- **Spec**: WHAT to build and WHY (no technical details)
- **Plan**: HOW to build it (tech stack, architecture)
- **Research**: Technology decisions with rationale
- **Data Model**: Entity definitions and relationships
- **Contracts**: TypeScript interfaces
- **Tasks**: Ordered task breakdown (next step)

---

## Useful Commands Reference

### Evaluation Tool

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 5173) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Check for linting issues |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Run TypeScript compiler |

### Documentation Site

| Command | Description |
|---------|-------------|
| `npm run start` | Start dev server (port 3000) |
| `npm run build` | Build static site |
| `npm run serve` | Serve production build |
| `npm run clear` | Clear Docusaurus cache |

### Beads (Issue Tracking)

| Command | Description |
|---------|-------------|
| `bd ready --json` | Show issues ready to work on |
| `bd list --json` | List all issues |
| `bd create "Title" -t TYPE -p PRIORITY` | Create new issue |
| `bd update ID --status in_progress` | Mark issue in progress |
| `bd close ID --reason "Done"` | Close completed issue |
| `bd stats --json` | Show project statistics |

---

## Getting Help

### Documentation

- **SpecKit Docs**: `.specify/memory/` and `specs/001-ai-vendor-evaluation/`
- **React 19 Docs**: https://react.dev/
- **Vite Docs**: https://vitejs.dev/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Docusaurus**: https://docusaurus.io/docs

### Troubleshooting Steps

1. Check this quickstart guide
2. Review error messages in console
3. Search project documentation in `specs/`
4. Check constitution for coding standards
5. Ask team member or create Beads issue

---

## Next Steps

After completing this quickstart:

1. **Review the specification**: `specs/001-ai-vendor-evaluation/spec.md`
2. **Understand the plan**: `specs/001-ai-vendor-evaluation/plan.md`
3. **Study the data model**: `specs/001-ai-vendor-evaluation/data-model.md`
4. **Wait for tasks**: `specs/001-ai-vendor-evaluation/tasks.md` (to be created)
5. **Start implementing**: Follow task breakdown systematically

---

**Quickstart Version**: 1.0.0
**Last Updated**: 2025-10-19
**Status**: Ready for development
