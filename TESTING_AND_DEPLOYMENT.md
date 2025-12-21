# Testing & Deployment Checklist

## Pre-Deployment Testing

### Backend Tests

#### Edit Post Endpoint
- [ ] Owner can edit their post
- [ ] Admin can edit any post
- [ ] Non-owner cannot edit post (403 error)
- [ ] Empty content is rejected (400 error)
- [ ] Invalid post ID returns 404
- [ ] Links are properly parsed and saved
- [ ] Media array is preserved during edit
- [ ] Edit updates `updatedAt` timestamp
- [ ] Multiple edits work correctly
- [ ] XSS attempts in content are handled

#### Delete Post Endpoint
- [ ] Owner can delete their post
- [ ] Admin can delete any post
- [ ] Non-owner cannot delete post (403 error)
- [ ] Invalid post ID returns 404
- [ ] Associated comments are deleted
- [ ] Media files are removed from disk
- [ ] File deletion errors don't crash server
- [ ] Multiple deletes don't cause issues
- [ ] Post is truly removed from database

#### Report Post Endpoint
- [ ] User can report a post (not owned by them)
- [ ] User cannot report their own post
- [ ] Invalid report reason is rejected
- [ ] Duplicate reports are prevented
- [ ] Report data is properly stored
- [ ] Optional description field works
- [ ] Invalid post ID returns 404

#### Get Reports Endpoint
- [ ] Admin can view all reports
- [ ] Non-admin cannot view reports (403 error)
- [ ] Filter by status works
- [ ] Populated fields include user and post data
- [ ] Sorting by createdAt works

#### Update Report Status Endpoint
- [ ] Admin can update report status
- [ ] Non-admin cannot update (403 error)
- [ ] Invalid status is rejected
- [ ] Admin notes are saved
- [ ] Status changes persist in database

### Frontend Tests

#### Edit Modal
- [ ] Modal opens when clicking Edit button
- [ ] Content editor displays current text
- [ ] Links are displayed correctly
- [ ] Links can be added with valid URLs
- [ ] Links can be removed
- [ ] Invalid URLs show error
- [ ] Media section is read-only
- [ ] Save button is disabled on empty content
- [ ] Cancel button closes without saving
- [ ] Loading state shows while saving
- [ ] Success message appears
- [ ] Modal closes after success
- [ ] Errors display with details
- [ ] Edit works on full post and detail views

#### Delete Confirmation
- [ ] Confirmation dialog appears
- [ ] Cancel closes dialog without deleting
- [ ] Confirm triggers delete
- [ ] Loading state shows during delete
- [ ] Success message displays
- [ ] Redirect to forum happens
- [ ] Errors show with details

#### Report Modal
- [ ] Modal opens when clicking Report button
- [ ] All 5 reason options are visible
- [ ] Only one reason can be selected
- [ ] Description field is optional
- [ ] Submit button disabled without reason
- [ ] Submit shows loading state
- [ ] Success screen displays
- [ ] Success auto-closes after 1.5s
- [ ] Duplicate report error shows
- [ ] Cannot report own post (button hidden)

#### Permission Display
- [ ] Owner sees Edit and Delete buttons
- [ ] Other users see Report button
- [ ] Admin sees all three buttons
- [ ] Non-authenticated users don't see menu
- [ ] Buttons disabled appropriately

### Integration Tests

#### Full Edit Flow
- [ ] User creates post
- [ ] User edits post content
- [ ] Changes display in feed
- [ ] Changes display on detail page
- [ ] Changes persist after refresh
- [ ] Admin can edit user's post
- [ ] Edited timestamp updates

#### Full Delete Flow
- [ ] User creates post with media
- [ ] User deletes post
- [ ] Post removed from feed
- [ ] Comments removed from database
- [ ] Media files deleted from server
- [ ] User redirected to forum
- [ ] Admin can delete user's post

#### Full Report Flow
- [ ] User reports post
- [ ] Report saved in database
- [ ] User cannot report same post twice
- [ ] Admin views report
- [ ] Admin updates report status
- [ ] Status change reflects in database

### Database Tests

