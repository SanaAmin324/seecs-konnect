# Username Feature - API Quick Reference

## Base URL
```
http://localhost:5000/api
```

## Endpoints

### 1. Check Username Availability
**Endpoint:** `GET /profile/check-username/:username`  
**Auth:** Public (No token required)  
**Description:** Check if a username is available and validate its format

**Example:**
```bash
GET /api/profile/check-username/john_doe
```

**Success Response (200):**
```json
{
  "available": true,
  "username": "john_doe"
}
```

**Error Responses:**
- 400: Invalid format or length
```json
{
  "message": "Username can only contain lowercase letters, numbers, underscores, and dots"
}
```

---

### 2. Search Users
**Endpoint:** `GET /profile/search?q=searchterm`  
**Auth:** Private (Bearer token required)  
**Description:** Search users by username or name

**Example:**
```bash
GET /api/profile/search?q=ali
Headers: { Authorization: "Bearer YOUR_TOKEN" }
```

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Ali Ahmed",
    "username": "ali.ahmed",
    "email": "388054@seecs.edu.pk",
    "profilePicture": "/uploads/profile/ali.jpg",
    "headline": "CS Student",
    "bio": "AI enthusiast"
  }
]
```

---

### 3. Update Profile (Including Username)
**Endpoint:** `PUT /profile/update`  
**Auth:** Private (Bearer token required)  
**Description:** Update user profile including username

**Example:**
```bash
PUT /api/profile/update
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

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Ali Ahmed",
  "email": "388054@seecs.edu.pk",
  "username": "new_username",
  "profilePicture": "/uploads/profile/ali.jpg",
  "bio": "Updated bio",
  "headline": "Updated headline",
  "location": "",
  "website": "",
  "socialLinks": {
    "linkedin": "",
    "github": "",
    "twitter": ""
  }
}
```

**Error Responses:**
- 400: Username already taken
```json
{
  "message": "Username is already taken"
}
```
- 400: Invalid format
```json
{
  "message": "Username can only contain lowercase letters, numbers, underscores, and dots"
}
```

---

### 4. Login (Returns Username)
**Endpoint:** `POST /users/login`  
**Auth:** Public  
**Description:** Login and receive user data including username

**Example:**
```bash
POST /api/users/login
Body: {
  "email": "388054@seecs.edu.pk",
  "password": "password123"
}
```

**Success Response (200):**
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

---

### 5. Get User Profile (Returns Username)
**Endpoint:** `GET /users/profile`  
**Auth:** Private (Bearer token required)  
**Description:** Get current user's profile data

**Example:**
```bash
GET /api/users/profile
Headers: { Authorization: "Bearer YOUR_TOKEN" }
```

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Ali Ahmed",
  "email": "388054@seecs.edu.pk",
  "username": "ali.ahmed",
  "role": "student",
  "cms": "388054",
  "program": "CS",
  "batch": "2021",
  "class": "B1",
  "section": "S1",
  "courses": ["DSA", "OOP", "AI"]
}
```

---

## Username Validation Rules

| Rule | Requirement |
|------|------------|
| **Length** | 3-30 characters |
| **Case** | Lowercase only (auto-converted) |
| **Allowed Characters** | a-z, 0-9, _ (underscore), . (dot) |
| **Not Allowed** | Spaces, special characters (@, #, -, etc.) |
| **Uniqueness** | Must be unique across all users |

## Regex Pattern
```javascript
/^[a-z0-9_.]+$/
```

## Valid Examples
✅ `john_doe`  
✅ `sara.khan`  
✅ `user123`  
✅ `ali_ahmed_99`  

## Invalid Examples
❌ `John_Doe` (uppercase)  
❌ `user name` (space)  
❌ `user@name` (special char)  
❌ `ab` (too short)  

## Frontend Usage Examples

### React - Check Username Availability
```javascript
const checkUsername = async (username) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/profile/check-username/${username}`
    );
    const data = await response.json();
    
    if (data.available) {
      console.log('Username is available!');
    } else {
      console.log('Username is taken');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### React - Search Users
```javascript
const searchUsers = async (searchTerm) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(
      `http://localhost:5000/api/profile/search?q=${searchTerm}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    const users = await response.json();
    console.log('Found users:', users);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### React - Update Username
```javascript
const updateUsername = async (newUsername) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(
      'http://localhost:5000/api/profile/update',
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: newUsername })
      }
    );
    
    if (response.ok) {
      const updatedUser = await response.json();
      console.log('Username updated:', updatedUser.username);
    } else {
      const error = await response.json();
      console.error('Error:', error.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Testing with cURL

### Check Username
```bash
curl http://localhost:5000/api/profile/check-username/test_user
```

### Search Users
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:5000/api/profile/search?q=ali"
```

### Update Username
```bash
curl -X PUT \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username":"new_username"}' \
  http://localhost:5000/api/profile/update
```

## Next Steps for @Mention Feature

When ready to implement mentions in comments, you'll need to:

1. **Parse mentions from text:** Extract @username patterns
2. **Validate mentioned users:** Check if users exist
3. **Create notifications:** Notify mentioned users
4. **Link mentions:** Convert @username to clickable links
5. **Update Comment model:** Store mentioned user IDs

Example mention parsing:
```javascript
const extractMentions = (text) => {
  const mentionRegex = /@([a-z0-9_.]+)/gi;
  const mentions = [];
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1].toLowerCase());
  }
  
  return [...new Set(mentions)]; // Remove duplicates
};

// Example: "Hey @ali.ahmed and @sara_khan, check this out!"
// Returns: ["ali.ahmed", "sara_khan"]
```
