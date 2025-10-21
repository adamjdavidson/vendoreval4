# Vercel Deployment Guide - vendor.feedforward.ai

Complete step-by-step guide to deploy the unified VendorEval platform to vendor.feedforward.ai.

---

## Prerequisites

- [x] GitHub repository: `adamjdavidson/vendoreval4`
- [x] Branch: `002-fullstack-platform` (commit `877f411`)
- [x] Vercel account with access to feedforward.ai domain
- [x] Supabase project: `leicgzljnodyrdbbcgoq`
- [x] Both apps build successfully locally

---

## Step 1: Create New Vercel Project

1. **Navigate to Vercel Dashboard**
   - Go to <https://vercel.com/dashboard>
   - Click "Add New..." → "Project"

2. **Import Repository**
   - Select "Import Git Repository"
   - Choose `adamjdavidson/vendoreval4`
   - Click "Import"

3. **Configure Project Settings**
   - **Project Name**: `vendoreval-unified` (or similar)
   - **Framework Preset**: Other (leave blank)
   - **Root Directory**: `.` (repository root)
   - **Build Command**: `npm run build:all`
   - **Output Directory**: Leave blank (handled by vercel.json)
   - **Install Command**: `npm install`

4. **Set Environment Variables**

   Add the following environment variables (click "Environment Variables"):

   | Key | Value | Environment |
   |-----|-------|-------------|
   | `VITE_SUPABASE_URL` | `https://leicgzljnodyrdbbcgoq.supabase.co` | Production, Preview |
   | `VITE_SUPABASE_ANON_KEY` | [from Supabase dashboard] | Production, Preview |

   **To get Supabase keys:**
   - Open <https://supabase.com/dashboard/project/leicgzljnodyrdbbcgoq/settings/api>
   - Copy "Project URL" → `VITE_SUPABASE_URL`
   - Copy "anon public" key → `VITE_SUPABASE_ANON_KEY`

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (3-5 minutes)
   - Initial deployment URL: `vendoreval-unified.vercel.app`

---

## Step 2: Configure Custom Domain

1. **Add Domain to Vercel**
   - In Vercel project settings, go to "Domains"
   - Click "Add"
   - Enter: `vendor.feedforward.ai`
   - Click "Add"

2. **Update DNS Records**

   In your DNS provider (wherever feedforward.ai is registered):

   | Type | Name | Value | TTL |
   |------|------|-------|-----|
   | CNAME | `vendor` | `cname.vercel-dns.com.` | 300 |

   **OR** if using A records:

   | Type | Name | Value | TTL |
   |------|------|-------|-----|
   | A | `vendor` | `76.76.21.21` | 300 |

   Note: Vercel will provide exact DNS instructions in the dashboard.

3. **Wait for DNS Propagation**
   - Usually takes 5-15 minutes
   - Can take up to 48 hours in rare cases
   - Check status in Vercel dashboard

4. **Verify SSL Certificate**
   - Vercel automatically provisions SSL via Let's Encrypt
   - Check that <https://vendor.feedforward.ai> shows green padlock
   - Certificate should show "Let's Encrypt" as issuer

---

## Step 3: Update Supabase CORS Settings

1. **Open Supabase Dashboard**
   - Navigate to <https://supabase.com/dashboard/project/leicgzljnodyrdbbcgoq>
   - Click "Settings" (gear icon in sidebar)
   - Click "API"
   - Scroll to "CORS Configuration"

2. **Add Allowed Origins**

   Add the following origins (comma-separated or one per line):

   ```text
   https://vendor.feedforward.ai
   https://vendoreval3.vercel.app
   ```

   Note: Keep `vendoreval3.vercel.app` as fallback during transition.

3. **Save Changes**
   - Click "Save"
   - Changes take effect immediately

---

## Step 4: Verify Deployment

### 4.1 Basic Functionality

1. **Test Documentation Site**
   - Navigate to <https://vendor.feedforward.ai>
   - Should load Docusaurus homepage with two-box hero
   - Verify navigation works (Framework, Maturity Model links)
   - Check mobile responsiveness (resize browser to 320px)

2. **Test Evaluation Tool**
   - Navigate to <https://vendor.feedforward.ai/evaluate>
   - Should load React evaluation tool
   - Click "Start New Evaluation"
   - Enter vendor name
   - Verify questions load from Supabase
   - Answer a few questions
   - Check that grading updates in real-time

### 4.2 Cross-Site Navigation

1. **From Docs to Tool**
   - On docs homepage, click "Start Evaluation" in hero box 2
   - Should navigate to `/evaluate`
   - URL should be `https://vendor.feedforward.ai/evaluate`

2. **From Tool to Docs**
   - On evaluation tool, click browser back button
   - Should return to docs homepage
   - Verify no 404 errors

### 4.3 Database Connectivity

1. **Check Supabase Logs**
   - Open Supabase dashboard
   - Go to "Logs" → "API"
   - Filter by recent requests
   - Should see GET requests to `/categories` and `/questions`
   - Verify no CORS errors

2. **Test Evaluation Flow**
   - Complete full evaluation (answer all 20 questions)
   - Generate PDF report
   - Verify report downloads successfully
   - Check that data persists (refresh page, data should remain)

### 4.4 Performance & Accessibility

1. **Run Lighthouse Audit**
   - Open Chrome DevTools (F12)
   - Go to "Lighthouse" tab
   - Select "Desktop" and "Mobile"
   - Run audit for both docs site and evaluation tool

   **Expected Scores:**
   - Performance: > 90
   - Accessibility: > 95 (target: 100)
   - Best Practices: > 90
   - SEO: > 90

