# 🚀 Enable GitHub Pages - Step-by-Step Guide

## Current Status
✅ Privacy policy file ready at `docs/index.html`  
✅ File copied from `privacy-policy.html`

---

## Step 1: Commit and Push the File (if not already done)

**Check if you need to commit:**
```bash
cd "/Users/harrisonsikes/Desktop/ShredAI V2"
git status
```

**If `docs/index.html` shows as "modified" or "untracked", commit it:**
```bash
git add docs/index.html
git commit -m "Add privacy policy for GitHub Pages"
git push origin main
```

*(If your default branch is `master` instead of `main`, use `git push origin master`)*

---

## Step 2: Enable GitHub Pages (Web Interface)

### 2.1 Go to Your Repository
1. Open your browser
2. Go to: **https://github.com/harrysikes/ShredAIV2**
3. Make sure you're logged in

### 2.2 Open Settings
1. Click the **"Settings"** tab at the top of the repository
   - It's in the navigation bar: `Code | Issues | Pull requests | Actions | Projects | Wiki | Security | Insights | Settings`
   - Click on **"Settings"** (it's the rightmost tab)

### 2.3 Navigate to Pages
1. In the left sidebar, scroll down to find **"Pages"**
   - It's under the **"Code and automation"** section
   - Click on **"Pages"**

### 2.4 Configure GitHub Pages
1. Under **"Source"** section:
   - Select: **"Deploy from a branch"** (from the dropdown)
   - Branch: Select **"main"** (or "master" if that's your default branch)
   - Folder: Select **"/docs"** (this is important!)
   - Click **"Save"** button

### 2.5 Wait for Deployment
1. After clicking Save, you'll see:
   - A message: "Your site is ready to be published at..."
   - The URL: **https://harrysikes.github.io/ShredAIV2/**
   - It may take **1-5 minutes** for the first deployment

---

## Step 3: Verify It's Working

### 3.1 Check the URL
1. Wait 1-2 minutes after enabling
2. Visit: **https://harrysikes.github.io/ShredAIV2/**
3. You should see your privacy policy page with proper styling

### 3.2 What You Should See
- ✅ Privacy policy content
- ✅ Proper styling (bone background #E3DAC9)
- ✅ All sections formatted correctly
- ✅ Contact information visible

---

## 🔧 Troubleshooting

### Issue: "404 - Page Not Found"
**Solution:**
- Wait 5-10 minutes (first deployment can take time)
- Make sure you selected `/docs` folder (not root `/`)
- Verify `docs/index.html` exists in your repository on GitHub
- Check repository Settings → Pages for error messages

### Issue: "Can't Find Pages in Settings"
**Solution:**
- Make sure you're the repository owner or have admin access
- Refresh the page
- "Pages" should be in the left sidebar under "Code and automation"
- If you don't see it, check repository permissions

### Issue: "Old Content Showing"
**Solution:**
- Clear browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- Make sure you pushed the latest `docs/index.html` to GitHub
- GitHub Pages may cache for a few minutes
- Try opening in an incognito/private window

### Issue: "Branch Not Found"
**Solution:**
- Check what your default branch is (usually `main` or `master`)
- In repository Settings → Pages, select the correct branch
- If unsure, go to repository homepage and check the branch name

---

## ✅ Verification Checklist

Before moving on, verify:
- [ ] `docs/index.html` is committed and pushed to GitHub
- [ ] GitHub Pages is enabled in repository Settings
- [ ] Source is set to `/docs` folder
- [ ] Branch is set to `main` (or your default branch)
- [ ] URL works: https://harrysikes.github.io/ShredAIV2/
- [ ] Privacy policy displays correctly with styling
- [ ] All content is visible and formatted properly

---

## 🎯 What's Next?

Once GitHub Pages is working:
1. ✅ You have a public URL for App Store Connect
2. ✅ Privacy policy is accessible (App Store requirement)
3. ✅ You can use this URL in your app submission

**Next Steps:**
- Add this URL to App Store Connect metadata
- Continue with Apple Developer account setup
- Move on to creating app screenshots

---

## 📋 Quick Reference

**Repository:** https://github.com/harrysikes/ShredAIV2  
**Settings:** https://github.com/harrysikes/ShredAIV2/settings/pages  
**Privacy Policy URL:** https://harrysikes.github.io/ShredAIV2/  
**File Location:** `docs/index.html` in repository

---

**Need Help?** 
- GitHub Pages Docs: https://docs.github.com/en/pages
- Check repository Settings → Pages for deployment status

