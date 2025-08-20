# 🐛 Debug Guide - API 404 Issue

## 🔍 **Current Problem**

- **Frontend loads successfully** ✅
- **API endpoints return 404** ❌ (`/api/test`, `/api/debug`, `/api/getInventory`)
- **Vercel deployment succeeds** but API routes inaccessible

## 📁 **File Structure (Current)**

```
/frontend                    # ← Vercel Root Directory
   /api                     # ← API routes here
      test.js               # ← /api/test endpoint
      debug.js              # ← /api/debug endpoint  
      getInventory.js       # ← /api/getInventory endpoint
   index.html               # ← Main page
   app.js                   # ← Frontend logic
   styles.css               # ← Styling
   package.json             # ← Dependencies
   vercel.json              # ← Vercel config
```

## 🧪 **Enhanced Debugging Features Added**

### **1. Multiple Test Endpoints**
- `/api/test` - Basic connectivity test
- `/api/debug` - Detailed request information
- `/api/getInventory` - Google Sheets integration

### **2. Comprehensive Logging**
- **Frontend**: Environment info, request details
- **Backend**: Request method, URL, headers, timestamp
- **Console**: Detailed step-by-step logging

### **3. Debug Button**
- Tests `/api/debug` endpoint specifically
- Shows detailed request/response information
- Helps identify where the routing fails

## 🔧 **Debugging Steps**

### **Step 1: Check Console Logs**
1. Open browser developer tools (F12)
2. Go to Console tab
3. Click "Debug API" button
4. Look for detailed logging

### **Step 2: Test Direct API URLs**
Try these URLs directly in browser:
- `https://your-app.vercel.app/api/test`
- `https://your-app.vercel.app/api/debug`
- `https://your-app.vercel.app/api/getInventory`

### **Step 3: Check Vercel Function Logs**
1. Go to Vercel dashboard
2. Click on your project
3. Go to Functions tab
4. Look for any errors or logs

### **Step 4: Verify Environment Variables**
1. In Vercel dashboard → Project Settings → Environment Variables
2. Confirm these are set:
   - `GOOGLE_SERVICE_ACCOUNT_KEY`
   - `GOOGLE_SHEET_ID`

## 🚨 **Common Issues & Solutions**

### **Issue 1: Vercel Not Detecting API Routes**
**Symptoms**: 404 for all API calls
**Possible Causes**:
- File naming issues
- Export format problems
- Vercel configuration issues

**Solutions**:
1. Ensure files use `.js` extension
2. Use `export default function handler(req, res)`
3. Check `vercel.json` configuration

### **Issue 2: Root Directory Mismatch**
**Symptoms**: Files not found during build
**Possible Causes**:
- Vercel root directory setting doesn't match file structure
- Files outside the configured root directory

**Solutions**:
1. Verify Vercel project settings → Root Directory = `frontend/`
2. Ensure all files are inside `frontend/` folder

### **Issue 3: Build/Deploy Issues**
**Symptoms**: Deployment succeeds but API doesn't work
**Possible Causes**:
- Build process not including API files
- Function timeout or memory issues

**Solutions**:
1. Check Vercel build logs
2. Verify function configuration in `vercel.json`

## 📋 **Debug Checklist**

- [ ] **Console logs show detailed information**
- [ ] **Direct API URLs tested in browser**
- [ ] **Vercel function logs checked**
- [ ] **Environment variables verified**
- [ ] **File structure matches Vercel root directory**
- [ ] **All API files have correct export format**
- [ ] **vercel.json configuration is correct**

## 🆘 **If Still Not Working**

1. **Check Vercel deployment logs** for any build errors
2. **Verify the exact error** in browser network tab
3. **Test with a minimal API endpoint** (just return "Hello World")
4. **Consider changing Vercel root directory** to `/` (repo root) instead of `frontend/`

## 📞 **Next Steps After Debug**

Once we identify the exact issue:
1. **Fix the root cause** (file structure, configuration, etc.)
2. **Test the fix** with the debug endpoints
3. **Verify Google Sheets connection** works
4. **Move to full MVP development**

---

**Remember**: The goal is to get the basic API connectivity working first, then we can build the full inventory system! 🎯