#### Data Integrity
- [ ] Edit doesn't orphan data
- [ ] Delete cascades to comments
- [ ] Reports reference valid posts
- [ ] Unique constraint on reports works
- [ ] Indexes are created correctly

### Security Tests

#### Authorization
- [ ] Unauthenticated requests rejected
- [ ] Invalid tokens rejected
- [ ] Token expiration handled
- [ ] Non-owner edit rejected (403)
- [ ] Non-owner delete rejected (403)
- [ ] Non-admin report view rejected (403)

#### Input Validation
- [ ] XSS attempts blocked
- [ ] SQL injection attempts fail
- [ ] File upload validation works
- [ ] URL validation prevents malicious links
- [ ] Reason enum validated

#### File Operations
- [ ] File paths are safe
- [ ] Directory traversal prevented
- [ ] File deletion doesn't affect other posts
- [ ] Orphaned files are cleaned up

---

## Deployment Steps

### 1. Pre-Deployment
```bash
# Backup database
mongodump --uri="mongodb://..." --out=/backup/$(date +%Y%m%d)

# Run all tests
npm run test
npm run test:integration

# Check code coverage
npm run test:coverage

# Lint code
npm run lint
```

### 2. Backend Deployment
```bash
# Install dependencies
cd server
npm install

# Create any missing indexes
node scripts/createIndexes.js

# Verify server starts
npm run dev

# Run health checks
curl http://localhost:5000/
```

### 3. Frontend Deployment
```bash
# Build for production
cd client
npm run build

# Test build locally
npm run preview

# Deploy to hosting
# (Steps depend on your hosting provider)
```

### 4. Post-Deployment Verification
```bash
# Test edit endpoint
curl -X PATCH http://api.example.com/api/forum/:postId \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Updated content"}'

# Test delete endpoint
curl -X DELETE http://api.example.com/api/forum/:postId \
  -H "Authorization: Bearer $TOKEN"

# Test report endpoint
curl -X POST http://api.example.com/api/reports/:postId/report \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason":"spam","description":"Spam content"}'

# Verify database indexes
db.reports.getIndexes()
```

---

## Rollback Plan

### If Issues Occur

#### Quick Rollback (Last 30 mins)
```bash
# Revert backend
git revert HEAD~6 HEAD~1

# Revert frontend
git revert HEAD

# Restart services
systemctl restart app-server
systemctl restart app-frontend

# Monitor logs
tail -f /var/log/app-server.log
tail -f /var/log/app-frontend.log
```

#### Full Rollback
```bash
# Restore from backup
mongorestore --uri="mongodb://..." /backup/[previous-date]

# Deploy previous version
git checkout [previous-tag]
npm run build && npm start

# Notify users
# Send announcement about service restoration
```

#### Data Recovery
```bash
# If data was corrupted, restore posts
mongorestore --uri="mongodb://..." /backup/[date] --collection ForumPost

# Verify data integrity
db.ForumPost.find().count()
db.Comment.find().count()
db.Report.find().count()
```

---

## Performance Baseline

### Before Deployment
```
Edit Post Load Time: _____ ms
Delete Post Load Time: _____ ms
Report Post Load Time: _____ ms
Get Reports Load Time: _____ ms
Database Query Time: _____ ms
```

### After Deployment
```
Edit Post Load Time: _____ ms (should be similar)
Delete Post Load Time: _____ ms (should be similar)
Report Post Load Time: _____ ms (should be similar)
Get Reports Load Time: _____ ms (should be <500ms)
Database Query Time: _____ ms (should be similar)
```

---

## Monitoring Setup

### Logs to Monitor
```
[Backend] POST /api/reports/:postId/report
[Backend] PATCH /api/forum/:postId
[Backend] DELETE /api/forum/:postId
[Database] Report insertions
[Database] ForumPost updates
[Database] Comment deletions
[Frontend] Modal open/close events
[Frontend] Form submissions
```

### Error Thresholds
```
Edit errors > 5/hour → Alert
Delete errors > 3/hour → Alert
Report errors > 10/hour → Alert
Database errors > 2% → Alert
File system errors > 1% → Alert
```