2. **Test Mobile Responsiveness**
   - Resize browser to 320px width
   - Verify two-box hero stacks vertically
   - Check all buttons are tappable
   - Ensure no horizontal scroll
   - Test on real mobile device if possible

### 4.5 Browser Testing

Test on:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## Step 5: Monitor Deployment

### 5.1 Check Build Logs

1. **In Vercel Dashboard**
   - Go to "Deployments"
   - Click on latest deployment
   - Review build logs for errors
   - Check that both apps built successfully:
     ```text
     [docs] Generated static files in "build"
     [evaluation-tool] ✓ built in 1.08s
     ```

### 5.2 Monitor Runtime Logs

1. **Real-time Logs**
   - In Vercel project, go to "Logs"
   - Watch for any runtime errors
   - Check for CORS errors
   - Monitor response times

2. **Analytics**
   - Go to "Analytics" tab
   - Monitor page views
   - Check for high error rates
   - Review response times

---

## Troubleshooting

### Issue: 404 on /evaluate

**Symptoms:** Visiting `/evaluate` shows 404 page

**Solution:**

1. Check `vercel.json` has correct rewrites:

   ```json
   {
     "rewrites": [
       { "source": "/evaluate/:path*", "destination": "/apps/evaluation-tool/dist/:path*" },
       { "source": "/:path*", "destination": "/apps/docs/build/:path*" }
     ]
   }
   ```

2. Verify build output directories:
   - Docs: `apps/docs/build/`
   - Tool: `apps/evaluation-tool/dist/`

3. Redeploy from Vercel dashboard

### Issue: CORS Errors in Console

**Symptoms:** Browser console shows:

```text
Access to fetch at 'https://leicgzljnodyrdbbcgoq.supabase.co' from origin 'https://vendor.feedforward.ai' has been blocked by CORS policy
```

**Solution:**

1. Double-check Supabase CORS settings include `https://vendor.feedforward.ai`
2. Ensure no trailing slashes in CORS origins
3. Wait 5 minutes for changes to propagate
4. Clear browser cache and hard refresh (Ctrl+Shift+R)

### Issue: Environment Variables Not Working

**Symptoms:** Evaluation tool can't connect to Supabase

**Solution:**

1. In Vercel dashboard, go to "Settings" → "Environment Variables"
2. Verify variables are set for "Production" environment
3. Click "..." → "Edit" to confirm values are correct
4. Redeploy after making changes
5. Check build logs for `VITE_SUPABASE_URL` visibility

### Issue: Build Fails

**Symptoms:** Vercel build fails with errors

**Solution:**

1. Check build logs for specific error
2. Common issues:
   - Missing dependencies: Run `npm install` locally
   - TypeScript errors: Run `npm run build` locally
   - Path issues: Verify `vercel.json` paths are correct
3. If local build works but Vercel fails:
   - Check Node.js version (Vercel uses 18.x by default)
   - Verify all dependencies are in `package.json`
   - Check for absolute paths (should be relative)

### Issue: Slow Page Load

**Symptoms:** Site takes >5 seconds to load

**Solution:**

1. Check Vercel region (should be closest to users)
2. Review bundle sizes in build logs
3. Consider code splitting if bundles >500KB
4. Check for large images (optimize with WebP)
5. Enable caching headers in vercel.json

---

## Rollback Procedure

If deployment fails or has critical issues:

### Option 1: Revert to Previous Deployment

1. In Vercel dashboard, go to "Deployments"
2. Find previous working deployment
3. Click "..." → "Promote to Production"
4. Confirm promotion

### Option 2: Use vendoreval3.vercel.app Fallback

1. Update DNS CNAME to point to `vendoreval3.vercel.app`
2. Keep domain pointed at old deployment
3. Fix issues on new deployment
4. Switch back when ready

### Option 3: Rollback Git Commit

1. Locally: `git revert 877f411`
2. Push to GitHub: `git push origin 002-fullstack-platform`
3. Vercel auto-deploys reverted version
4. Fix issues in new branch
5. Merge when ready

---

## Post-Deployment Checklist

After successful deployment:

- [ ] Verify both sites load correctly
- [ ] Test navigation between docs and tool
- [ ] Confirm database connectivity
- [ ] Check mobile responsiveness
- [ ] Run Lighthouse audits
- [ ] Test on multiple browsers
- [ ] Monitor Vercel logs for errors
- [ ] Update README.md with new URLs
- [ ] Tag release: `v0.2.0-unified-deployment`
- [ ] Announce to team/stakeholders
- [ ] Document any issues encountered
- [ ] Plan next iteration (disable test mode)

---

## Next Phase: Disable Test Mode

When ready for production authentication:

1. **Update Configuration**

   Edit `apps/evaluation-tool/src/config/app.config.ts`:

   ```typescript
   export const APP_CONFIG = {
     ENABLE_TEST_MODE: false,  // Changed from true
     // ...
   };
   ```

2. **Enable Discord OAuth**
   - Configure Discord OAuth in Supabase dashboard
   - Add Discord app credentials to environment variables
   - Update AuthContext to use Discord provider

3. **Test Authentication Flow**
   - Verify login redirects to Discord
   - Check token storage works
   - Test logout functionality

4. **Deploy**
   - Commit changes
   - Push to GitHub
   - Vercel auto-deploys
   - Verify authentication required

---

## Support & Resources

- **Vercel Documentation**: <https://vercel.com/docs>
- **Supabase Documentation**: <https://supabase.com/docs>
- **Deployment Status**: See `DEPLOYMENT_STATUS.md`
- **Architecture Decisions**: See `specs/002-fullstack-platform/`
- **Issue Tracking**: See `.beads/` or run `bd list`

---

**Created**: October 21, 2025
**Last Updated**: October 21, 2025 at 8:40 AM
**Version**: 1.0
**Author**: Claude Code
