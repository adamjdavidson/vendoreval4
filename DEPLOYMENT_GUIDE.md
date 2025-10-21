# Deployment Guide: Two Separate Vercel Projects

**Architecture**: TWO separate Vercel projects deploying from the same GitHub repository.

**Last Updated**: October 21, 2025

---

## Prerequisites

- ✅ Code committed to `002-fullstack-platform` branch
- ✅ GitHub repository: `adamjdavidson/vendoreval4`
- ✅ Vercel account connected to GitHub
- ✅ Supabase cloud database: `leicgzljnodyrdbbcgoq.supabase.co`

---

## Step-by-Step Deployment

### Phase 1: Configure Vercel Projects (Critical)

#### Project 1: Documentation Site

**Beads Task**: vendoreval3-554

1. **Go to Vercel Dashboard**
   - URL: https://vercel.com/dashboard
   - Select your team/account

2. **Find the Docs Project**
   - Look for existing project connected to `vendoreval4` repo
   - OR create new project: Add New → Project → Import from GitHub

3. **Configure Root Directory** (THIS IS THE CRITICAL STEP)
   - Go to: Settings → General
   - Find: "Root Directory" setting
   - Click: Edit
   - Set to: `apps/docs`
   - Click: Save

4. **Verify Framework Settings**
   - Framework Preset: Should auto-detect as "Docusaurus" or "Other"
   - Build Command: `npm run build` (or leave empty for auto-detect)
   - Output Directory: `build` (or leave empty for auto-detect)
   - Install Command: `npm install` (or leave empty for auto-detect)

5. **Set Git Branch**
   - Production Branch: `002-fullstack-platform` (or `main` after merge)

#### Project 2: Evaluation Tool

**Beads Task**: vendoreval3-555

1. **Go to Vercel Dashboard**
   - URL: https://vercel.com/dashboard
   - Select your team/account

2. **Find the Evaluation Tool Project**
   - Look for existing project connected to `vendoreval4` repo
   - OR create new project: Add New → Project → Import from GitHub
   - **IMPORTANT**: You can import the SAME GitHub repo multiple times

3. **Configure Root Directory** (THIS IS THE CRITICAL STEP)
   - Go to: Settings → General
   - Find: "Root Directory" setting
   - Click: Edit
   - Set to: `apps/evaluation-tool`
   - Click: Save

4. **Verify Framework Settings**
   - Framework Preset: Should auto-detect as "Vite" or "Other"
   - Build Command: `npm run build` (or leave empty for auto-detect)
   - Output Directory: `dist` (or leave empty for auto-detect)
   - Install Command: `npm install` (or leave empty for auto-detect)

5. **Set Git Branch**
   - Production Branch: `002-fullstack-platform` (or `main` after merge)

#### Project 2b: Set Environment Variables

**Beads Task**: vendoreval3-560

1. **In Evaluation Tool Project Settings**
   - Go to: Settings → Environment Variables

2. **Add Production Environment Variables**
   ```
   VITE_SUPABASE_URL = https://leicgzljnodyrdbbcgoq.supabase.co
   VITE_SUPABASE_ANON_KEY = [get from Supabase dashboard]
   ```
   - Target: Production, Preview, Development (check all)

3. **Get Supabase Anon Key**
   - Go to: https://supabase.com/dashboard/project/leicgzljnodyrdbbcgoq
   - Settings → API
   - Copy: `anon` `public` key

---

### Phase 2: Trigger Deployments

#### Deploy Docs Project

**Beads Task**: vendoreval3-556

1. **Trigger Deployment**
   - Option A: Push a new commit to `002-fullstack-platform` branch
   - Option B: In Vercel Dashboard → Deployments → Redeploy

2. **Monitor Build Logs**
   - Click on the deployment
   - Watch the build logs
   - Should see:
     ```
     Running "npm install"
     Running "npm run build"
     [Docusaurus build output]
     Build Completed
     ```

3. **Verify Success**
   - Deployment Status: Ready
   - Visit the deployment URL
   - Verify docs site loads correctly

4. **If Build Fails**
   - Check that Root Directory is set to `apps/docs`
   - Check build logs for specific errors
   - Verify `apps/docs/package.json` has `build` script

#### Deploy Evaluation Tool Project

**Beads Task**: vendoreval3-557

1. **Trigger Deployment**
   - Option A: Push a new commit to `002-fullstack-platform` branch
   - Option B: In Vercel Dashboard → Deployments → Redeploy

2. **Monitor Build Logs**
   - Click on the deployment
   - Watch the build logs
   - Should see:
     ```
     Running "npm install"
     Running "npm run build"
     [Vite build output]
     Build Completed
     ```

3. **Verify Success**
   - Deployment Status: Ready
   - Visit the deployment URL
   - Verify evaluation tool loads correctly

4. **If Build Fails**
   - Check that Root Directory is set to `apps/evaluation-tool`
   - Check build logs for specific errors
   - Verify `apps/evaluation-tool/package.json` has `build` script
   - Verify environment variables are set

---

### Phase 3: Configure Domains (Optional)

**Beads Task**: vendoreval3-558

#### Option A: Separate Domains

