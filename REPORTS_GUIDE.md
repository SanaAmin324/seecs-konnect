# Reports System - Complete Guide

## Where Do Reported Posts Go?

When a user reports a post, the report is stored in the **MongoDB database** in the `reports` collection and is **ONLY accessible to admins**.

---

## How Reports Are Stored

### Database Storage
```
MongoDB Database
    └── reports collection
        ├── Report 1: { postId, reportedBy, reason, status, notes, ... }
        ├── Report 2: { postId, reportedBy, reason, status, notes, ... }
        └── Report N: ...
```

### Report Data Structure
```javascript
{
  _id: ObjectId,
  post: ObjectId (reference to ForumPost),
  reportedBy: ObjectId (reference to User who reported),
  reason: "spam" | "inappropriate" | "harassment" | "misinformation" | "other",
  description: String (optional detailed description),
  status: "pending" | "reviewed" | "resolved" | "dismissed",
  notes: String (admin notes),
  createdAt: Date,
  updatedAt: Date
}
```

---

## How to View Reported Posts

### Method 1: Admin Dashboard (Recommended) ✨ NEW

**Access:** Go to `/admin/reports` in your browser (only works for admins)

**What You Can Do:**
- ✅ View all reports with filters (pending, reviewed, resolved, dismissed)
- ✅ See report details: who reported, why, and what post
- ✅ Read the reported post content directly
- ✅ Add admin notes
- ✅ Update report status
- ✅ Jump to the actual post in the forum

**Steps:**
1. Log in as an admin
2. Navigate to `http://localhost:5000/admin/reports`
3. View pending reports
4. Click "View" button to see details
5. Update status and add notes
6. Click "Post" button to see the post in forum

---

### Method 2: API Endpoints (For Developers)

#### Get All Reports
```bash
GET /api/reports
Authorization: Bearer {admin-token}
Query Parameters:
  - status: "pending" | "reviewed" | "resolved" | "dismissed" (optional)
```

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/reports?status=pending" \
  -H "Authorization: Bearer your_admin_token"
