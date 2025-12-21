# Where Do Reported Posts Go? 📋

## Quick Answer
When you report a post:
1. **Your report is saved** in MongoDB database
2. **Post stays visible** (not auto-deleted)
3. **Admins notified** via the Reports Dashboard
4. **Admin reviews & takes action**

---

## Complete Journey of a Report

```
User reports a post
        ↓
┌─────────────────────────────────────┐
│  Report Data Saved to MongoDB       │
│  ─────────────────────────────────  │
│  • Which post was reported          │
│  • Who reported it                  │
│  • Why (reason selected)            │
│  • What they wrote (description)    │
│  • When it was reported             │
│  • Status: "pending" (default)      │
└─────────────────────────────────────┘
        ↓
┌─────────────────────────────────────┐
│  Available to ADMINS ONLY           │
│  ─────────────────────────────────  │
│  Location: /admin/reports           │
│  Dashboard with all reports         │
└─────────────────────────────────────┘
        ↓
┌─────────────────────────────────────┐
│  Admin Reviews Report               │
│  ─────────────────────────────────  │
│  • Reads full report details        │
│  • Sees the post content            │
│  • Decides: Action needed or not?   │
└─────────────────────────────────────┘
        ↓
┌─────────────────────────────────────┐
│  Admin Takes Action                 │
│  ─────────────────────────────────  │
│  Option 1: Mark as "resolved"       │
│            (action was taken)       │
│  Option 2: Mark as "dismissed"      │
│            (false report)           │
│  Add notes explaining the decision  │
└─────────────────────────────────────┘
        ↓
    Report is closed
    Post remains visible (unless admin removed it separately)
```

---

## Where Reports Are Actually Stored

### **Database Location:**
```
MongoDB Database
    ↓
seecs_konnect (database name)
    ↓
reports (collection/table)
    ↓
[Report Document 1]
[Report Document 2]
[Report Document 3]
...
```

### **What Gets Stored:**

```javascript
{
  _id: ObjectId("..."),
  post: ObjectId("post_123"),           // Link to reported post
  reportedBy: ObjectId("user_456"),     // Link to reporter (who reported)
  reason: "spam",                       // Why: spam|inappropriate|harassment|misinformation|other
  description: "Excessive links...",    // Optional detailed reason
  status: "pending",                    // Current status
  notes: "",                            // Admin's notes (empty until reviewed)
  createdAt: Date("2025-12-21..."),     // When reported
  updatedAt: Date("2025-12-21...")      // Last update
}
```

---

## How Admins Access Reports

### **Method 1: Admin Dashboard (Best Way) ✨**

**URL:** `http://localhost:5000/admin/reports`

**What You See:**
- List of all reports
- Filter by status: pending → reviewed → resolved → dismissed
- Quick info: reporter name, reason, when reported
- Full post content viewable
- One-click access to the actual post

**How to Use:**
1. Login as admin account
2. Go to `/admin/reports`
3. Click on any report to view details
4. Update status and add notes
5. Save changes

### **Method 2: API Access (For Developers)**

```bash
# Get ALL reports (with optional filtering)
GET /api/reports
GET /api/reports?status=pending
GET /api/reports?status=reviewed
GET /api/reports?status=resolved
GET /api/reports?status=dismissed

# Get reports for a specific post
GET /api/reports/:postId

# Update a report status
PATCH /api/reports/:reportId/status
Body: { status: "reviewed", notes: "Admin comment..." }
```

**Headers Required:**
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

---

## Report Status Lifecycle

### **Status Flow:**

```
PENDING (Just submitted)
   ↓
REVIEWED (Admin looked at it)
   ↓
   ├─→ RESOLVED (Action taken - post removed, user warned)
   └─→ DISMISSED (False report - no action needed)
```

### **Status Meanings:**

| Status | Meaning | Next Step |
|--------|---------|-----------|
| **pending** | Just submitted, waiting for admin review | Review it |
| **reviewed** | Admin has read it | Take action or dismiss |
| **resolved** | Admin took action (post removed/user warned) | Close it |
| **dismissed** | Review complete, false report | Close it |

---

## Important Details

### **1. Post Visibility**
- ✅ Post **STAYS VISIBLE** even after being reported
- ❌ Post is **NOT auto-deleted** when reported
- 🔧 Admin must **manually remove** the post if needed
- 📌 Reports don't affect the post itself, only notify admins

### **2. Reporter Privacy**
- ✅ Only admins see who reported
- ❌ Other users can't see reports
- ❌ Reported user doesn't know they were reported
- ✅ Reporters can't report twice (prevents spam)

### **3. Data Kept Forever**
- Reports are permanently stored in database
- Helps track patterns of problematic behavior
- Can be used for statistics and moderation decisions
- Admins can filter and search reports

---

## Real Example

### **Scenario: User Reports Spam Post**

```
Timeline:
─────────────────────────────────────────────

2:15 PM - User clicks "Report" on post
         Selects reason: "spam"
         Writes: "This is promotional spam"
         Clicks "Submit Report"
         ✓ Report saved to database
         ✓ User sees: "Thank you for reporting"

2:16 PM - Report appears in /admin/reports
         Status: "pending"
         Appears in pending filter

3:45 PM - Admin opens /admin/reports
         Reads the spam report
         Checks the post content
         Confirms it's spam
         Clicks "resolved"
         Writes notes: "Post removed, user warned"
         ✓ Report updated in database
         ✓ Status changed to "resolved"

→ Post may be removed separately by admin
→ User may be warned/suspended separately
→ Report stays in database for record-keeping
```

