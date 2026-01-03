# Step-by-Step: Push RailYatra to GitHub (Manual Method)

## Problem
GitHub Desktop is not showing your files. Let's use the web interface instead.

## Solution: Upload to GitHub via Web

### Step 1: Create Repository on GitHub
1. Go to https://github.com/new
2. Fill in:
   - **Repository name**: `railyatra`
   - **Description**: `Indian Railway information app - PNR status & live train status`
   - **Public** (select this for free hosting)
   - **DO NOT** check "Add a README file"
   - **DO NOT** add .gitignore or license
3. Click **"Create repository"**

### Step 2: Prepare Your Files

**IMPORTANT: Delete these files before uploading:**
- `.env` (contains sensitive data - DO NOT upload!)
- `node_modules` folder (too large)

**Keep everything else:**
- All `.jsx` files
- `package.json`
- `index.html`
- `.gitignore`
- `.env.example` (this is safe)
- All other files

### Step 3: Upload Files

**Option A: Drag & Drop (Easiest)**
1. On the GitHub repository page you just created
2. Click **"uploading an existing file"** link
3. Open File Explorer: `C:\Users\A.B.Joshi\.gemini\antigravity\scratch\rail-travel-app`
4. Select ALL files EXCEPT:
   - `.env` 
   - `node_modules` folder
5. Drag and drop them into GitHub
6. Commit message: `Initial commit - RailYatra v1.0`
7. Click **"Commit changes"**

**Option B: Upload Folder by Folder**
1. Click "Add file" → "Upload files"
2. Upload `src` folder
3. Upload `public` folder
4. Upload root files (package.json, index.html, etc.)
5. Commit each batch

### Step 4: Verify Upload
Check that you see:
- ✅ `src` folder with all pages
- ✅ `public` folder
- ✅ `package.json`
- ✅ `index.html`
- ✅ `.gitignore`
- ✅ `README.md`
- ❌ NO `.env` file (good!)
- ❌ NO `node_modules` (good!)

---

## Next: Deploy to Vercel

Once files are on GitHub:

1. Go to https://vercel.com/signup
2. Sign up with GitHub
3. Click "Import Project"
4. Select `railyatra` repository
5. Add environment variables (from `.env.example`)
6. Deploy!

---

## If You Want to Use Git Command Line

If you have Git installed, I can help you with commands. Let me know!
