# 🚀 Perabot Megah Inventory System - MVP

A simple MVP to test Google Sheets integration with a Vercel-hosted frontend.

## 🎯 What This MVP Does

- ✅ **Tests basic API connectivity** - Verifies Vercel deployment works
- ✅ **Connects to Google Sheets** - Fetches real data from your sheet (ID: `1t8eqdoMh9_1l6DnvD_tqagMWWz0Ctci-_0nz4tqP86g`)
- ✅ **Displays data** - Shows inventory items in a simple table
- ✅ **Mobile-friendly** - Works on all devices including iPhone Safari

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Local Testing (Optional)
Create `.env.local` file:
```env
GOOGLE_SERVICE_ACCOUNT_KEY={"your":"json","key":"here"}
GOOGLE_SHEET_ID=1t8eqdoMh9_1l6DnvD_tqagMWWz0Ctci-_0nz4tqP86g
```

### 3. Test Locally (Optional)
```bash
npm run dev
```
Open `http://localhost:3000`

### 4. Deploy to Production
```bash
# Push to GitHub
git add .
git commit -m "Add MVP inventory system"
git push origin main

# Then in Vercel:
# 1. Connect GitHub repo
# 2. Set environment variables
# 3. Deploy
```

## 📁 Project Structure

```
├── frontend/           # Frontend files
│   ├── index.html     # Main page
│   ├── app.js         # Frontend logic
│   └── styles.css     # Styling
├── api/               # Vercel API routes
│   ├── test.js        # Test endpoint
│   └── getInventory.js # Google Sheets endpoint
├── package.json       # Dependencies
├── vercel.json        # Vercel config
└── SETUP_MVP.md      # Detailed setup guide
```

## 🧪 Testing

1. **Test Connection** - Verifies basic API connectivity
2. **Fetch Inventory** - Tests Google Sheets integration
3. **View Data** - See your sheet data in a table
4. **Raw Response** - View the complete API response

## 📱 Mobile Testing

After deployment, test on:
- iPhone Safari
- Android Chrome
- Desktop browsers

## 🔧 Troubleshooting

See `SETUP_MVP.md` for detailed troubleshooting steps.

## 🎯 Success Criteria

- ✅ Frontend loads without errors
- ✅ API endpoints respond correctly
- ✅ Google Sheets data is fetched and displayed
- ✅ Works on mobile devices
- ✅ No "Sorry unable to open" errors

---

**Need help?** Check `SETUP_MVP.md` for detailed instructions! 🎉
