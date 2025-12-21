# Post Management Features - Implementation Guide

## Features Implemented

### 1. ✅ Edit Posts
**Permissions:**
- Users can edit their own posts
- Admins can edit any post

**What Can Be Edited:**
- Post content (text)
- Links attached to the post
- **Cannot edit media** (users must delete the post and create a new one)

**How It Works:**
- Click the three-dot menu (⋯) on any post
- Select "Edit Post"
- Modal opens with editable content and links
- Users can add/remove links
- Click "Save Changes"

**Backend Endpoint:**
- `PATCH /api/forum/:postId` - Edit a post

---

### 2. ✅ Delete Posts
**Permissions:**
- Users can delete their own posts
- Admins can delete any post

**What Happens When Deleted:**
- Post is permanently removed
- All associated comments are deleted
- All media files are removed from server storage
- All related reports are not deleted (for audit trail)

**How It Works:**
- Click the three-dot menu (⋯) on any post
- Select "Delete Post"
- Confirmation dialog appears
- Click confirm to delete permanently

**Backend Endpoint:**
- `DELETE /api/forum/:postId` - Delete a post

---

### 3. ✅ Report Posts
**Permissions:**
- Any user can report posts from other users
- Users cannot report their own posts

**Report Reasons:**
- **Spam** - Unwanted or repetitive content
- **Inappropriate Content** - Offensive or adult content
- **Harassment** - Threatening or bullying behavior
- **Misinformation** - False or misleading information
- **Other** - Anything else requiring attention

**Additional Details:**
- Users can optionally provide more context in the description field
- Each user can only report the same post once
- All reports are tracked and available to admins

**How It Works:**
- Click the three-dot menu (⋯) on any post
- Select "Report Post"
- Modal opens with reason selection
- Optionally add description
- Click "Submit Report"
- Success confirmation appears

**Backend Endpoints:**
- `POST /api/reports/:postId/report` - Submit a report
- `GET /api/reports` - Get all reports (admin only, with status filter)
- `GET /api/reports/:postId` - Get reports for specific post (admin only)
- `PATCH /api/reports/:reportId/status` - Update report status (admin only)

---

## Database Models

### Report Model
```javascript
{
  _id: ObjectId,
  post: ObjectId (ref: ForumPost),
  reportedBy: ObjectId (ref: User),
  reason: String (enum: "spam", "inappropriate", "harassment", "misinformation", "other"),
  description: String (optional),
  status: String (enum: "pending", "reviewed", "resolved", "dismissed"),
  notes: String (admin notes, optional),
  createdAt: Date,
  updatedAt: Date
}
```

**Unique Constraint:** Each user can only report the same post once (post + reportedBy)

---

## Frontend Components

### 1. PostOptionsMenu.jsx
**Location:** `client/src/components/Forum/Post/PostOptionsMenu.jsx`

**Props:**
- `post` - The forum post object
- `currentUserId` - Current logged-in user's ID
- `isAdmin` - Whether current user is admin
- `onPostDeleted` - Callback when post is deleted
- `onPostEdited` - Callback when post is edited

**Features:**
- Dropdown menu with context-based actions
- Shows "Edit" button only if user owns post or is admin
- Shows "Delete" button only if user owns post or is admin
- Shows "Report" button only if user doesn't own post
- Closes menu when clicking outside
- Confirmation before deleting

### 2. EditPostModal.jsx
**Location:** `client/src/components/Forum/Post/EditPostModal.jsx`

**Props:**
- `post` - The forum post to edit
- `onClose` - Callback to close modal
- `onPostEdited` - Callback after successful edit

**Features:**
- Text editor for content (reuses TextEditor component)
- Add/remove links with URL validation
- Display current media (non-editable)
- Real-time error messages
- Success feedback

### 3. ReportPostModal.jsx
**Location:** `client/src/components/Forum/Post/ReportPostModal.jsx`

**Props:**
- `postId` - ID of post to report
- `onClose` - Callback to close modal

**Features:**
- Radio button selection for report reason
- Optional description textarea
- URL validation for multiple reasons
- Success confirmation screen
- Prevents duplicate reports (backend)
- Success feedback with auto-close

---

## Role-Based Access Control