### Metrics to Track
```
✓ Edit posts per hour
✓ Delete posts per hour
✓ Reports submitted per hour
✓ Report resolution time
✓ File deletion success rate
✓ Average response time
✓ Database indexes efficiency
✓ Error rates by endpoint
```

---

## Post-Deployment Tasks

### Day 1
- [ ] Monitor error logs for issues
- [ ] Verify all endpoints responding
- [ ] Check database indexes are working
- [ ] Monitor file system for disk space
- [ ] Test with real user accounts
- [ ] Verify emails working (if implemented)

### Week 1
- [ ] Monitor performance metrics
- [ ] Check for any edge cases
- [ ] Gather user feedback
- [ ] Verify no data loss
- [ ] Check report queue
- [ ] Review admin dashboard

### Month 1
- [ ] Analyze usage patterns
- [ ] Optimize database queries if needed
- [ ] Review security logs
- [ ] Archive old reports
- [ ] Document lessons learned

---

## User Communication

### Pre-Launch Announcement
```
📢 NEW FEATURES COMING SOON

We're excited to announce three new features:

✏️  EDIT POSTS - Fix typos or update content
🗑️  DELETE POSTS - Remove posts you no longer want
🚩 REPORT POSTS - Help keep community safe

These features will be available starting [DATE].

Learn more: [LINK TO USER GUIDE]
```

### Launch Day Announcement
```
🎉 NEW FEATURES LIVE NOW

✏️  Edit Post
- Click the ⋯ menu and select "Edit Post"
- Update content and links anytime

🗑️  Delete Post  
- Click the ⋯ menu and select "Delete Post"
- Permanent removal (confirm first)

🚩 Report Post
- Click the ⋯ menu and select "Report Post"
- Help us keep the community safe

Need help? See [USER GUIDE LINK]
```

### Admin Notification
```
👨‍💼 NEW ADMIN TOOLS AVAILABLE

Reports Dashboard
- View all reports: /admin/reports
- Filter by status, reason, date
- Update status with notes

User Management
- View user report history
- Manage reported content
- Update report status

Training: [LINK TO ADMIN GUIDE]
```

---

## Documentation Updates

### Update These Documents
- [ ] README.md - Add features section
- [ ] API Documentation - Add new endpoints
- [ ] User Handbook - Link to user guide
- [ ] Admin Manual - Add report management
- [ ] Database Schema - Document Report model
- [ ] Architecture Diagram - Add report flow
- [ ] Deployment Guide - Add new steps
- [ ] Troubleshooting Guide - Add common issues

### Create These Documents
- [ ] Release Notes
- [ ] Migration Guide (for users)
- [ ] Admin Quick Start
- [ ] Report Management Guide

---

## Maintenance Tasks

### Weekly
- [ ] Review error logs
- [ ] Check disk space (for media files)
- [ ] Verify backups running
- [ ] Monitor database performance
- [ ] Check report queue size

### Monthly
- [ ] Archive resolved reports
- [ ] Review security logs
- [ ] Optimize slow queries
- [ ] Update dependencies
- [ ] Clean up orphaned files
- [ ] Review user feedback

### Quarterly
- [ ] Full security audit
- [ ] Performance optimization
- [ ] Database cleanup
- [ ] Update documentation
- [ ] Plan next features

---

## Known Issues & Workarounds

### Issue: Edit modal doesn't refresh in some browsers
**Status:** Investigate
**Workaround:** Full page refresh (F5)

### Issue: File deletion sometimes fails
**Status:** Monitor
**Workaround:** Manual cleanup script runs nightly

### Issue: Reports don't populate user data
**Status:** Fixed in v1.0.1
**Workaround:** Manually check user in database

---

## Contact & Support

**Issue Tracking:** GitHub Issues
**Slack Channel:** #forum-features
**Documentation:** `/docs/EDITING_AND_REPORTING.md`
**User Guide:** `/docs/USER_GUIDE.md`

---

**Last Updated:** [TODAY'S DATE]
**Version:** 1.0.0
**Status:** ✅ Ready for Production
