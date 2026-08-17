# Deployment — Step by Step

## Step 1: GitHub Setup

### 1a. Create Repository

```bash
# From your project directory
git init
git add .
git commit -m "Initial commit: PGB Maritime AVP Generator"
git branch -M main
```

Then on GitHub:
1. Go to https://github.com/new
2. Create repo `pgb-maritime-avp-generator` under `jeiare01-lab`
3. Don't initialize with README (we have one)
4. Copy the push commands

### 1b. Push to GitHub

```bash
git remote add origin https://github.com/jeiare01-lab/pgb-maritime-avp-generator.git
git push -u origin main
```

Verify: https://github.com/jeiare01-lab/pgb-maritime-avp-generator should show your code.

---

## Step 2: Vercel Project Setup

### 2a. Create Vercel Account (if needed)

Go to https://vercel.com and sign up with GitHub account.

### 2b. Import Project

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Select your GitHub repo `pgb-maritime-avp-generator`
4. Click "Import"

**Vercel will auto-detect**:
- Framework: Vite ✓
- Build Command: `npm run build` ✓
- Output Directory: `dist` ✓

### 2c. Add Environment Variables

In Vercel project settings → Environment Variables:

Add:
```
Name: VITE_ANTHROPIC_API_KEY
Value: sk-ant-xxxxxxxxxxxxx
Environments: Production, Preview, Development
```

Get your Anthropic API key from https://console.anthropic.com/keys

---

## Step 3: Build & Deploy

### 3a. Trigger Deployment

When you pushed code to GitHub, Vercel auto-started a build.

Check deployment at: https://vercel.com/dashboard → click project → "Deployments"

### 3b. Monitor Build

Watch the logs:
```
✓ Building...
✓ Installing dependencies
✓ Building with Vite
✓ Generated 3 files (bundle.js, styles.css, index.html)
✓ Ready for preview
```

Build should complete in **2-3 minutes**.

### 3c. Get Live URL

After build succeeds, you'll see:

```
Production: https://pgb-maritime-avp-generator.vercel.app
```

Click the URL to open your live app.

---

## Step 4: Test Live App

### 4a. Load the App

1. Open `https://pgb-maritime-avp-generator.vercel.app`
2. You should see the AVP Generator UI

### 4b. Test Scene Editing

1. Edit Scene 1 narration: "Test narration..."
2. Change duration: 75 seconds
3. Verify changes appear in UI ✓

### 4c. Test Generate Button

1. Click "Generate Videos"
2. Watch status: "Generating..." → spinner
3. Should complete in 10-15 seconds
4. Check browser console (DevTools) for any errors

**Expected result**:
- Status changes to "Generated!" (green checkmark)
- 4 output variants appear below
- Each has "Copy" and "Download" buttons

### 4d. Verify API Integration

Check DevTools → Network tab:
- POST request to `https://api.anthropic.com/v1/messages` should succeed (200)
- Response contains video config JSON

If error:
- Check API key is valid
- Check API key not expired
- Check API key has sufficient quota

---

## Step 5: CI/CD Setup (Optional)

Auto-deploy on every git push.

### 5a. Vercel Auto-Deploy

Already enabled! Every push to `main` triggers build.

Test it:
```bash
# Make a small change
echo "# Updated" >> README.md
git add .
git commit -m "Test auto-deploy"
git push
```

Watch Vercel dashboard → new deployment starts automatically.

### 5b. GitHub Actions (Optional)

For manual control, create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

Then in GitHub repo → Settings → Secrets → add `VERCEL_TOKEN`.

---

## Step 6: Production Hardening

### 6a. Add Security Headers

In Vercel, create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        }
      ]
    }
  ]
}
```

### 6b. Enable HTTPS

Vercel auto-provisions SSL certificate. Verify:
```bash
curl -I https://pgb-maritime-avp-generator.vercel.app
# Should show: HTTP/2 200
```

### 6c. Custom Domain (Optional)

In Vercel project → Settings → Domains:
1. Add `pgb-maritime-avp.com` or similar
2. Update DNS records (Vercel shows instructions)
3. Deploy triggers re-validation

---

## Step 7: Monitoring & Maintenance

### 7a. Check Deployment Health

```bash
# Check last deployment
curl -s https://pgb-maritime-avp-generator.vercel.app/api/healthz
```

Or manually: load the app and test a generation.

### 7b. View Logs

Vercel Dashboard → Deployments → click latest → "Logs"

Shows:
- Build logs
- Runtime errors
- Function invocations

### 7c. Set Up Alerts

In Vercel → Settings → Notifications:
- Email on failed deployments
- Email on errors

### 7d. Monitor API Usage

At https://console.anthropic.com/account/usage:
- Track Anthropic API calls/costs
- Set usage alerts

---

## Step 8: Future Updates

### 8a. Update Code

```bash
# Make changes locally
git add .
git commit -m "Feature: add language support"
git push origin main
```

Vercel auto-rebuilds and deploys. Check dashboard for status.

### 8b. Update Dependencies

```bash
npm update
npm audit fix
git commit -am "chore: update dependencies"
git push
```

### 8c. Rollback if Needed

In Vercel Dashboard → Deployments:
1. Find previous working deployment
2. Click "..." → "Promote to Production"
3. Live URL reverts instantly (no rebuild)

---

## Troubleshooting

### Build Fails: "npm install error"
```bash
# Locally, verify build works
npm ci
npm run build
# If succeeds locally, clear Vercel cache:
# Vercel → Settings → Git → disconnect & reconnect
```

### App Loads but Button Does Nothing
- Check DevTools console for errors
- Check Network tab: API call failing?
- Verify API key in Vercel env vars

### "API key not found" Error
1. Go to Vercel → Settings → Environment Variables
2. Verify `VITE_ANTHROPIC_API_KEY` exists
3. Redeploy: Deployments → click latest → "Redeploy"

### Slow Video Generation
- Anthropic API is real-time (not async)
- Should complete in 10-15 seconds
- Check API status: https://status.anthropic.com

### Need to Change API Key
1. Get new key from https://console.anthropic.com/keys
2. Vercel → Settings → Environment Variables
3. Edit `VITE_ANTHROPIC_API_KEY` with new value
4. Redeploy (or wait for next push)

---

## Done! 

Your app is now live and production-ready:

✓ Code on GitHub  
✓ Auto-deploys to Vercel  
✓ API integration working  
✓ HTTPS enabled  
✓ Monitoring in place  

**Live URL**: https://pgb-maritime-avp-generator.vercel.app

Next: Test with real Motion API calls (replace mocks).
