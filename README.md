# VendorEval4: AI Vendor Evaluation Framework

A systematic framework for Fortune 500 executives to evaluate AI vendors across 6 critical dimensions.

**Live Production:**
- 📚 **Documentation & CMS**: https://vendoreval4-docs.vercel.app
- 🔧 **Evaluation Tool**: https://vendoreval4.vercel.app
- 🎨 **Admin CMS**: https://vendoreval4-docs.vercel.app/admin/pages

---

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Development Setup](#development-setup)
- [Production Deployment](#production-deployment)
- [CMS Usage Guide](#cms-usage-guide)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

---

## Project Overview

VendorEval4 provides:
- **Interactive Evaluation Tool**: 20-question assessment with real-time scoring
- **Documentation Site**: Comprehensive framework explanation with database-backed CMS
- **Dual Tone Content**: "No BS" (candid) and "Corporate" (professional) versions
- **Admin CMS**: Manage documentation content with AI-powered tone generation
- **Professional Reports**: PDF and Markdown exports

## Architecture

### Two-Project Deployment (Constitutional Principle)

**We use TWO separate Vercel projects**, not a monorepo deployment. This is defined in Article X of our constitution.

```
GitHub Repository: adamjdavidson/vendoreval4
    │
    ├─► Vercel Project 1: vendoreval4-docs
    │   ├─ Root Directory: apps/docs
    │   ├─ Framework: Docusaurus
    │   ├─ URL: https://vendoreval4-docs.vercel.app
    │   └─ Features: Documentation + CMS Admin Panel
    │
    └─► Vercel Project 2: vendoreval4
        ├─ Root Directory: apps/evaluation-tool
        ├─ Framework: Vite
        ├─ URL: https://vendoreval4.vercel.app
        └─ Features: Interactive Evaluation Tool
```

### Shared Backend

Both applications connect to the **same Supabase PostgreSQL database**:
- Database: `leicgzljnodyrdbbcgoq.supabase.co`
- Shared tables: `users`, `admin_users`, `pages`, `evaluations`, etc.
- Supabase Edge Functions for AI tone generation

---

## Quick Start

### Prerequisites

- **Node.js**: v20.0.0 or higher
- **npm**: v10.0.0 or higher
- **Git**: Latest version
- **Supabase CLI**: v2.51.0 or higher (for local development)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/adamjdavidson/vendoreval4.git
   cd vendoreval4
   ```

2. **Start Supabase locally**
   ```bash
   cd supabase
   supabase start
   ```
   This will output local URLs and keys. Keep this terminal open.

3. **Install and run Evaluation Tool**
   ```bash
   cd apps/evaluation-tool
   npm install
   npm run dev
   ```
   Visit: http://localhost:5173

4. **Install and run Documentation Site (in new terminal)**
   ```bash
   cd apps/docs
   npm install
   npm start
   ```
   Visit: http://localhost:3000

5. **Access CMS Admin Panel**
   Visit: http://localhost:3000/admin/pages

---

## Development Setup

### Environment Variables

Create `.env.local` files in each app directory:

#### `apps/evaluation-tool/.env.local`
```bash
# Supabase Configuration
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=<anon-key-from-supabase-start>

# Optional: Discord OAuth (for authentication)
# VITE_DISCORD_CLIENT_ID=your-discord-client-id

# Optional: GitHub Feedback (for issue tracking)
# GITHUB_TOKEN=your-github-token
# GITHUB_REPO_OWNER=your-username
# GITHUB_REPO_NAME=vendoreval4
```

#### `apps/docs/.env` (for Docusaurus build)
```bash
# Supabase Configuration (for CMS)
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=<anon-key-from-supabase-start>
```

**Note**: For local development, Supabase credentials are already hardcoded as fallbacks. Environment variables are primarily needed for production.

### Database Setup

The local Supabase instance is configured via migrations in `supabase/migrations/`:

```bash
# Reset database to latest migrations
cd supabase
supabase db reset

# Seed database with sample data
deno run --allow-read --allow-env --allow-net seed.ts
```

### Running Tests

```bash
# Evaluation tool tests
cd apps/evaluation-tool
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

---

## Production Deployment

### Vercel Configuration

Both projects are deployed to **separate Vercel projects** from the same GitHub repository.

#### Project 1: Documentation Site (vendoreval4-docs)

**Vercel Dashboard Settings:**
- **Root Directory**: `apps/docs`
- **Framework Preset**: Docusaurus (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Environment Variables**:
  - `SUPABASE_URL` = `https://leicgzljnodyrdbbcgoq.supabase.co`
  - `SUPABASE_ANON_KEY` = `<production-anon-key>`

#### Project 2: Evaluation Tool (vendoreval4)

**Vercel Dashboard Settings:**
- **Root Directory**: `apps/evaluation-tool`
- **Framework Preset**: Vite (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_SUPABASE_URL` = `https://leicgzljnodyrdbbcgoq.supabase.co`
  - `VITE_SUPABASE_ANON_KEY` = `<production-anon-key>`

### Supabase Edge Functions

Deploy Edge Functions to Supabase:

```bash
cd supabase

# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy generate-corporate-tone
```

**Required Secrets** (set in Supabase Dashboard):
- `ANTHROPIC_API_KEY` - For AI tone generation in CMS

### Manual Deployment Steps

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed step-by-step instructions.

---

## CMS Usage Guide

### Accessing the CMS

**Production**: https://vendoreval4-docs.vercel.app/admin/pages
**Local**: http://localhost:3000/admin/pages

**Note**: Currently in alpha testing mode - authentication is permissive. Before public launch, authentication will be restricted to verified admin users.

### Creating a New Page

1. **Navigate to Admin Panel**
   - Click "Create New Page" button

2. **Enter Page Details**
   - **Title (No BS)**: Direct, candid title
   - **Title (Corporate)**: Professional, polished title
   - **Slug**: URL path (e.g., `my-page` → `/db/my-page`)

3. **Write Content**
   - Switch between "No BS" and "Corporate" versions using toggle
   - Use Markdown for formatting
   - Live preview updates in real-time

4. **Auto-Generate Corporate Tone** (Optional)
   - Write your "No BS" version first
   - Click "Auto-Generate Corporate" button
   - AI will generate a professional version using Claude API
   - Review and edit the generated version as needed

5. **Publish**
   - Toggle "Published" to make page live
   - Published pages appear at `/db/{slug}` on docs site

### Managing Existing Pages

- **Edit**: Click "Edit" button on any page
- **Delete**: Click "Delete" button (requires confirmation)
- **Publish/Unpublish**: Toggle published status
- **Search**: Use search box to filter pages by title/slug

### Database Pages Plugin

Published pages are automatically rendered by the Docusaurus database pages plugin:
- Plugin fetches published pages from Supabase at build time
- Creates dynamic routes at `/db/{slug}`
- Includes tone toggle for dual-version viewing
- Updates on each deployment

---

## Technology Stack

### Evaluation Tool
- **React 19**: Latest React with concurrent features
- **Vite 7**: Fast build tool with HMR
- **TypeScript 5.7**: Strict mode enabled
- **Tailwind CSS v4**: Utility-first CSS framework
- **Vitest + React Testing Library**: Testing framework
- **Supabase**: PostgreSQL database + authentication

### Documentation Site
- **Docusaurus 3.9.2**: Static site generator
- **React 19**: Component framework
- **TypeScript**: Type safety
- **Supabase**: Database for CMS content
- **Custom Plugin**: Database pages renderer

### Backend & Infrastructure
- **Supabase PostgreSQL**: Shared database
- **Supabase Edge Functions**: Serverless functions (Deno runtime)
- **Vercel**: Hosting platform (2 separate projects)
- **Claude API**: AI tone generation for CMS

### Development Tools
- **Beads**: Issue tracking (`.beads/`)
- **SpecKit**: Spec-driven development (`.specify/`)
- **ESLint + Prettier**: Code quality
- **Vitest**: Unit testing

---

## Project Structure

```
vendoreval4/
├── apps/
│   ├── evaluation-tool/          # React + Vite evaluation tool
│   │   ├── src/
│   │   │   ├── components/       # React components
│   │   │   ├── contexts/         # React contexts (Auth, etc.)
│   │   │   ├── services/         # API services
│   │   │   ├── config/           # App configuration
│   │   │   └── lib/              # Supabase client
│   │   ├── tests/                # Vitest tests
│   │   ├── package.json
│   │   └── vercel.json           # Vercel config for this project
│   │
│   └── docs/                      # Docusaurus documentation site
│       ├── docs/                  # MDX documentation files
│       ├── src/
│       │   ├── components/        # React components
│       │   │   ├── admin/         # CMS admin components
│       │   │   └── auth/          # Authentication components
│       │   ├── pages/             # Docusaurus pages
│       │   │   └── admin/         # CMS admin pages
│       │   ├── services/          # CMS service layer
│       │   ├── lib/               # Supabase client
│       │   └── plugins/           # Custom Docusaurus plugins
│       │       └── docusaurus-plugin-database-pages/  # DB pages plugin
│       ├── docusaurus.config.ts   # Docusaurus configuration
│       ├── package.json
│       └── vercel.json            # Vercel config for this project
│
├── supabase/
│   ├── migrations/                # Database migrations
│   ├── functions/                 # Edge Functions
│   │   └── generate-corporate-tone/  # AI tone generation
│   └── config.toml                # Supabase configuration
│
├── shared/                        # Shared TypeScript types
│   └── types/
│       └── index.ts               # Core type definitions
│
├── specs/                         # SpecKit specifications
│   ├── 001-ai-vendor-evaluation/  # Phase 1 spec
│   └── 002-fullstack-platform/    # Phase 2 spec (CMS)
│       ├── spec.md                # Feature specification
│       ├── plan.md                # Implementation plan
│       ├── tasks.md               # Task breakdown
│       ├── data-model.md          # Database schema
│       └── contracts/             # API contracts
│
├── .specify/                      # SpecKit configuration
│   └── memory/
│       └── constitution.md        # Project principles
│
├── .beads/                        # Beads issue tracking
│   ├── vendoreval3.db             # SQLite database
│   └── issues.jsonl               # Git-versioned issues
│
├── CLAUDE.md                      # AI assistant instructions
├── DEPLOYMENT_GUIDE.md            # Deployment walkthrough
├── DEPLOYMENT_STATUS.md           # Current deployment status
└── README.md                      # This file
```

---

## Contributing

### Development Workflow

This project uses **Spec-Driven Development** with **Beads** for issue tracking.

#### Check Ready Work
```bash
bd ready --json
```

#### View Project Stats
```bash
bd stats
```

#### Work on a Task
```bash
# List open tasks
bd list --status open

# Update task status
bd update <issue-id> --status in_progress

# Close completed task
bd close <issue-id> --reason "Implementation complete"
```

### Code Standards

- **TypeScript**: Strict mode enabled, no `any` types
- **React**: Functional components with hooks
- **Testing**: Unit tests for all business logic
- **Commits**: Conventional commits format
- **PRs**: Required for main branch

See [CLAUDE.md](./CLAUDE.md) for detailed:
- Development guidelines
- SpecKit workflow
- Beads usage
- Code standards
- Context7 usage for library documentation

### Branch Strategy

- `main`: Production-ready code (currently not deployed)
- `002-fullstack-platform`: Active development branch
- Feature branches: `<issue-id>-feature-name`

---

## Key Features

### 6-Dimension Evaluation Framework

1. **SEE**: Can you see how it works? (transparency)
2. **CHANGE**: Can you control it? (configurability)
3. **USE**: Is it actually useful? (output quality)
4. **ADAPT**: Can it evolve? (future-proofing)
5. **LEAVE**: Can you exit? (no vendor lock-in)
6. **LEARN**: Does it build capability? (skills transfer)

### Dual Tone Content

- **No BS Version**: Direct, candid, cuts through marketing
- **Corporate Version**: Professional, politically safe, suitable for executives
- **AI Tone Generation**: Automatically convert between tones using Claude API

### CMS Features

- ✅ Database-backed content management
- ✅ Dual-tone editor with version toggle
- ✅ Live Markdown preview
- ✅ AI-powered tone generation (Claude API)
- ✅ Publish/unpublish workflow
- ✅ Search and filter pages
- ✅ Real-time database updates

---

## Documentation

### Project Documentation
- **Constitution**: `.specify/memory/constitution.md` - Project principles and guidelines
- **Spec (Phase 1)**: `specs/001-ai-vendor-evaluation/spec.md` - Evaluation tool specification
- **Spec (Phase 2)**: `specs/002-fullstack-platform/spec.md` - CMS and backend specification
- **Implementation Plan**: `specs/002-fullstack-platform/plan.md` - Technical architecture
- **Data Model**: `specs/002-fullstack-platform/data-model.md` - Database schema

### Deployment Documentation
- **Deployment Guide**: `DEPLOYMENT_GUIDE.md` - Step-by-step deployment walkthrough
- **Deployment Status**: `DEPLOYMENT_STATUS.md` - Current deployment state
- **Beads Tasks**: Run `bd list` to see tracked work items

---

## Support

For issues or questions:

1. **Check Beads Issues**: `bd list --status open`
2. **Review Documentation**: Start with `DEPLOYMENT_STATUS.md`
3. **Check Specs**: See `specs/002-fullstack-platform/`
4. **Read Constitution**: `.specify/memory/constitution.md`
5. **Developer Guide**: `CLAUDE.md`

---

## Version History

- **v0.2.0** (2025-10-21): CMS deployed, two-project Vercel architecture, Supabase backend
- **v0.1.0** (2025-10-20): Initial deployment with evaluation tool
- **v0.0.1** (2025-10-19): Project setup and Phase 1 completion

---

**Version**: v0.2.0-alpha
**Last Updated**: 2025-10-21
**Status**: ✅ Deployed to Production (Alpha Testing)
**Branch**: `002-fullstack-platform`
**Production URLs**:
  - Docs: https://vendoreval4-docs.vercel.app
  - Tool: https://vendoreval4.vercel.app
  - CMS: https://vendoreval4-docs.vercel.app/admin/pages
