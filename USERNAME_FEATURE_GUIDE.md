# Username Feature Implementation Guide

## Overview
A unique username feature has been implemented for your SEECS Konnect app, similar to Instagram and LinkedIn. Users can now have unique usernames (with @ prefix) that can be used for:
- Searching and finding user profiles
- Tagging/mentioning users in comments (future implementation)
- Direct profile access via username

## Changes Made

### 1. User Model Updates
**File:** `server/src/models/User.js`

Added `username` field with the following properties:
- **Required:** Yes
- **Unique:** Yes (enforced at database level)
- **Format:** Lowercase, 3-30 characters
- **Allowed Characters:** Letters (a-z), numbers (0-9), underscores (_), and dots (.)
- **Validation Regex:** `/^[a-z0-9_.]+$/`
- **Indexed:** Yes (for faster queries)

### 2. Profile Controller Updates
**File:** `server/src/controllers/profileController.js`

#### New Functions Added:

**a) Check Username Availability**
```javascript
// Endpoint: GET /api/profile/check-username/:username
// Access: Public
// Returns: { available: boolean, username: string }
```
- Validates username format
- Checks if username is already taken
- Returns availability status

**b) Search Users**
```javascript
// Endpoint: GET /api/profile/search?q=searchterm
// Access: Private (requires authentication)
// Returns: Array of user objects matching search term
```
- Searches by username or name (case-insensitive)
- Returns up to 20 matching users
- Returns: `_id, name, username, email, profilePicture, headline, bio`

**c) Update User Profile (Enhanced)**
- Now handles username updates
- Validates new username format
- Checks for uniqueness before updating
- Prevents duplicate usernames

### 3. Auth Controller Updates
**File:** `server/src/controllers/authcontroller.js`

Updated both functions to include `username` in responses:
- `loginUser()` - Returns username in login response
- `getUserProfile()` - Returns username in profile data

### 4. Profile Routes Updates
**File:** `server/src/Routes/profileRoutes.js`

Added new routes:
```javascript
GET /api/profile/check-username/:username  // Check availability (public)
GET /api/profile/search?q=searchterm       // Search users (protected)
```

### 5. Seed Script Updates
**File:** `server/scripts/seedUsers.js`

Added sample usernames to all test users:
- admin → `admin`
- Ali Ahmed → `ali.ahmed`
- Sara Khan → `sara_khan`
- Sana Amin → `sana.amin`
- Fatima Batool → `fatima_batool`

## API Endpoints

### 1. Check Username Availability
```
GET /api/profile/check-username/:username
Access: Public
```

**Example Request:**
```javascript
GET http://localhost:5000/api/profile/check-username/john_doe
```

**Example Response:**
```json
{
  "available": true,
  "username": "john_doe"
}
```

**Error Responses:**
```json
{
  "message": "Username can only contain lowercase letters, numbers, underscores, and dots"
}

{
  "message": "Username must be between 3 and 30 characters"
}
```

### 2. Search Users
```
GET /api/profile/search?q=searchterm
Access: Private (requires Bearer token)
```

**Example Request:**
```javascript
GET http://localhost:5000/api/profile/search?q=ali
Headers: { Authorization: "Bearer YOUR_TOKEN" }
```

**Example Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Ali Ahmed",
    "username": "ali.ahmed",
    "email": "388054@seecs.edu.pk",
    "profilePicture": "/uploads/profile/ali.jpg",
    "headline": "CS Student | AI Enthusiast",
    "bio": "Passionate about machine learning"
  }
]
```

### 3. Update Profile (with Username)
```
PUT /api/profile/update
Access: Private
```

**Example Request:**
```javascript
PUT http://localhost:5000/api/profile/update
Headers: { 
  Authorization: "Bearer YOUR_TOKEN",
  Content-Type: "application/json"
}
Body: {
  "username": "new_username",
  "bio": "Updated bio",
  "headline": "Updated headline"
}
```

**Example Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Ali Ahmed",
  "email": "388054@seecs.edu.pk",
  "username": "new_username",
  "profilePicture": "/uploads/profile/ali.jpg",
  "bio": "Updated bio",
  "headline": "Updated headline",
  "location": "Islamabad",
  "website": "https://example.com",
  "socialLinks": {
    "linkedin": "",
    "github": "",
    "twitter": ""
  }
}
```

### 4. Login (Returns Username)
```
POST /api/users/login
Access: Public
```

