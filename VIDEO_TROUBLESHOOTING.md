# Video Display Troubleshooting Guide

## Issue
Videos posted in the forum are not displaying/playing.

## What Was Fixed

### 1. **Server-Side Video Streaming Enhancement**
   - Added proper HTTP headers for video files
   - Enabled byte-range requests for better video streaming
   - Configured Content-Type headers for .mp4, .webm, and .mov files

### 2. **Frontend Video Rendering Improvements**
   - Added `preload="metadata"` to video tags for faster loading
   - Added `controlsList="nodownload"` to prevent unauthorized downloads
   - Added fallback type detection (checks filename extension if type field missing)
   - Added error logging to help identify issues
   - Added `bg-black` background for better video appearance

### 3. **Files Modified**
   - `server/src/server.js` - Added video headers configuration
   - `client/src/components/Forum/PostMedia.jsx` - Enhanced video rendering
   - `client/src/components/Forum/PostCard.jsx` - Enhanced video rendering

---

## How Videos Are Now Handled

### Backend Flow
```
User uploads video
    ↓
Multer validates file type (checks MIME type)
    ↓
Video saved to uploads/forum/ folder
    ↓
Filename and type stored in MongoDB
    ↓
Express serves video with proper headers
```

### Frontend Flow
```
Post data loaded from API
    ↓
Check if media[].type === "video"
    ↓
If missing, fallback to filename extension check
    ↓
Render <video> tag with proper attributes
    ↓
Show player controls automatically
```

---

## Debugging Steps

### Step 1: Check Server Logs
When you start the server, you should see:
```
Server running on port 5000
```

### Step 2: Verify Video File Exists
Run this command in the server directory:
```bash
ls uploads/forum/ | grep -E "\.(mp4|webm|mov)$"
```

You should see video files with timestamps like:
```
1766293405596-994811246.mp4
```

### Step 3: Test Direct Video Access
Open this in your browser (replace filename with actual):
```
http://localhost:5000/uploads/forum/1766293405596-994811246.mp4
```

The video should:
- Either play directly, or
- Offer to download

If you get 404, the file doesn't exist or the server isn't running.

### Step 4: Check Browser Console
1. Open DevTools (F12 in Chrome/Firefox)
2. Go to Console tab
3. Look for errors like:
   - "Video loading error" - Server issue
   - "Failed to load video from:" - Wrong URL
   - Network errors - CORS or server down

### Step 5: Verify Browser Support
Check if your browser supports HTML5 video:
```javascript
// Run in browser console
console.log(document.createElement('video').canPlayType('video/mp4'));
```

Should output: `"maybe"` or `"probably"` (not empty string)

---

## Common Issues & Solutions

### Issue 1: Video Tag Shows But No Video
**Cause:** Server isn't running or returns 404

**Solution:**
1. Ensure server is running: `npm run dev` in server folder
2. Verify uploads folder exists: `server/uploads/forum/`
3. Check server logs for errors

### Issue 2: Black Box Appears (No Video Controls)
**Cause:** Video file format not supported by browser

**Solution:**
1. Verify file is actually .mp4 (not renamed image)
2. Try uploading a different video
3. Check browser console for MIME type errors

### Issue 3: "Your Browser Doesn't Support Video Tag"
**Cause:** Browser doesn't support HTML5 video or file format

**Solution:**
1. Try a different browser (Chrome, Firefox, Safari)
2. Ensure video is in MP4 format
3. Check if JavaScript is enabled

### Issue 4: Video Takes Forever to Load
**Cause:** Large file size or slow network

**Solution:**
1. Upload smaller videos (under 50MB recommended)
2. Ensure stable internet connection
3. Check network tab in DevTools (F12) to see download speed

---

## API Response Format

The forum API returns posts with videos like this:

```json
{
  "_id": "post_id",
  "content": "Check out this video!",
  "user": { "name": "John", "email": "john@example.com" },
  "media": [
    {
      "type": "video",
      "filename": "1766293405596-994811246.mp4",
      "path": "uploads/forum/1766293405596-994811246.mp4",
      "mimetype": "video/mp4"
    }
  ],
  "likes": [],
  "reposts": [],
  "commentCount": 0,
  "createdAt": "2025-12-21T10:03:25.596Z"
}
```

Key fields:
- `type: "video"` - Indicates this is video media
- `filename` - Used to construct URL: `http://localhost:5000/uploads/forum/{filename}`
- `mimetype` - Original MIME type from upload

---

## Browser Compatibility

| Browser | MP4 Support | WebM Support |
|---------|-----------|--------------|
| Chrome | ✅ Yes | ✅ Yes |
| Firefox | ✅ Yes | ✅ Yes |
| Safari | ✅ Yes | ❌ No |
| Edge | ✅ Yes | ✅ Yes |
| IE 11 | ❌ No | ❌ No |

**Recommendation:** Use MP4 format for maximum compatibility.

---

## Testing Checklist

- [ ] Server is running (`npm run dev` in server folder)
- [ ] `uploads/forum/` folder exists and has video files
- [ ] Can access `http://localhost:5000/uploads/forum/{filename}` directly
- [ ] Browser console has no errors
- [ ] Video plays in browser's native player
- [ ] Video renders in forum post card
- [ ] Video renders in forum post detail page
- [ ] Video controls are visible (play, pause, progress bar)
- [ ] Can seek through video
- [ ] Can change volume

---

## Performance Tips

1. **Use MP4 Format**
   - Most widely supported
   - Generally smaller file size than WebM
   - Works on all modern browsers

2. **Optimize Before Upload**
   ```bash
   ffmpeg -i input.mp4 -c:v libx264 -preset fast -crf 23 output.mp4
   ```

3. **Size Recommendations**
   - Keep under 50MB for smooth playback
   - Resolution: 720p or lower for web
   - Bitrate: 1500-3000 kbps

4. **Lazy Loading**
   - Videos use `preload="metadata"` for faster page load
   - Only video metadata loads until user clicks play

---

## For Developers

### To Add Additional Video Formats

Edit `server/src/middleware/forumUpload.js`:
```javascript
const allowedTypes = [
  "video/mp4",
  "video/webm",
  "video/quicktime",      // .mov files
  "video/x-matroska",     // .mkv files (if needed)
];
```

### To Change Video Player Behavior

Edit `client/src/components/Forum/PostMedia.jsx`:
```javascript
<video
  src={mediaUrl}
  controls              // Show player controls
  controlsList="nodownload" // Prevent downloading
  preload="metadata"    // Load only metadata initially
  poster="thumbnail.jpg" // Optional: show image before play
>
```

### To Add Video Thumbnails

Update the media schema to include `thumbnail` field and generate on upload.

---

## Still Having Issues?

1. **Clear browser cache:** Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
2. **Restart servers:** Kill and restart both client and server
3. **Check file permissions:** Ensure `uploads/` folder has read permissions
4. **Verify CORS:** Check if errors mention CORS in browser console
5. **Try different video:** Upload a small test video to isolate issue

---

## Next Steps

Once videos are playing:
1. Test editing posts with videos (videos can't be edited, only removed)
2. Test deleting posts (videos automatically cleaned up)
3. Monitor disk usage in uploads folder
4. Consider implementing video compression on upload