1. **Docs Project**
   - Settings → Domains
   - Add: `vendor.feedforward.ai`
   - Or use Vercel auto-generated: `vendoreval-docs.vercel.app`

2. **Evaluation Tool Project**
   - Settings → Domains
   - Add: `tool.vendor.feedforward.ai` (subdomain)
   - Or use Vercel auto-generated: `vendoreval-tool.vercel.app`

#### Option B: Unified Domain (Advanced)

This requires Vercel Edge Config or custom routing - can be configured later.

---

### Phase 4: Configure Supabase CORS

**Beads Task**: vendoreval3-559

1. **Go to Supabase Dashboard**
   - URL: https://supabase.com/dashboard/project/leicgzljnodyrdbbcgoq
   - Navigate to: Settings → API

2. **Add Allowed Origins**
   - Find: "CORS" or "Allowed Origins" section
   - Add both production URLs:
     ```
     https://[your-docs-deployment].vercel.app
     https://[your-tool-deployment].vercel.app
     ```
   - If using custom domains, add those too:
     ```
     https://vendor.feedforward.ai
     https://tool.vendor.feedforward.ai
     ```

3. **Save Changes**

---

### Phase 5: End-to-End Testing

#### Test Docs Site

**Beads Task**: vendoreval3-561

1. **Visit Production URL**
2. **Test Navigation**
   - Click Framework link
   - Navigate to different docs pages
   - Verify all links work

3. **Verify Styling**
   - Check hero section layout
   - Verify colors match design system
   - Test on mobile (resize browser)

4. **Check Performance**
   - Page load should be fast
   - No console errors in browser DevTools

#### Test Evaluation Tool

**Beads Task**: vendoreval3-562

1. **Visit Production URL**
2. **Test Supabase Connection**
   - App should load without errors
   - Check browser console for Supabase connection
   - Verify no CORS errors

3. **Test Evaluation Workflow**
   - Start a new evaluation
   - Answer questions
   - Complete evaluation
   - Verify data saves to Supabase

4. **Test in Test Mode**
   - Should work with anonymous user
   - No authentication required

---

## Troubleshooting

### Build Fails: "Cannot find package.json"

**Solution**: Root Directory not set correctly
- Verify: Settings → General → Root Directory is `apps/docs` or `apps/evaluation-tool`

### Build Fails: "Missing script: build"

**Solution**: Build command incorrect
- Verify: `package.json` in app directory has `"build": "..."` script
- Or: Set Build Command in Vercel to explicit command

### Runtime Error: "VITE_SUPABASE_URL is not defined"

**Solution**: Environment variables not set
- Go to: Settings → Environment Variables
- Add: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Redeploy

### CORS Error: "Origin not allowed"

**Solution**: Supabase CORS not configured
- Go to Supabase Dashboard → Settings → API
- Add deployment URL to allowed origins

### Wrong App Deploys

**Solution**: Multiple projects pointing to same Root Directory
- Verify: Each project has DIFFERENT Root Directory
- Docs: `apps/docs`
- Tool: `apps/evaluation-tool`

---

## Success Criteria

- ✅ Docs project builds and deploys successfully
- ✅ Evaluation tool project builds and deploys successfully
- ✅ Both projects have different Root Directories configured
- ✅ Environment variables set for evaluation tool
- ✅ Supabase CORS allows both deployment URLs
- ✅ End-to-end testing passes for both apps
- ✅ No build errors in Vercel logs
- ✅ No runtime errors in browser console

---

## File Structure (For Reference)

```
vendoreval4/
├── apps/
│   ├── docs/
│   │   ├── package.json          ← Has "build" script
│   │   ├── vercel.json            ← Project-specific config
│   │   ├── docusaurus.config.ts
│   │   └── [other docs files]
│   │
│   └── evaluation-tool/
│       ├── package.json          ← Has "build" script
│       ├── vercel.json            ← Project-specific config
│       ├── vite.config.ts
│       └── [other tool files]
│
├── .git/                          ← Same repo, two projects
└── [NO root vercel.json]          ← Not needed for two-project setup
```

---

## Architecture Diagram

```
GitHub Repo: adamjdavidson/vendoreval4
    │
    ├─► Vercel Project 1: "VendorEval Docs"
    │   └─► Root Directory: apps/docs
    │       └─► Builds: Docusaurus → /build
    │           └─► Deploys to: vendor.feedforward.ai
    │
    └─► Vercel Project 2: "VendorEval Tool"
        └─► Root Directory: apps/evaluation-tool
            └─► Builds: Vite → /dist
                └─► Deploys to: tool.vendor.feedforward.ai
                    └─► Connects to: Supabase
```

---

## Next Steps After Deployment

1. Merge `002-fullstack-platform` to `main`
2. Update production branch in both Vercel projects to `main`
3. Disable test mode in `apps/evaluation-tool/src/config/app.config.ts`
4. Set up proper authentication (Discord/Email)
5. Configure custom domains
6. Set up monitoring and analytics
7. Create deployment automation (CI/CD)

---

**Remember**: The KEY to making this work is setting **Root Directory** in Vercel Dashboard for EACH project.
