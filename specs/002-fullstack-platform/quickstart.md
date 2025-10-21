# Phase 1: Developer Quickstart Guide

**Feature**: Full-Stack VendorEval Platform
**Branch**: `002-fullstack-platform`
**Date**: 2025-10-19
**Plan**: [plan.md](plan.md)

## Purpose

This guide helps developers set up the full-stack VendorEval platform locally, configure all required services (Supabase, Discord, GitHub, Anthropic), and understand the development workflow.

---

## Prerequisites

### Required Software

- **Node.js**: 20+ (check with `node --version`)
- **npm**: 10+ (included with Node.js)
- **Git**: Latest version
- **Docker Desktop**: For Supabase local development
- **Supabase CLI**: For database migrations and type generation
- **Code Editor**: VS Code recommended (with ESLint + Prettier extensions)

### Required Accounts

1. **Supabase**: Free account at [supabase.com](https://supabase.com)
2. **Discord Developer**: Account at [discord.com/developers](https://discord.com/developers)
3. **GitHub**: Personal access token with `repo` scope
4. **Anthropic**: API key from [console.anthropic.com](https://console.anthropic.com)
5. **Vercel** (optional for deployment): Account at [vercel.com](https://vercel.com)

---

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/your-username/vendoreval3.git
cd vendoreval3
git checkout 002-fullstack-platform
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install evaluation-tool dependencies
cd apps/evaluation-tool
npm install
cd ../..

# Install docs dependencies (optional)
cd apps/docs
npm install
cd ../..
```

### 3. Install Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# Windows (via Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Linux
brew install supabase/tap/supabase

# Verify installation
supabase --version
```

---

## Local Development Setup

### 1. Start Supabase Local Server

**First time setup**:
```bash
# Initialize Supabase project
supabase init

# Start local Supabase (PostgreSQL, Auth, Edge Functions)
supabase start
```

**Output** (save these values):
```
Started supabase local development setup.

API URL: http://localhost:54321
GraphQL URL: http://localhost:54321/graphql/v1
DB URL: postgresql://postgres:postgres@localhost:54322/postgres
Studio URL: http://localhost:54323
Inbucket URL: http://localhost:54324
JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Subsequent starts**:
```bash
supabase start  # Starts existing containers
```

**Stop local Supabase**:
```bash
supabase stop
```

---

### 2. Run Database Migrations

```bash
# Apply all migrations to local database
supabase db reset  # Resets DB and runs all migrations

# Or apply migrations incrementally
supabase migration up
```

**Verify migrations**:
```bash
# Open Supabase Studio (database UI)
open http://localhost:54323

# Or connect via psql
psql postgresql://postgres:postgres@localhost:54322/postgres
```

---

### 3. Seed Database

```bash
# Run seed script to populate initial data
cd scripts
npm run seed:local

# Or manually via SQL
psql postgresql://postgres:postgres@localhost:54322/postgres < supabase/seed/seed.sql
```

**Seed script populates**:
- 6 categories (SEE, CHANGE, USE, ADAPT, LEAVE, LEARN)
- 20 evaluation questions
- 1 super admin user (you)
- 1 pre-analyzed vendor (Glean)
- Site settings

---

### 4. Configure Environment Variables

**Create `.env.local` file** in `apps/evaluation-tool/`:

```bash
# Supabase
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # From supabase start output

# Discord OAuth (optional for local, see Discord Setup below)
# VITE_DISCORD_CLIENT_ID=your-discord-client-id

# GitHub Feedback (optional for local)
# GITHUB_TOKEN=your-github-personal-access-token
# GITHUB_REPO_OWNER=your-username
# GITHUB_REPO_NAME=vendoreval3

# Anthropic Claude API (optional for local)
# ANTHROPIC_API_KEY=sk-ant-...
```

**For Edge Functions** (create `supabase/.env`):

```bash
# Discord
DISCORD_GUILD_ID=1254761492608188517
DISCORD_BOT_TOKEN=your-discord-bot-token

# GitHub
GITHUB_TOKEN=your-github-personal-access-token
GITHUB_REPO_OWNER=your-username
GITHUB_REPO_NAME=vendoreval3

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Supabase (automatically set by Supabase CLI)
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

### 5. Start Development Server

```bash
cd apps/evaluation-tool
npm run dev
```

**Access app**:
- Frontend: http://localhost:5173
- Supabase Studio: http://localhost:54323
- Email testing (Inbucket): http://localhost:54324

---

## External Service Configuration

### Discord OAuth Setup

#### 1. Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **New Application**
3. Name: "VendorEval (Local Dev)"
4. Click **Create**

#### 2. Configure OAuth

1. Go to **OAuth2** → **General**
2. Copy **Client ID** and **Client Secret**
3. Add Redirect URL: `http://localhost:54321/auth/v1/callback`
4. Save Changes

#### 3. Create Discord Bot

1. Go to **Bot** tab
2. Click **Add Bot**
3. Under **Privileged Gateway Intents**, enable:
   - Server Members Intent
4. Click **Reset Token** → Copy bot token

#### 4. Add Bot to Server

1. Go to **OAuth2** → **URL Generator**
2. Select scopes:
   - `bot`
   - `identify`
   - `guilds`
3. Select bot permissions:
   - Read Messages/View Channels
4. Copy generated URL
5. Open in browser → Add to Discord server `1254761492608188517`

#### 5. Configure Supabase Auth

```bash
# Open Supabase Studio
open http://localhost:54323

# Navigate to: Authentication → Providers → Discord
# Enable Discord provider
# Enter Client ID and Client Secret
# Save
```

**Test Discord OAuth**:
```bash
# Start app
cd apps/evaluation-tool && npm run dev

# Click "Sign in with Discord"
# Should redirect to Discord OAuth page
```

---

### GitHub Personal Access Token

#### 1. Create Token

1. Go to [GitHub Settings → Developer Settings](https://github.com/settings/tokens)
2. Click **Personal access tokens** → **Tokens (classic)**
3. Click **Generate new token (classic)**
4. Name: "VendorEval Feedback"
5. Expiration: 90 days (or custom)
6. Select scopes:
   - `repo` (full repository access)
7. Click **Generate token**
8. **COPY TOKEN** (you won't see it again!)

#### 2. Add to Environment

```bash
# Add to supabase/.env
GITHUB_TOKEN=ghp_your_token_here
GITHUB_REPO_OWNER=your-username
GITHUB_REPO_NAME=vendoreval3
```

**Test Feedback System**:
```bash
# Deploy Edge Function locally
supabase functions serve submit-feedback

# Test via curl
curl -X POST http://localhost:54321/functions/v1/submit-feedback \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"pageUrl": "/test", "message": "Test feedback"}'

# Check GitHub repo for new issue
```

---

### Anthropic Claude API

#### 1. Get API Key

1. Go to [Anthropic Console](https://console.anthropic.com)
2. Create account (if needed)
3. Navigate to **API Keys**
4. Click **Create Key**
5. Name: "VendorEval Tone Generation"
6. **COPY KEY** (starts with `sk-ant-...`)

#### 2. Add to Environment

```bash
# Add to supabase/.env
ANTHROPIC_API_KEY=sk-ant-your_key_here
```

**Test Tone Generation**:
```bash
# Deploy Edge Function locally
supabase functions serve generate-corporate-tone

# Test via curl
curl -X POST http://localhost:54321/functions/v1/generate-corporate-tone \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "noBsText": "Can you see the prompts or is it magic?",
    "contentType": "question"
  }'
```

---

## Development Workflow

### 1. Feature Development

```bash
# 1. Create feature branch (SpecKit manages this)
git checkout -b 003-new-feature

# 2. Run app in dev mode
cd apps/evaluation-tool
npm run dev

# 3. Make changes, hot reload active
# Edit files in src/

# 4. Run tests after changes
npm run test

# 5. Commit changes
git add .
git commit -m "Add new feature"
```

---

### 2. Database Schema Changes

```bash
# 1. Create new migration
supabase migration new add_new_table

# 2. Edit migration file
code supabase/migrations/00007_add_new_table.sql

# 3. Apply migration locally
supabase db reset  # Resets DB and runs all migrations

# 4. Verify in Supabase Studio
open http://localhost:54323

# 5. Regenerate TypeScript types
supabase gen types typescript --local > apps/evaluation-tool/src/types/database.ts

# 6. Commit migration
git add supabase/migrations/00007_add_new_table.sql
git commit -m "Add new table for feature X"
```

---

### 3. Edge Function Development

```bash
# 1. Create new function
supabase functions new my-function

# 2. Edit function
code supabase/functions/my-function/index.ts

# 3. Serve function locally
supabase functions serve my-function

# 4. Test in another terminal
curl -X POST http://localhost:54321/functions/v1/my-function \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

# 5. Deploy to local Supabase
# (already deployed via supabase functions serve)

# 6. Commit function
git add supabase/functions/my-function/
git commit -m "Add my-function Edge Function"
```

---

### 4. Testing

**Unit tests**:
```bash
cd apps/evaluation-tool
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

**Integration tests** (requires local Supabase running):
```bash
npm run test:integration
```

**E2E tests** (requires app running):
```bash
# Terminal 1: Start app
npm run dev

# Terminal 2: Run E2E tests
npm run test:e2e

# Run specific test
npm run test:e2e -- evaluation.spec.ts
```

---

### 5. Linting and Formatting

```bash
# Lint
npm run lint

# Fix linting errors
npm run lint:fix

# Format with Prettier
npm run format

# Type check
npm run typecheck
```

---

## Production Deployment

### 1. Deploy to Supabase (Production)

```bash
# 1. Link local project to Supabase cloud project
supabase link --project-ref YOUR_PROJECT_REF

# 2. Push database migrations
supabase db push

# 3. Deploy Edge Functions
supabase functions deploy check-discord-membership
supabase functions deploy submit-feedback
supabase functions deploy generate-corporate-tone

# 4. Set production environment variables
supabase secrets set DISCORD_GUILD_ID=1254761492608188517
supabase secrets set DISCORD_BOT_TOKEN=your-bot-token
supabase secrets set GITHUB_TOKEN=your-github-token
supabase secrets set ANTHROPIC_API_KEY=your-anthropic-key
```

---

### 2. Deploy Frontend to Vercel

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy from apps/evaluation-tool directory
cd apps/evaluation-tool
vercel

# 4. Set environment variables in Vercel dashboard
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-production-anon-key

# 5. Configure Discord OAuth redirect
# Add to Discord Developer Portal:
# https://your-app.vercel.app/auth/callback
```

---

### 3. Configure Production Discord OAuth

1. Go to Discord Developer Portal
2. Create **new application** for production (or use existing)
3. Add redirect URL: `https://your-project.supabase.co/auth/v1/callback`
4. Update Supabase Auth settings with production Discord credentials

---

## Common Tasks

### Reset Local Database

```bash
supabase db reset  # Drops all tables, runs migrations, runs seed
```

### View Database Logs

```bash
supabase db logs
```

### View Edge Function Logs

```bash
supabase functions logs check-discord-membership
```

### Generate TypeScript Types from Schema

```bash
supabase gen types typescript --local > apps/evaluation-tool/src/types/database.ts
```

### Run Seed Script

```bash
cd scripts
npm run seed:local
```

---

## Troubleshooting

### Supabase Won't Start

**Error**: `Docker is not running`

**Fix**:
```bash
# Start Docker Desktop
open -a Docker

# Wait for Docker to start, then:
supabase start
```

---

### Database Connection Error

**Error**: `connection refused`

**Fix**:
```bash
# Check if Supabase is running
supabase status

# If not, start it
supabase start

# Verify connection
psql postgresql://postgres:postgres@localhost:54322/postgres
```

---

### Edge Function Not Working

**Error**: `Function not found`

**Fix**:
```bash
# List deployed functions
supabase functions list

# Deploy function
supabase functions deploy your-function

# Or serve locally
supabase functions serve your-function
```

---

### Discord OAuth Redirect Error

**Error**: `redirect_uri_mismatch`

**Fix**:
1. Check Discord Developer Portal → OAuth2 → Redirects
2. Ensure `http://localhost:54321/auth/v1/callback` is added
3. For production, add `https://your-project.supabase.co/auth/v1/callback`

---

### GitHub Issue Creation Fails

**Error**: `Bad credentials`

**Fix**:
```bash
# Verify GitHub token has 'repo' scope
# Regenerate token if needed

# Update supabase/.env
GITHUB_TOKEN=your-new-token

# Restart Edge Functions
supabase functions serve submit-feedback
```

---

## Development Best Practices

### 1. Database Migrations

- **Always** create migrations for schema changes (don't edit database directly)
- **Test** migrations locally before deploying to production
- **Never** edit existing migrations (create new ones to fix issues)
- **Document** complex migrations with comments

### 2. Environment Variables

- **Never** commit `.env.local` or `supabase/.env` files (gitignored)
- **Always** use `.env.example` as template for required variables
- **Document** new environment variables in this quickstart guide

### 3. Testing

- **Write tests** before implementation (TDD encouraged)
- **Run tests** before committing (`npm run test`)
- **Maintain coverage** above 70% for business logic

### 4. Code Quality

- **Lint** before committing (`npm run lint:fix`)
- **Format** with Prettier (`npm run format`)
- **Type check** before pushing (`npm run typecheck`)

### 5. Git Workflow

- **Feature branches** for all changes (`003-feature-name`)
- **Meaningful commits** (start with verb: Add, Fix, Update, Refactor)
- **Pull requests** before merging to main (even solo dev - good practice)

---

## Useful Commands Reference

### Supabase CLI

```bash
supabase start              # Start local Supabase
supabase stop               # Stop local Supabase
supabase status             # Check status
supabase db reset           # Reset database (drops + migrations + seed)
supabase db push            # Push local migrations to cloud
supabase functions deploy   # Deploy Edge Function
supabase gen types typescript --local  # Generate TypeScript types
```

### npm Scripts (apps/evaluation-tool)

```bash
npm run dev                 # Start development server
npm run build               # Build for production
npm run preview             # Preview production build
npm run test                # Run unit tests
npm run test:watch          # Run tests in watch mode
npm run test:e2e            # Run E2E tests with Playwright
npm run lint                # Lint code
npm run lint:fix            # Fix linting errors
npm run format              # Format code with Prettier
npm run typecheck           # TypeScript type checking
```

---

## Next Steps

After completing this quickstart:

1. **Explore the codebase**:
   - [data-model.md](data-model.md) - Database schema
   - [contracts/api-spec.md](contracts/api-spec.md) - API contracts
   - [plan.md](plan.md) - Technical implementation plan

2. **Implement features**:
   - Run `/speckit.tasks` to generate task breakdown
   - Follow task order (respects dependencies)
   - Test after each feature area

3. **Deploy to production**:
   - Follow Production Deployment section above
   - Test thoroughly on staging environment first
   - Monitor logs after deployment

---

## Support

**Issues**: File bugs/features at [GitHub Issues](https://github.com/your-username/vendoreval3/issues)

**Documentation**:
- Supabase: https://supabase.com/docs
- Discord API: https://discord.com/developers/docs
- React 19: https://react.dev
- Vite: https://vitejs.dev

**Contact**: contact@vendoreval.com

---

**Last Updated**: 2025-10-19
**Next**: Run `/speckit.tasks` to generate implementation task breakdown