---

## Admin Dashboard Features

### **View Reports By Status:**
- **Pending Tab** - New reports waiting for review
- **Reviewed Tab** - Reports already looked at
- **Resolved Tab** - Reports where action was taken
- **Dismissed Tab** - False reports that were rejected

### **Report Details Modal Shows:**
- Reporter's name and email
- Post content that was reported
- Reason selected + any description
- When it was reported
- Current status
- Any previous admin notes
- Buttons to update status

### **Admin Actions:**
1. Read the full report
2. Check the post content
3. Check reporter's history (future feature)
4. Decide: Take action or dismiss?
5. Add notes explaining decision
6. Click button to update status
7. (Separately) Remove post if needed, warn user if needed

---

## API Endpoints

### **1. Submit a Report (User)**
```
POST /api/forum/:postId/report
Headers: Authorization: Bearer {user_token}
Body: {
  reason: "spam",
  description: "This is promotional spam"
}

Response (201):
{
  message: "Post reported successfully",
  report: { _id, post, reportedBy, reason, ... }
}
```

### **2. Get All Reports (Admin Only)**
```
GET /api/reports?status=pending
Headers: Authorization: Bearer {admin_token}

Response (200):
[
  {
    _id: "report_123",
    post: { _id, content, user },
    reportedBy: { name, email },
    reason: "spam",
    description: "...",
    status: "pending",
    notes: "",
    createdAt: "..."
  },
  ...
]
```

### **3. Get Reports for One Post (Admin Only)**
```
GET /api/reports/:postId
Headers: Authorization: Bearer {admin_token}

Response (200):
[Reports for that specific post]
```

### **4. Update Report Status (Admin Only)**
```
PATCH /api/reports/:reportId/status
Headers: 
  Authorization: Bearer {admin_token}
  Content-Type: application/json

Body: {
  status: "resolved",
  notes: "Post removed due to spam policy violation"
}

Response (200):
{
  message: "Report updated successfully",
  report: { updated report data }
}
```

---

## Important Security Features

### **1. Admin-Only Access**
- Only users with `role: "admin"` can view reports
- Non-admins get 403 Forbidden error
- Each endpoint checks permissions

### **2. Duplicate Prevention**
- Same user cannot report same post twice
- Database has unique constraint: `(post, reportedBy)`
- Prevents report spam

### **3. Immutable Reporter ID**
- Can't change who reported
- Can't delete a report to hide it
- Full audit trail maintained

### **4. Timestamp Tracking**
- `createdAt` - When report submitted
- `updatedAt` - When last updated
- Helps track report processing speed

---

## Data Flow Diagram

```
┌─────────────────┐
│  User Clicks    │
│  "Report" btn   │
└────────┬────────┘
         │
         ↓
┌─────────────────────────┐
│ ReportPostModal opens   │
│ User selects reason     │
│ User adds description   │
│ User submits form       │
└────────┬────────────────┘
         │
         ↓
┌──────────────────────────────────┐
│ POST /api/forum/:postId/report   │
│ (backend creates Report doc)     │
└────────┬─────────────────────────┘
         │
         ↓
┌──────────────────────────────────┐
│  MongoDB Database                │
│  ↓                               │
│  reports collection              │
│  ↓                               │
│  New Report Document {           │
│    post: postId,                 │
│    reportedBy: userId,           │
│    reason: "spam",               │
│    description: "...",           │
│    status: "pending",            │
│    notes: "",                    │
│    createdAt: now,               │
│    updatedAt: now                │
│  }                               │
└──────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────┐
│  Frontend Shows Success Message  │
│  "Post reported successfully"    │
└──────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────┐
│  GET /api/reports                │
│  (Admin dashboard fetches all)   │
└────────┬─────────────────────────┘
         │
         ↓
┌──────────────────────────────────┐
│  Admin Reviews Report Dashboard  │
│  Filters by status: "pending"    │
│  Clicks "View" on a report       │
│  Reads full details              │
└────────┬─────────────────────────┘
         │
         ↓
┌──────────────────────────────────┐
│  Admin Updates Report Status     │
│  PATCH /api/reports/:reportId    │
│  Body: {                         │
│    status: "resolved",           │
│    notes: "Action taken"         │
│  }                               │
└────────┬─────────────────────────┘
         │
         ↓
┌──────────────────────────────────┐
│  MongoDB Updates Document        │
│  Status changed to "resolved"    │
│  Notes added                     │
│  updatedAt updated               │
└──────────────────────────────────┘
```

---

## Summary

### **Where Reports Go:**

1. **Input:** User submits report on a post
2. **Storage:** Report saved to MongoDB database
3. **Location:** `seecs_konnect.reports` collection
4. **Access:** Admin-only via `/admin/reports` dashboard
5. **Management:** Admins review, add notes, update status
6. **Archive:** Permanently stored for record-keeping

### **Key Points:**
- ✅ Reports are private (admin-only)
- ✅ Post stays visible (report doesn't auto-delete)
- ✅ Duplicate reports prevented
- ✅ Full audit trail maintained
- ✅ Admin notes recorded for each action
- ✅ Status tracks progress from pending → resolved/dismissed

### **Next Steps:**
- Check `/admin/reports` to see your reports
- Filter by status to see pending reports
- Click to view full details
- Add notes and update status
- Track moderation trends

