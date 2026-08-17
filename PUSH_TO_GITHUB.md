# Push Code to GitHub

## Prerequisites

Make sure you have:
- Git installed: `git --version`
- GitHub credentials configured
- Access to https://github.com/jeiare01-lab/PGB-Maritime-AVP-Generator

---

## Option A: Using Git CLI (Recommended)

Run these commands in order:

### Step 1: Navigate to Project

```bash
cd /mnt/user-data/outputs/pgb-maritime-avp-generator
```

Verify you see these files:
```bash
ls -la
# Should show: package.json, README.md, src/, index.html, etc.
```

### Step 2: Initialize Git

```bash
git init
```

(Creates `.git` folder — needed for version control)

### Step 3: Add All Files

```bash
git add .
```

(Stages all files for commit)

### Step 4: Commit

```bash
git commit -m "Initial commit: PGB Maritime AVP Generator"
```

(Creates a snapshot of your code)

### Step 5: Set Branch Name

```bash
git branch -M main
```

(GitHub defaults to `main` branch)

### Step 6: Add Remote Repository

```bash
git remote add origin https://github.com/jeiare01-lab/PGB-Maritime-AVP-Generator.git
```

(Links local repo to GitHub)

### Step 7: Push to GitHub

```bash
git push -u origin main
```

(Uploads code to GitHub)

You may be prompted for credentials:
- GitHub username
- GitHub token (or password)

**If prompted for password**: Use a Personal Access Token instead:
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo`
4. Copy token
5. Paste when prompted in terminal

---

## Option B: GitHub Desktop (GUI)

If you prefer a graphical interface:

1. Download https://desktop.github.com/
2. Sign in with GitHub account
3. Click "File" → "Clone Repository"
4. Paste: `https://github.com/jeiare01-lab/PGB-Maritime-AVP-Generator.git`
5. Choose local path
6. Click "Clone"
7. In "Changes" tab, click "Commit to main"
8. Message: "Initial commit: PGB Maritime AVP Generator"
9. Click "Commit"
10. Click "Publish branch"

Done — code is on GitHub.

---

## Option C: Using SSH (Advanced)

If you have SSH keys set up:

```bash
git remote add origin git@github.com:jeiare01-lab/PGB-Maritime-AVP-Generator.git
git push -u origin main
```

(Skips password prompt, uses SSH key instead)

---

## Verify Push Worked

After Step 7 completes, go to:

https://github.com/jeiare01-lab/PGB-Maritime-AVP-Generator

You should see:
- All your code files listed
- `README.md` displayed
- Commit message showing "Initial commit"

---

## Troubleshooting

### "fatal: not a git repository"
```bash
git init
# Then retry from Step 3
```

### "fatal: remote origin already exists"
```bash
git remote remove origin
# Then retry from Step 6
```

### "Permission denied (publickey)"
- Use HTTPS instead of SSH
- Or generate SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

### "fatal: The current branch main has no upstream branch"
```bash
git push -u origin main
# (This sets main as default upstream)
```

### "Please tell me who you are"
```bash
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
# Then retry commit
```

---

## After Push — Next Step

Once you see code on GitHub, you're ready for Vercel deploy:

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Select your repo
4. Add API key environment variable
5. Deploy

See `DEPLOY_STEPS.md` for full Vercel walkthrough.
