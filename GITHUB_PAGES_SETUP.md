# 📄 How to Host Privacy Policy on GitHub Pages

Step-by-step guide to host your privacy policy online for App Store submission.

---

## 🎯 Your Privacy Policy URL

Once set up, your privacy policy will be available at:
**https://harrysikes.github.io/ShredAIV2/**

---

## ✅ Step 1: Copy Privacy Policy to docs folder

The privacy policy HTML file has already been copied to `docs/index.html` ✅

If you need to update it again:
```bash
cd "/Users/harrisonsikes/Desktop/ShredAI V2"
cp privacy-policy.html docs/index.html
```

---

## ✅ Step 2: Commit and Push to GitHub

If you haven't already, commit and push the `docs/index.html` file:

```bash
cd "/Users/harrisonsikes/Desktop/ShredAI V2"

# Check if git is initialized
git status

# If the file needs to be committed:
git add docs/index.html
git commit -m "Update privacy policy for GitHub Pages"
git push origin main
```

---

## ✅ Step 3: Enable GitHub Pages

1. **Go to your GitHub repository:**
   - Visit: https://github.com/harrysikes/ShredAIV2

2. **Click "Settings"** (top right of repository page, in the tabs)

3. **Click "Pages"** (left sidebar, under "Code and automation" section)

4. **Under "Source" section:**
   - Select: **Deploy from a branch**
   - Branch: **main** (or **master** if that's your default branch)
   - Folder: **/docs**
   - Click **Save**

5. **Wait 1-2 minutes** for GitHub to build your page
   - You'll see a message: "Your site is ready to be published at..."
   - It may take a few minutes for the first deployment

---

## ✅ Step 4: Verify It's Working

1. Visit your privacy policy URL:
   - https://harrysikes.github.io/ShredAIV2/

2. You should see your privacy policy page with proper styling

3. If you see a 404 error:
   - Wait a few more minutes (first deployment can take 3-5 minutes)
   - Make sure you selected the correct branch and `/docs` folder
   - Check that `docs/index.html` exists and was pushed to GitHub

---

## 🔧 Troubleshooting

### Issue: 404 Error
**Solution:**
- Make sure `docs/index.html` exists in your repository
- Check that GitHub Pages is set to `/docs` folder
- Wait 5-10 minutes for first deployment
- Check repository Settings → Pages for any error messages

### Issue: Old Content Showing
**Solution:**
- Clear browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- Make sure you pushed the latest `docs/index.html` to GitHub
- GitHub Pages may cache for a few minutes

### Issue: Can't Find "Pages" in Settings
**Solution:**
- Make sure you're the repository owner or have admin access
- Try refreshing the page
- "Pages" should be in the left sidebar under "Code and automation"

---

## 📱 Update Your App (Optional)

The app already has the correct URL in `PrivacyPolicyScreen.tsx`:
```typescript
Linking.openURL('https://harrysikes.github.io/ShredAIV2/')
```

This is already set up! ✅

---

## 🎉 Done!

Once GitHub Pages is enabled and working:
- ✅ Your privacy policy is publicly accessible
- ✅ Ready for App Store submission
- ✅ URL can be used in App Store Connect

**Next Steps:**
1. Use this URL in App Store Connect when submitting
2. Add it to your app's privacy policy field
3. Update your contact information if needed

---

## 📋 Quick Checklist

- [ ] `docs/index.html` exists with your privacy policy
- [ ] File is committed and pushed to GitHub
- [ ] GitHub Pages enabled in repository Settings
- [ ] Source set to `/docs` folder
- [ ] URL working: https://harrysikes.github.io/ShredAIV2/
- [ ] Privacy policy displays correctly

---

**Need help?** Check the repository Settings → Pages section for deployment status and any error messages.