```

**Response:**
```json
[
  {
    "_id": "report-id-123",
    "post": {
      "_id": "post-id-456",
      "content": "This post contains spam..."
    },
    "reportedBy": {
      "_id": "user-id-789",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "reason": "spam",
    "description": "Excessive promotional content",
    "status": "pending",
    "notes": "",
    "createdAt": "2025-12-21T10:00:00Z"
  }
]
```

#### Get Reports for a Specific Post
```bash
GET /api/reports/:postId
Authorization: Bearer {admin-token}
```

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/reports/post-id-456" \
  -H "Authorization: Bearer your_admin_token"
```

#### Update Report Status
```bash
PATCH /api/reports/:reportId/status
Authorization: Bearer {admin-token}
Content-Type: application/json

Body:
{
  "status": "reviewed" | "resolved" | "dismissed",
  "notes": "Admin comment about this report"
}
```

**Example Request:**
```bash
curl -X PATCH "http://localhost:5000/api/reports/report-id-123/status" \
  -H "Authorization: Bearer your_admin_token" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "resolved",
    "notes": "Post removed due to policy violation"
  }'
```

---

## Report Status Lifecycle

```
┌─────────────┐
│   pending   │  ← Report just submitted
└──────┬──────┘
       ↓
┌─────────────────────┐
│ Admin Reviews Repo  │
└──────┬──────────────┘
       ↓
   ┌───┴───┐
   ↓       ↓
┌─────┐ ┌──────────┐
│resolved  │  dismissed  │
└─────┘ └──────────┘
(Action taken)  (No action needed)
```

### Status Meanings:
- **pending** - Just submitted, awaiting admin review
- **reviewed** - Admin has looked at it and added notes
- **resolved** - Admin took action (post removed, user warned, etc.)
- **dismissed** - Report was reviewed but no action needed

---

## Key Features

### 1. Duplicate Prevention
Users cannot report the same post twice. If they try:
```json
{
  "message": "You have already reported this post"
}
```

### 2. Sorting
Reports are automatically sorted by most recent first (newest first)

### 3. Filtering
View reports by status:
- **Pending** - Needs review
- **Reviewed** - Reviewed but not resolved
- **Resolved** - Action taken
- **Dismissed** - No action needed

### 4. Admin-Only Access
- Only users with `role: "admin"` can view/manage reports
- Non-admins get a 403 Forbidden error

---

## Admin Workflow

### Step 1: Check Pending Reports
1. Go to `/admin/reports`
2. View all pending reports in the list
3. See quick info: who reported, reason, when

### Step 2: Review Details
1. Click "View" button on a report
2. See full details:
   - Full post content
   - Reporter name and email
   - Detailed description of report
   - Any previous admin notes

### Step 3: Take Action
1. Read the post and notes
2. Decide: resolve (action needed) or dismiss (false report)
3. Add admin notes explaining decision
4. Click "resolved" or "dismissed"

### Step 4: Track Resolution
- Reports marked as "resolved" = action was taken
- Reports marked as "dismissed" = no action needed
- Filter to see only resolved/dismissed reports

---

## Report Reasons

Users can report posts for:

| Reason | Description | Examples |
|--------|-------------|----------|
| **spam** | Unwanted promotional content | Ads, marketing spam, spam links |
| **inappropriate** | Offensive/adult content | Profanity, adult content, harassment |
| **harassment** | Targeted abuse | Personal attacks, bullying |
| **misinformation** | False/misleading info | Fake news, false claims |
| **other** | Anything else | Describe in optional field |

---

## Common Admin Tasks

### Task 1: Review New Reports
```
1. Go to /admin/reports
2. Click "pending" tab
3. Review each report
4. Click "View" for details
5. Update status to "reviewed"
6. Add notes about your review
```

### Task 2: Resolve a Report
```
1. View the report details
2. If action needed, click "resolved"
3. Add notes: "Post removed", "User warned", etc.
4. User can see action was taken
```

### Task 3: Track Trends
```
1. Filter by status
2. Notice which reasons appear most
3. Identify patterns (spam waves, harassment, etc.)
4. Adjust moderation strategy if needed
```

---

## Integration with Post Moderation

### When a Report is "Resolved"
Currently:
- Post remains visible in forum
- Admin notes are stored

### Suggested Future Enhancements:
- Auto-remove post when X reports received
- Notify user their post was reported
- Warn or suspend users with many violations
- Move reported posts to quarantine zone
- Send notification to post author

---

## Security & Permissions

### Authentication Required
All report endpoints require valid JWT token:
```
Authorization: Bearer {valid_jwt_token}
```

### Role-Based Access
- **Admin** - Full access to all reports
- **User** - Can report, cannot view other reports
- **Anonymous** - Cannot report (must be logged in)

### Data Isolation
- Users can only report once per post (unique constraint)
- Users cannot see who reported other posts
- Users cannot see other users' reports
- Only report creator and admins see the report

---

## Testing the Report System

### Test 1: Submit a Report
```javascript
// From browser console
const response = await fetch('http://localhost:5000/api/forum/:postId/report', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify({
    reason: 'spam',
    description: 'This is promotional spam'
  })
});
console.log(await response.json());
```

### Test 2: View All Reports (As Admin)
```javascript
const response = await fetch('http://localhost:5000/api/reports', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
console.log(await response.json());
```

### Test 3: Try as Non-Admin
```javascript
// Non-admin user tries to view reports
const response = await fetch('http://localhost:5000/api/reports', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
console.log(response.status); // Should be 403
```

---

## Files Involved

### Backend
- `server/src/models/Report.js` - Database schema
- `server/src/controllers/reportController.js` - Business logic
- `server/src/Routes/reportRoutes.js` - API routes

### Frontend
- `client/src/pages/Admin/ReportsDashboard.jsx` - Admin dashboard (NEW!)
- `client/src/components/Forum/Post/ReportPostModal.jsx` - Report submission form
- `client/src/App.jsx` - Route definition

---

## Troubleshooting

### Problem: Can't Access /admin/reports
**Solution:**
- Ensure you're logged in
- Check if your account is admin role
- If not, ask another admin to promote your account

### Problem: Report Not Appearing
**Solution:**
- Refresh page with Ctrl+F5 (hard refresh)
- Check if correct status filter is selected
- Check browser console for errors

### Problem: Can't Update Report Status
**Solution:**
- Ensure you have admin privileges
- Check internet connection
- Verify report ID is correct
- Check browser console for API errors

### Problem: Duplicate Report Error
**Solution:**
- This is intentional - prevents spam reporting
- User must use different account to report again
- Or dismiss the first report

---

## Best Practices for Admins

1. **Review Regularly**
   - Check pending reports daily
   - Don't let reports pile up

2. **Add Clear Notes**
   - Explain your decision
   - Helps other admins understand actions
   - Users might appeal in future

3. **Be Consistent**
   - Similar reports should get similar status
   - Keep policies consistent

4. **Take Action**
   - If you resolve a report, actually remove/warn the user
   - Don't just mark as resolved without action

5. **Communicate**
   - Future: Notify users of action taken
   - Future: Let reporters know outcome
   - Keep record for disputes

---

## Future Enhancements

✓ **Phase 1 (Current):**
- Report submission ✅
- Admin dashboard ✅ NEW!
- Status tracking ✅
- Report viewing ✅

📋 **Phase 2 (Planned):**
- Auto-remove posts after X reports
- Notify post author of report
- User warning system
- Reputation/trust score
- Appeal system
- Report analytics
- Bulk actions
- Email notifications
- Report aging (old reports auto-close)
- Moderator team (not just admins)

---

## Support

**For Users:**
- Use the report feature when seeing inappropriate content
- Be specific in your description
- Don't abuse the report system

**For Admins:**
- Check `/admin/reports` regularly
- Add clear notes with each action
- Follow community guidelines consistently

**For Developers:**
- See API documentation above
- Check reportController.js for implementation details
- Extend with custom logic as needed

