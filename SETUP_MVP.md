# 🚀 MVP Setup Guide - Perabot Megah Inventory System

This guide will help you set up and deploy the MVP to test the Google Sheets connection.

## 📋 Prerequisites

1. **Google Service Account** (already created)
2. **Google Sheet** (already shared with service account) - ID: `1t8eqdoMh9_1l6DnvD_tqagMWWz0Ctci-_0nz4tqP86g`
3. **Vercel Account** (free tier works)
4. **GitHub Repository** (connected to Vercel)

## 🛠️ Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Local Testing (Optional)

Create a `.env.local` file in your project root for local testing:

```env
# Google Service Account (the JSON key you generated)
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"your-service@your-project.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/your-service%40your-project.iam.gserviceaccount.com"}

# Google Sheet ID (from Global.gs.txt)
GOOGLE_SHEET_ID=1t8eqdoMh9_1l6DnvD_tqagMWWz0Ctci-_0nz4tqP86g
```

**Note:** This is only for local testing. For production, you'll set these in Vercel.

### 3. Test Locally (Optional)

```bash
npm run dev
```

This will start Vercel dev server. Open `http://localhost:3000` to test locally.

### 4. Deploy to Production

#### Step 1: Push to GitHub

```bash
# Add all files
git add .

# Commit changes
git commit -m "Add MVP inventory system with Google Sheets integration"

# Push to GitHub
git push origin main
```

#### Step 2: Connect Vercel to GitHub

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. **Don't deploy yet** - we need to set environment variables first

#### Step 3: Set Environment Variables in Vercel

1. In your Vercel project dashboard, go to **Settings** → **Environment Variables**
2. Add these variables:

   **Variable Name:** `GOOGLE_SERVICE_ACCOUNT_KEY`
   **Value:** Your entire JSON service account key (copy-paste the full JSON)
   **Environment:** Production (and Preview if you want)

   **Variable Name:** `GOOGLE_SHEET_ID`
   **Value:** `1t8eqdoMh9_1l6DnvD_tqagMWWz0Ctci-_0nz4tqP86g`
   **Environment:** Production (and Preview if you want)

3. Click **Save**

#### Step 4: Deploy

1. Go to **Deployments** tab
2. Click **Redeploy** on your latest deployment
3. Wait for deployment to complete

## 🧪 Testing the MVP

### 1. Test Basic Connection

Click the **"Test Connection"** button to verify:
- ✅ Vercel deployment works
- ✅ API routes are accessible
- ✅ Basic connectivity is established

### 2. Test Google Sheets Connection

Click the **"Fetch Inventory Data"** button to verify:
- ✅ Google Sheets API authentication works
- ✅ Data can be fetched from your sheet
- ✅ Data is properly formatted and displayed

### 3. Expected Results

**Successful Connection:**
- Green success messages
- Data displayed in a table
- Raw JSON response shown
- Toast notifications confirm success

**Common Issues:**
- ❌ "Service Account key not configured" → Check Vercel environment variables
- ❌ "Sheet ID not configured" → Check GOOGLE_SHEET_ID in Vercel
- ❌ "Permission denied" → Check sheet sharing settings
- ❌ "Sheet not found" → Check sheet ID (should be `1t8eqdoMh9_1l6DnvD_tqagMWWz0Ctci-_0nz4tqP86g`)

## 📊 Google Sheet Structure

Your Google Sheet (`1t8eqdoMh9_1l6DnvD_tqagMWWz0Ctci-_0nz4tqP86g`) should have these sheets:
- **Inventory Log** - Main inventory data
- **Inventory Snapshot** - Historical snapshots
- **Product Master** - Product catalog

The API will read from the first sheet by default. Adjust the range in `api/getInventory.js` if needed.

## 🔧 Troubleshooting

### Environment Variables Not Working

1. Check Vercel dashboard → Settings → Environment Variables
2. Ensure variables are set for Production environment
3. Redeploy after setting variables
4. Check Vercel function logs for errors

### Google Sheets Permission Issues

1. Verify service account email has Editor access to sheet `1t8eqdoMh9_1l6DnvD_tqagMWWz0Ctci-_0nz4tqP86g`
2. Check if sheet is shared (not just public)
3. Ensure sheet ID matches exactly: `1t8eqdoMh9_1l6DnvD_tqagMWWz0Ctci-_0nz4tqP86g`
4. Try sharing with "Anyone with the link" temporarily

### API Endpoints Not Found

1. Check `vercel.json` configuration
2. Verify file paths in `api/` folder
3. Ensure proper exports in API files
4. Check Vercel deployment logs

### CORS Issues

The MVP is designed to work without CORS issues since frontend and API are on the same domain.

## 📱 Mobile Testing

After deployment, test on:
- ✅ iPhone Safari
- ✅ Android Chrome
- ✅ Desktop browsers

The MVP should work consistently across all devices.

## 🚀 Next Steps After MVP Success

Once the MVP is working:

1. **Expand API endpoints** (add, update, delete)
2. **Improve data validation**
3. **Add error handling**
4. **Implement caching**
5. **Add authentication**
6. **Build full inventory management features**

## 📞 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Verify environment variables in Vercel dashboard
3. Test Google Sheets permissions
4. Check browser console for errors
5. Verify API responses in Network tab

## 🎯 Success Criteria

The MVP is successful when:
- ✅ Frontend loads without errors
- ✅ Test Connection button works
- ✅ Fetch Inventory button returns data
- ✅ Data displays in a readable table
- ✅ Works on mobile devices
- ✅ No "Sorry unable to open" errors

---

**Ready to deploy?** Push to GitHub, connect Vercel, set environment variables, and deploy! 🎉
