# How to Access Admin Reports Dashboard

## ❌ Problem: "Cannot GET /admin/reports"

This error means the route wasn't found. Here's how to fix it:

---

## ✅ Solution

### **Step 1: Make Sure BOTH Servers Are Running**

You need **TWO** separate servers running:

#### **Server 1 - Backend (Port 5000)**
```bash
cd server
npm run dev
```
You should see: `Server running on port 5000`

#### **Server 2 - Frontend (Port 3000)**
```bash
cd client
npm run dev
```
You should see: `Local: http://localhost:3000`

---

### **Step 2: Access the Correct URL**

#### ❌ **WRONG** (Backend port):
```
http://localhost:5000/admin/reports
```
This will give: `Cannot GET /admin/reports`

#### ✅ **CORRECT** (Frontend port):
```
http://localhost:3000/admin/reports
```
This should show the Reports Dashboard

---

## Quick Checklist

- [ ] Backend running on port 5000? (Check terminal)
- [ ] Frontend running on port 3000? (Check terminal)
- [ ] Using `localhost:3000` (not 5000)?
- [ ] Logged in as admin user?
- [ ] Browser shows the Reports Dashboard?

---

## If Still Not Working

### **1. Check Frontend is Running**
```bash
# In client folder, run:
npm run dev

# You should see:
#  ➜  Local:   http://localhost:3000
#  ➜  Press q to quit
```

### **2. Check You're Admin**
- Log in with admin account
- Check your user role in database

### **3. Try These URLs in Order**
1. `http://localhost:3000/` - Does home page load?
2. `http://localhost:3000/login` - Can you login?
3. `http://localhost:3000/forums` - Can you see forums?
4. `http://localhost:3000/admin/reports` - Reports dashboard?

### **4. Check Browser Console**
1. Press F12 (open DevTools)
2. Go to Console tab
3. Look for any errors
4. Share the error messages

### **5. Check Network Tab**
1. Press F12 (DevTools)
2. Go to Network tab
3. Click on /admin/reports
4. Check if any API calls failed

---

## Port Reference

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| Backend API | 5000 | http://localhost:5000 | API endpoints |
| Frontend App | 3000 | http://localhost:3000 | React app UI |

---

## Common Mistakes

| ❌ Wrong | ✅ Correct |
|---------|-----------|
| localhost:5000/admin/reports | localhost:3000/admin/reports |
| Accessing backend for UI | Accessing frontend for UI |
| Only backend running | Both backend & frontend running |
| Not logged in | Logged in as admin |
| Wrong user role | Admin user role |

---

## Summary

**The Reports Dashboard is a FRONTEND page, not a backend API.**

- **Backend API:** `http://localhost:5000/api/reports`
- **Frontend Page:** `http://localhost:3000/admin/reports`

Make sure both servers are running, then access port 3000, not 5000!

