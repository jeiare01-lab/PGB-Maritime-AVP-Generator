# PGB Maritime AVP Generator — Deployment Guide

## Quick Start (Local)

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local
echo 'VITE_ANTHROPIC_API_KEY=sk-ant-xxxxx' > .env.local

# 3. Start dev server
npm run dev
```

Navigate to `http://localhost:5173` and start generating videos.

---

## Production Deployment

### Option 1: Vercel (Recommended)

Vercel auto-builds and deploys on git push.

```bash
# 1. Create Vercel project
vercel

# 2. Add environment variables in Vercel dashboard
# VITE_ANTHROPIC_API_KEY=sk-ant-xxxxx

# 3. Deploy
npm run build
vercel --prod
```

**Result**: `pgb-maritime-avp.vercel.app`

### Option 2: GitHub Pages

```bash
# 1. Update vite.config.js
# Change base: '/repo-name/' (if in org repo)

# 2. Build
npm run build

# 3. Deploy dist/ to gh-pages branch
# Can use GitHub Actions or manual push
```

### Option 3: Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

```bash
docker build -t pgb-avp-gen .
docker run -p 3000:3000 -e VITE_ANTHROPIC_API_KEY=sk-ant-xxxxx pgb-avp-gen
```

---

## Environment Variables

Required for production:

```
VITE_ANTHROPIC_API_KEY=sk-ant-xxxxx  # Anthropic API key
```

Optional:

```
VITE_MOTION_API_KEY=motion-xxx       # Direct Motion API (if bypassing Anthropic proxy)
VITE_API_BASE_URL=https://api.custom # Custom backend
```

---

## GitHub Actions CI/CD

Create `.github/workflows/deploy.yml`:

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
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## Performance Optimization

### Build

```bash
npm run build
# Generates optimized dist/ (~150KB gzipped)
```

### Caching

Add to Vercel `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm ci",
  "env": {
    "VITE_ANTHROPIC_API_KEY": "@anthropic_api_key"
  }
}
```

### CDN

Vercel includes automatic CDN/edge caching.

---

## Monitoring

### Logs

```bash
# Vercel
vercel logs pgb-maritime-avp

# Local
npm run dev
# Check browser console
```

### Error Tracking

Add Sentry integration:

```bash
npm install @sentry/react
```

```jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://xxx@sentry.io/xxx",
  environment: process.env.NODE_ENV,
});
```

---

## Maintenance

### Updates

```bash
npm update
npm audit fix
```

### Versioning

Tag releases:

```bash
git tag -a v1.0.0 -m "Initial release"
git push origin v1.0.0
```

---

## Troubleshooting

**Issue**: "API key not found"
- Check `.env.local` or Vercel environment variables
- Verify key format: `sk-ant-xxxxx`

**Issue**: "Build fails"
- Clear `node_modules/` and `dist/`
- Run `npm ci` instead of `npm install`
- Check Node version: `node --version` (should be 16+)

**Issue**: "Videos not generating"
- Check Anthropic API quota
- Review API response in browser DevTools
- Verify Motion API integration

---

## Support

Questions? Reference:
- `/areas/ports-logistics-operations.md` — Maritime context
- `README.md` — Feature overview
- Anthropic docs: https://docs.anthropic.com