| Action | User | Admin | Guest |
|--------|------|-------|-------|
| Create Post | ✓ | ✓ | ✗ |
| Edit Own Post | ✓ | ✓ | ✗ |
| Edit Any Post | ✗ | ✓ | ✗ |
| Delete Own Post | ✓ | ✓ | ✗ |
| Delete Any Post | ✗ | ✓ | ✗ |
| Report Post | ✓ | ✓ | ✗ |
| View Reports | ✗ | ✓ | ✗ |
| Update Report Status | ✗ | ✓ | ✗ |

---

## API Routes Summary

### Forum Routes (Existing + New)
```
POST   /api/forum                    - Create post
GET    /api/forum                    - Get all posts
GET    /api/forum/:id                - Get single post
PATCH  /api/forum/:postId            - Edit post ✨ NEW
DELETE /api/forum/:postId            - Delete post
DELETE /api/forum/:postId/media/:idx - Remove media ✨ NEW
POST   /api/forum/:id/like           - Like post
POST   /api/forum/:id/repost         - Repost
POST   /api/forum/:id/share          - Share post
POST   /api/forum/:postId/comment    - Add comment
GET    /api/forum/:postId/comments   - Get comments
```

### Report Routes (New)
```
POST   /api/reports/:postId/report   - Report a post
GET    /api/reports                  - Get all reports (admin)
GET    /api/reports/:postId          - Get reports for post (admin)
PATCH  /api/reports/:reportId/status - Update report status (admin)
```

---

## Files Modified/Created

### Backend
**Created:**
- `server/src/models/Report.js` - Report schema
- `server/src/controllers/reportController.js` - Report CRUD operations
- `server/src/Routes/reportRoutes.js` - Report API routes

**Modified:**
- `server/src/controllers/forumController.js` - Added editPost and removeMediaFromPost
- `server/src/Routes/forumRoutes.js` - Added edit and remove media routes
- `server/src/server.js` - Registered report routes

### Frontend
**Created:**
- `client/src/components/Forum/Post/PostOptionsMenu.jsx` - Options dropdown
- `client/src/components/Forum/Post/EditPostModal.jsx` - Edit modal
- `client/src/components/Forum/Post/ReportPostModal.jsx` - Report modal

**Modified:**
- `client/src/components/Forum/Post/PostDetailCard.jsx` - Added options menu
- `client/src/pages/Forum/ForumPost.jsx` - Added post edit/delete handlers

---

## Testing Checklist

### Edit Feature
- [ ] User can edit their own post content
- [ ] User can add new links to post
- [ ] User can remove links from post
- [ ] Media cannot be edited (helper text shown)
- [ ] Admin can edit any user's post
- [ ] Changes persist after refresh
- [ ] Non-owner cannot see edit button

### Delete Feature
- [ ] User can delete their own post
- [ ] Confirmation dialog appears before delete
- [ ] Post and comments are removed
- [ ] Media files are deleted from server
- [ ] User redirected to forum page
- [ ] Admin can delete any post
- [ ] Non-owner cannot see delete button

### Report Feature
- [ ] User cannot report their own post (button hidden)
- [ ] All report reasons are available
- [ ] Description field is optional
- [ ] URL validation works for descriptions
- [ ] Duplicate reports are prevented (message shown)
- [ ] Admin can view all reports
- [ ] Admin can filter reports by status
- [ ] Admin can update report status with notes

---

## Error Handling

### Edit Post
- "Content cannot be empty" - User tries to save empty post
- "Invalid URL format" - User adds malformed link URL
- "Failed to edit post" - Server error (with specific message)

### Delete Post
- "Failed to delete post" - Server error
- File deletion failures are logged but don't block post deletion

### Report Post
- "Please select a reason" - User submits without selecting reason
- "You have already reported this post" - User tries to report same post twice
- "Failed to report post" - Server error (with specific message)

---

## Security Considerations

1. **Authorization:** All edit/delete operations verify user ownership or admin status
2. **Unique Reports:** Database constraint prevents duplicate reports from same user
3. **Rate Limiting:** Consider implementing in production to prevent report spam
4. **Content Validation:** Server validates all input before processing
5. **File Deletion:** Safe file deletion with error handling
6. **Cascade Deletion:** Comments deleted with post (referential integrity)

---

## Future Enhancements

1. **Batch Delete** - Delete multiple posts at once
2. **Report Analytics** - Dashboard for viewing report trends
3. **Auto-Actions** - Auto-hide/delete posts with many reports
4. **Appeals** - Users can appeal post deletions
5. **Edit History** - Track edit history of posts
6. **Soft Delete** - Option to archive instead of permanently delete
7. **Report Templates** - Pre-filled report categories for common issues