**Example Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Ali Ahmed",
  "email": "388054@seecs.edu.pk",
  "username": "ali.ahmed",
  "role": "student",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "cms": "388054",
  "program": "CS",
  "batch": "2021",
  "class": "B1",
  "section": "S1",
  "courses": ["DSA", "OOP", "AI"]
}
```

## Username Validation Rules

### Format Requirements:
1. **Length:** 3-30 characters
2. **Case:** Automatically converted to lowercase
3. **Characters:** Only lowercase letters (a-z), numbers (0-9), underscores (_), and dots (.)
4. **Uniqueness:** Must be unique across all users
5. **No Spaces:** Spaces are not allowed

### Valid Examples:
- `john_doe`
- `sara.khan123`
- `ali_ahmed_99`
- `admin`
- `user.name`

### Invalid Examples:
- `John_Doe` (uppercase letters)
- `user name` (contains space)
- `user@name` (special character @)
- `ab` (too short, minimum 3 characters)
- `this_username_is_way_too_long_for_system` (exceeds 30 characters)

## Database Migration Required

Since you've added a new required field (`username`) to an existing User model, you need to:

### Option 1: Reseed the Database
```bash
cd server
node scripts/seedUsers.js
```
This will delete all existing users and create new ones with usernames.

### Option 2: Manually Add Usernames to Existing Users
If you want to keep existing users, you'll need to manually add usernames to each user in your MongoDB database, or create a migration script.

## Frontend Integration (Next Steps)

### 1. Display Username in UI
Update profile components to display `@username`:
```jsx
<div className="username">@{user.username}</div>
```

### 2. Username Input During Registration
Add username field to registration form:
```jsx
<input 
  type="text" 
  placeholder="Username" 
  value={username}
  onChange={(e) => setUsername(e.target.value.toLowerCase())}
/>
```

### 3. Check Username Availability
Implement real-time username availability checking:
```javascript
const checkUsername = async (username) => {
  const res = await fetch(`http://localhost:5000/api/profile/check-username/${username}`);
  const data = await res.json();
  return data.available;
};
```

### 4. Search Functionality
Implement user search in a search bar:
```javascript
const searchUsers = async (searchTerm) => {
  const res = await fetch(
    `http://localhost:5000/api/profile/search?q=${searchTerm}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return await res.json();
};
```

### 5. Profile Editing
Add username field to profile edit form with validation:
```jsx
<div>
  <label>Username</label>
  <input 
    type="text"
    value={username}
    onChange={handleUsernameChange}
    pattern="[a-z0-9_.]+"
    minLength={3}
    maxLength={30}
  />
  {usernameError && <span className="error">{usernameError}</span>}
</div>
```

## Future Enhancements

### 1. Mentioning Users in Comments
To implement @mentions in comments:

1. **Frontend:** Use a library like `react-mentions` or `draft-js-mention-plugin`
2. **Backend:** Parse comment text for @username patterns
3. **Notifications:** Create notifications when users are mentioned
4. **Linking:** Convert @username to clickable profile links

Example implementation:
```javascript
// Parse mentions from comment text
const parseMentions = (text) => {
  const mentionRegex = /@([a-z0-9_.]+)/g;
  return text.match(mentionRegex) || [];
};

// Create notifications for mentioned users
const notifyMentionedUsers = async (mentions, postId) => {
  for (let mention of mentions) {
    const username = mention.substring(1); // Remove @
    const user = await User.findOne({ username });
    if (user) {
      // Create notification
      await Notification.create({
        recipient: user._id,
        type: 'mention',
        content: `You were mentioned in a comment`,
        post: postId
      });
    }
  }
};
```

### 2. Profile URL with Username
Allow accessing profiles via username:
```javascript
// Route: /profile/@username
router.get('/profile/@:username', async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  // Return profile data
});
```

### 3. Advanced Search Features
- Search by multiple criteria (username, name, program, batch)
- Autocomplete suggestions
- Recent searches
- Popular users

## Testing the Implementation

### 1. Start the Server
```bash
cd server
npm start
```

### 2. Reseed the Database
```bash
node scripts/seedUsers.js
```

### 3. Test Endpoints with Postman/Thunder Client

**Test 1: Check Username Availability**
```
GET http://localhost:5000/api/profile/check-username/ali.ahmed
```

**Test 2: Login and Get Username**
```
POST http://localhost:5000/api/users/login
Body: {
  "email": "388054@seecs.edu.pk",
  "password": "password123"
}
```

**Test 3: Search Users**
```
GET http://localhost:5000/api/profile/search?q=ali
Headers: { Authorization: "Bearer YOUR_TOKEN" }
```

**Test 4: Update Username**
```
PUT http://localhost:5000/api/profile/update
Headers: { 
  Authorization: "Bearer YOUR_TOKEN",
  Content-Type: "application/json"
}
Body: {
  "username": "ali_ahmed_new"
}
```

## Troubleshooting

### Issue: "Username is required" error when logging in existing users
**Solution:** Reseed the database with `node scripts/seedUsers.js` or manually add usernames to existing users.

### Issue: Duplicate key error
**Solution:** Ensure all usernames are unique. Check your database for duplicate usernames.

### Issue: Username validation failing
**Solution:** Ensure username follows the rules:
- 3-30 characters
- Only lowercase letters, numbers, underscores, and dots
- No spaces or special characters

### Issue: Search not working
**Solution:** Ensure:
- User is authenticated (has valid token)
- Search query parameter is provided: `?q=searchterm`
- MongoDB is running and connected

## Summary

You now have a complete username system with:
✅ Unique username field in User model
✅ Username validation (format, length, uniqueness)
✅ API endpoint to check username availability
✅ API endpoint to search users by username/name
✅ Profile update with username change support
✅ Username returned in login/profile responses
✅ Test data with sample usernames

Next steps:
1. Reseed your database
2. Update frontend to display and edit usernames
3. Implement search UI component
4. Add @mention functionality in comments
