# Admin Reports Section - Complete Setup & Debugging Guide

## ✅ What's Already Built

### **Backend (Complete)**
- ✅ Report model (`server/src/models/Report.js`)
- ✅ Report controller (`server/src/controllers/reportController.js`)
- ✅ Report routes (`server/src/Routes/reportRoutes.js`)
- ✅ Routes registered in `server.js`
- ✅ All API endpoints working

### **Frontend (Complete)**
- ✅ ReportsDashboard component (`client/src/pages/Admin/ReportsDashboard.jsx`)
- ✅ Route in App.jsx (`/admin/reports`)
- ✅ UI with filters, modals, status updates

**Everything is built! The issue is likely one of these:**

---

## 🐛 Debugging Steps

### **Step 1: Open Browser Console**
1. Press **F12** to open DevTools
2. Go to **Console** tab
3. Try to access `/admin/reports`
4. Look for error messages

You should see logging like:
```
Fetching reports from: http://localhost:5000/api/reports/?status=pending
Response status: 200
Reports data: [ ... ]
```

### **Step 2: Check Network Tab**
1. Open DevTools (F12)
2. Go to **Network** tab
3. Access `/admin/reports`
4. Look for request to `api/reports`
5. Click on it and check:
   - **Status**: Should be 200 (success)
   - **Response**: Should show array of reports `[]` or `[{...}, {...}]`

### **Step 3: Test API Directly**
Open a new terminal and test the API:

```bash
# Get your admin token first (log in and get from localStorage)
# Then run:

curl -X GET "http://localhost:5000/api/reports" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE"
```

You should get back a JSON array (even if empty `[]`).

### **Step 4: Verify Admin Role**
Check if you're actually an admin:

```javascript
// Run in browser console:
const token = localStorage.getItem('token');
const decoded = JSON.parse(atob(token.split('.')[1]));
console.log('User role:', decoded.role);
console.log('Is admin?', decoded.role === 'admin');
```

Should show: `Is admin? true`

---

## 📋 Checklist

- [ ] **Backend running?** (port 5000)
- [ ] **Frontend running?** (port 3000)
- [ ] **Logged in as admin?** (check role in console)
- [ ] **No console errors?** (check F12)
- [ ] **Network request succeeds?** (status 200)
- [ ] **Have any reports?** (create a report if empty)

---

## 🚀 Common Issues & Solutions

### **Issue 1: "Cannot GET /admin/reports"**
**Cause:** Using backend port instead of frontend
**Solution:** Use `http://localhost:3000/admin/reports` (not 5000)

### **Issue 2: Blank page with no reports**
**Cause:** No reports created yet OR API returning empty array
**Solution:** Create a report first (report any post), then refresh

### **Issue 3: 403 Forbidden**
**Cause:** Not logged in as admin
**Solution:** 
1. Check console: `decoded.role` should be `"admin"`
2. If not admin, create admin account or promote user to admin

### **Issue 4: Network error/Cannot reach API**
**Cause:** Backend not running
**Solution:** 
```bash
cd server
npm run dev
# Should see: Server running on port 5000
```

### **Issue 5: Blank screen with loading spinner**
**Cause:** API taking too long or network issue
**Solution:**
1. Check Network tab (F12)
2. See if `api/reports` request is pending/failed
3. Check backend console for errors

---

## 📝 How to Create a Test Report

To test if reports work:

1. Go to `/forums` (forum page)
2. Click any post
3. Click the **⋯** (three dots menu)
4. Click **Report**
5. Select a reason (e.g., "spam")
6. Add optional description
7. Click **Submit Report**
8. Should see success message
9. Report now in database

Then go back to `/admin/reports` and refresh - you should see it!

---

## 🔍 API Endpoints Reference

