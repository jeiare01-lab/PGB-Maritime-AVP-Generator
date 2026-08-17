# Deployment Checklist

## Phase 1: GitHub

- [ ] **Create GitHub repo**: `jeiare01-lab/pgb-maritime-avp-generator`
- [ ] **Initialize git locally**:
  ```bash
  cd pgb-maritime-avp-generator
  git init
  git add .
  git commit -m "Initial commit"
  ```
- [ ] **Set remote & push**:
  ```bash
  git remote add origin https://github.com/jeiare01-lab/pgb-maritime-avp-generator.git
  git branch -M main
  git push -u origin main
  ```
- [ ] **Verify on GitHub**: Code appears at repo URL

## Phase 2: Vercel Setup

- [ ] **Sign in to Vercel**: https://vercel.com (use GitHub account)
- [ ] **Import project**: Dashboard → "Add New" → "Project"
- [ ] **Select repo**: `pgb-maritime-avp-generator`
- [ ] **Confirm defaults**:
  - Build: `npm run build` ✓
  - Output: `dist` ✓
  - Framework: Vite ✓
- [ ] **Add environment variable**:
  - Name: `VITE_ANTHROPIC_API_KEY`
  - Value: `sk-ant-xxxxxxxxxxxxx`
  - Scope: All (Production, Preview, Dev)
- [ ] **Click Deploy**

## Phase 3: First Build

- [ ] **Monitor deployment**: Vercel → Deployments tab
- [ ] **Watch logs**: 
  - Installing dependencies (1-2 min)
  - Building Vite (30s)
  - Generating output (10s)
- [ ] **Build succeeds** ✓ (green checkmark)
- [ ] **Get live URL**: `https://pgb-maritime-avp-generator.vercel.app`

## Phase 4: Live Testing

- [ ] **Load app**: Open production URL
- [ ] **Check UI loads**: Both panels visible
- [ ] **Edit a scene**: Change Scene 1 narration, verify input works
- [ ] **Test Generate button**:
  - Click "Generate Videos"
  - Watch spinner
  - Wait 10-15 seconds
  - Status should show "Generated!" (green)
  - 4 output variants appear
- [ ] **Check browser console**: DevTools → Console (no red errors)
- [ ] **Check network**: DevTools → Network → verify POST to `api.anthropic.com` succeeds

## Phase 5: API Key Verification

- [ ] **Anthropic console**: https://console.anthropic.com/account/usage
- [ ] **Check API key**: Matches value in Vercel env var
- [ ] **Check quota**: Has available balance
- [ ] **Check usage**: Recent API calls logged (from your test)

## Phase 6: Auto-Deploy Setup

- [ ] **Make test commit**:
  ```bash
  echo "# v1" >> README.md
  git add .
  git commit -m "Test auto-deploy"
  git push
  ```
- [ ] **Vercel auto-starts build** (no manual trigger)
- [ ] **Deployment succeeds** (watch dashboard)
- [ ] **Live URL updated** (refresh browser)

## Phase 7: Production Hardening

- [ ] **Add `vercel.json`** (security headers)
- [ ] **Enable HTTPS**: Verify via `curl -I https://...` → HTTP/2 200
- [ ] **Set up Vercel alerts**: Settings → Notifications → email on failure
- [ ] **Monitor API usage**: https://console.anthropic.com/account/usage

## Phase 8: Documentation

- [ ] **Update README** with live URL
- [ ] **Add troubleshooting section**
- [ ] **Document API key rotation process**
- [ ] **Commit & push**

## Ready for Production ✓

- Live URL: https://pgb-maritime-avp-generator.vercel.app
- Auto-deploys on git push
- API integration working
- Monitoring in place
- Security hardened

---

## Need Help?

| Issue | Fix |
|-------|-----|
| Build fails | Run `npm run build` locally first |
| API key not found | Check Vercel env vars, redeploy |
| Video generation errors | Check API key quota |
| Slow builds | Clear Vercel cache (disconnect GitHub, reconnect) |
| Need to rollback | Vercel Dashboard → Deployments → promote previous |
