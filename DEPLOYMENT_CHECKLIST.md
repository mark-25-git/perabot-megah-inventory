# 🚀 Deployment Checklist - MVP

Follow this checklist to deploy your MVP to Vercel via GitHub.

## ✅ Pre-Deployment Checklist

- [ ] All files are committed to your local repository
- [ ] Google Service Account JSON key is ready
- [ ] Vercel account is set up
- [ ] GitHub repository is ready

## 📤 Step 1: Push to GitHub

```bash
# Check current status
git status

# Add all files
git add .

# Commit changes
git commit -m "Add MVP inventory system with Google Sheets integration"

# Push to GitHub
git push origin main

# Verify push was successful
git log --oneline -5
```

## 🔗 Step 2: Connect Vercel to GitHub

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import your GitHub repository
4. **Important:** Don't deploy yet - we need to set environment variables first

## 🔑 Step 3: Set Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add these variables:

### Variable 1: Google Service Account Key
- **Name:** `GOOGLE_SERVICE_ACCOUNT_KEY`
- **Value:** Your entire JSON service account key (copy-paste the full JSON)
- **Environment:** Production ✅
- **Environment:** Preview ✅ (optional)

### Variable 2: Google Sheet ID
- **Name:** `GOOGLE_SHEET_ID`
- **Value:** `1t8eqdoMh9_1l6DnvD_tqagMWWz0Ctci-_0nz4tqP86g`
- **Environment:** Production ✅
- **Environment:** Preview ✅ (optional)

3. Click **Save**

## 🚀 Step 4: Deploy

1. Go to **Deployments** tab
2. Click **Redeploy** on your latest deployment
3. Wait for deployment to complete
4. Note your deployment URL (e.g., `https://your-project.vercel.app`)

## 🧪 Step 5: Test the MVP

1. Open your deployment URL
2. Click **"Test Connection"** button
   - Should show green success message
3. Click **"Fetch Inventory Data"** button
   - Should display data from Google Sheets
4. Test on mobile devices (iPhone Safari, Android Chrome)

## 🔍 Step 6: Verify Success

### ✅ Success Indicators
- [ ] Frontend loads without errors
- [ ] Test Connection button works
- [ ] Fetch Inventory button returns data
- [ ] Data displays in a readable table
- [ ] Works on mobile devices
- [ ] No "Sorry unable to open" errors

### ❌ Common Issues & Solutions

#### Issue: "Service Account key not configured"
**Solution:** Check Vercel environment variables are set correctly

#### Issue: "Sheet ID not configured"
**Solution:** Verify `GOOGLE_SHEET_ID` is set to `1t8eqdoMh9_1l6DnvD_tqagMWWz0Ctci-_0nz4tqP86g`

#### Issue: "Permission denied"
**Solution:** Check Google Sheet is shared with service account email

#### Issue: API endpoints not found
**Solution:** Check Vercel deployment logs and `vercel.json` configuration

## 📱 Mobile Testing

After successful deployment, test on:
- [ ] iPhone Safari
- [ ] Android Chrome
- [ ] Desktop browsers

## 🔧 Troubleshooting

### Check Vercel Logs
1. Go to your deployment
2. Click **"Functions"** tab
3. Check for any error messages

### Verify Environment Variables
1. Go to **Settings** → **Environment Variables**
2. Ensure variables are set for Production environment
3. Check for typos or extra spaces

### Test Google Sheets Permissions
1. Verify sheet `1t8eqdoMh9_1l6DnvD_tqagMWWz0Ctci-_0nz4tqP86g` is shared
2. Service account email should have Editor access
3. Try sharing with "Anyone with the link" temporarily

## 🎯 Next Steps After Success

Once MVP is working:
1. [ ] Expand API endpoints (add, update, delete)
2. [ ] Improve data validation
3. [ ] Add error handling
4. [ ] Implement caching
5. [ ] Add authentication
6. [ ] Build full inventory management features

## 📞 Need Help?

1. Check Vercel deployment logs
2. Verify environment variables
3. Test Google Sheets permissions
4. Check browser console for errors
5. Review `SETUP_MVP.md` for detailed troubleshooting

---

**Ready to deploy?** Follow this checklist step by step! 🎉