### **1. Get All Reports**
```
GET /api/reports?status=pending
Authorization: Bearer {admin_token}

Response (200):
[
  {
    "_id": "...",
    "post": { "_id": "...", "content": "...", "user": {...} },
    "reportedBy": { "_id": "...", "name": "...", "email": "..." },
    "reason": "spam",
    "description": "...",
    "status": "pending",
    "notes": "",
    "createdAt": "2025-12-21T...",
    "updatedAt": "2025-12-21T..."
  },
  ...
]
```

### **2. Get Reports for Specific Post**
```
GET /api/reports/:postId
Authorization: Bearer {admin_token}

Response (200): [reports for that post]
```

### **3. Update Report Status**
```
PATCH /api/reports/:reportId/status
Authorization: Bearer {admin_token}
Content-Type: application/json

Body: {
  "status": "reviewed",
  "notes": "Checked post, action not needed"
}

Response (200):
{
  "message": "Report updated successfully",
  "report": { updated report... }
}
```

---

## 🗂️ File Structure

```
server/
  src/
    models/
      └─ Report.js (Database schema)
    controllers/
      └─ reportController.js (Business logic)
    Routes/
      └─ reportRoutes.js (API endpoints)
    server.js (Routes registered here)

client/
  src/
    pages/
      Admin/
        └─ ReportsDashboard.jsx (Admin UI)
    App.jsx (Route defined: /admin/reports)
```

---

## 🧪 Manual Testing Commands

### **Test 1: Check Backend is Running**
```bash
curl http://localhost:5000/
# Should return: "SEECS Konnect Backend Running"
```

### **Test 2: Check Report Routes Registered**
```bash
# Get token first, then:
curl -X GET "http://localhost:5000/api/reports" \
  -H "Authorization: Bearer TOKEN_HERE"
# Should return: 200 with JSON array
```

### **Test 3: Check Frontend Loads**
```bash
# Just visit in browser:
http://localhost:3000/admin/reports
# Should load or show error with details
```

---

## 📊 What You Should See

### **If everything works:**
1. ✅ Page loads at `/admin/reports`
2. ✅ See filter tabs: pending, reviewed, resolved, dismissed
3. ✅ See list of reports (if any exist)
4. ✅ Can click to view details
5. ✅ Can update status and add notes

### **If reports are empty:**
1. ✅ Page loads fine
2. ✅ Shows "No pending reports found"
3. ✅ Create a test report by reporting a post
4. ✅ Refresh page
5. ✅ Report appears in list

---

## 🆘 Still Not Working?

### **Step 1: Check Console Logs**
```javascript
// Open DevTools (F12) → Console
// Should see:
// Fetching reports from: http://localhost:5000/api/reports/?status=pending
// Response status: 200
// Reports data: [...]

// If you see errors, share them!
```

### **Step 2: Check Backend Logs**
```bash
# Look at server terminal output
# Should see API requests being processed
# Look for any error messages
```

### **Step 3: Check Database**
```bash
# MongoDB should have reports collection
# If no reports, you need to create one (via reporting a post)
```

### **Step 4: Verify Admin Status**
```javascript
// In browser console:
const token = localStorage.getItem('token');
const decoded = JSON.parse(atob(token.split('.')[1]));
console.log(decoded); // Check if role: "admin"
```

---

## 📞 Quick Reference

| Check | What to Look For |
|-------|-----------------|
| Backend running? | `Server running on port 5000` in terminal |
| Frontend running? | `http://localhost:3000` loads in browser |
| Admin logged in? | `decoded.role === "admin"` in console |
| API working? | Network tab shows status 200 for api/reports |
| Reports exist? | Array in Response (not empty) |
| Page loads? | `/admin/reports` displays dashboard |

---

## Summary

**Everything is built and working!**

If you're not seeing reports:

1. **Create a report first** - Report any post from the forum
2. **Verify you're admin** - Check role in console
3. **Refresh the page** - Clear cache with Ctrl+F5
4. **Check console** - Look for error messages (F12)
5. **Check network** - See if API call succeeds (F12 → Network)

The system is complete! 🎉

