# Username Feature Testing Guide

## Prerequisites
1. Make sure MongoDB is running
2. Reseed the database: `node server/scripts/seedUsers.js`
3. Start the server: `cd server && npm start`

## Test 1: Check Username Availability

### Test Available Username
```bash
curl http://localhost:5000/api/profile/check-username/new_user
```

**Expected Response:**
```json
{
  "available": true,
  "username": "new_user"
}
```

### Test Taken Username
```bash
curl http://localhost:5000/api/profile/check-username/ali.ahmed
```

**Expected Response:**
```json
{
  "available": false,
  "username": "ali.ahmed"
}
```

### Test Invalid Username (too short)
```bash
curl http://localhost:5000/api/profile/check-username/ab
```

**Expected Response (400 Error):**
```json
{
  "message": "Username must be between 3 and 30 characters"
}
```

### Test Invalid Username (special characters)
```bash
curl http://localhost:5000/api/profile/check-username/user@name
```

**Expected Response (400 Error):**
```json
{
  "message": "Username can only contain lowercase letters, numbers, underscores, and dots"
}
```

---

## Test 2: Login and Receive Username

```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"388054@seecs.edu.pk","password":"password123"}'
```

**Expected Response:**
```json
{
  "_id": "...",
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

**Save the token for next tests!**

---

## Test 3: Search Users

Replace `YOUR_TOKEN` with the token from Test 2:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:5000/api/profile/search?q=ali"
```

**Expected Response:**
```json
[
  {
    "_id": "...",
    "name": "Ali Ahmed",
    "username": "ali.ahmed",
    "email": "388054@seecs.edu.pk",
    "profilePicture": "",
    "headline": "",
    "bio": ""
  }
]
```

### Search by partial username
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:5000/api/profile/search?q=sara"
```

---

## Test 4: Update Username

Replace `YOUR_TOKEN` with the token from Test 2:

```bash
curl -X PUT http://localhost:5000/api/profile/update \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username":"ali_ahmed_updated"}'
```

**Expected Response:**
```json
{
  "_id": "...",
  "name": "Ali Ahmed",
  "email": "388054@seecs.edu.pk",
  "username": "ali_ahmed_updated",
  "profilePicture": "",
  "bio": "",
  "headline": "",
  "location": "",
  "website": "",
  "socialLinks": {
    "linkedin": "",
    "github": "",
    "twitter": ""
  }
}
```

### Try to use an already taken username (should fail)
```bash
curl -X PUT http://localhost:5000/api/profile/update \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin"}'
```

**Expected Response (400 Error):**
```json
{
  "message": "Username is already taken"
}
```

---

## Test 5: Get User Profile

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/users/profile
```

**Expected Response:**
```json
{
  "_id": "...",
  "name": "Ali Ahmed",
  "email": "388054@seecs.edu.pk",
  "username": "ali_ahmed_updated",
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

## Using Postman / Thunder Client

### Collection Setup

#### 1. Check Username Availability
- **Method:** GET
- **URL:** `http://localhost:5000/api/profile/check-username/{{username}}`
- **Auth:** None

#### 2. Login
- **Method:** POST
- **URL:** `http://localhost:5000/api/users/login`
- **Auth:** None
- **Body (JSON):**
```json
{
  "email": "388054@seecs.edu.pk",
  "password": "password123"
}
```
- **Tests (to save token):**
```javascript
pm.test("Save token", function() {
    var jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
});
```

#### 3. Search Users
- **Method:** GET
- **URL:** `http://localhost:5000/api/profile/search?q={{searchTerm}}`
- **Auth:** Bearer Token
- **Token:** `{{token}}`

#### 4. Update Username
- **Method:** PUT
- **URL:** `http://localhost:5000/api/profile/update`
- **Auth:** Bearer Token
- **Token:** `{{token}}`
- **Body (JSON):**
```json
{
  "username": "new_username"
}
```

#### 5. Get Profile
- **Method:** GET
- **URL:** `http://localhost:5000/api/users/profile`
- **Auth:** Bearer Token
- **Token:** `{{token}}`

---

## Testing Validation Rules

### Valid Usernames ✅
- `john_doe`
- `user123`
- `sara.khan`
- `ali_ahmed_99`
- `user.name.123`

### Invalid Usernames ❌

#### Too Short (< 3 characters)
```bash
curl http://localhost:5000/api/profile/check-username/ab
```
Expected: Error message

#### Too Long (> 30 characters)
```bash
curl http://localhost:5000/api/profile/check-username/this_username_is_way_too_long_to_be_valid
```
Expected: Error message

#### Contains Spaces
```bash
curl http://localhost:5000/api/profile/check-username/john%20doe
```
Expected: Error message

#### Contains Special Characters
```bash
curl http://localhost:5000/api/profile/check-username/user@name
curl http://localhost:5000/api/profile/check-username/user-name
curl http://localhost:5000/api/profile/check-username/user#name
```
Expected: Error message for each

#### Uppercase Letters (should auto-convert)
```bash
curl http://localhost:5000/api/profile/check-username/JohnDoe
```
Expected: Returns `"username": "johndoe"` (lowercase)

---

## Quick Test Script

Save this as `test-username-api.sh` (Linux/Mac) or `test-username-api.ps1` (Windows PowerShell):

### Bash Script (Linux/Mac)
```bash
#!/bin/bash

BASE_URL="http://localhost:5000/api"

echo "Testing Username Feature..."
echo ""

echo "1. Testing username availability (should be available)..."
curl -s "$BASE_URL/profile/check-username/test_new_user" | json_pp
echo ""

echo "2. Testing username availability (should be taken)..."
curl -s "$BASE_URL/profile/check-username/admin" | json_pp
echo ""

echo "3. Testing invalid username (too short)..."
curl -s "$BASE_URL/profile/check-username/ab" | json_pp
echo ""

echo "4. Logging in..."
TOKEN=$(curl -s -X POST "$BASE_URL/users/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"388054@seecs.edu.pk","password":"password123"}' | \
  grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"
echo ""

echo "5. Searching for users..."
curl -s -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/profile/search?q=ali" | json_pp
echo ""

echo "Tests complete!"
```

### PowerShell Script (Windows)
```powershell
$BASE_URL = "http://localhost:5000/api"

Write-Host "Testing Username Feature..." -ForegroundColor Green
Write-Host ""

Write-Host "1. Testing username availability (should be available)..." -ForegroundColor Yellow
Invoke-RestMethod -Uri "$BASE_URL/profile/check-username/test_new_user" | ConvertTo-Json
Write-Host ""

Write-Host "2. Testing username availability (should be taken)..." -ForegroundColor Yellow
Invoke-RestMethod -Uri "$BASE_URL/profile/check-username/admin" | ConvertTo-Json
Write-Host ""

Write-Host "3. Logging in..." -ForegroundColor Yellow
$loginBody = @{
    email = "388054@seecs.edu.pk"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$BASE_URL/users/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $response.token
Write-Host "Token received: $($token.Substring(0,20))..." -ForegroundColor Green
Write-Host ""

Write-Host "4. Searching for users..." -ForegroundColor Yellow
$headers = @{
    Authorization = "Bearer $token"
}
Invoke-RestMethod -Uri "$BASE_URL/profile/search?q=ali" -Headers $headers | ConvertTo-Json
Write-Host ""

Write-Host "Tests complete!" -ForegroundColor Green
```

---

## Troubleshooting

### Error: "User validation failed: username: Path `username` is required"
**Solution:** Run the seed script to add usernames to users
```bash
node server/scripts/seedUsers.js
```

### Error: "E11000 duplicate key error"
**Solution:** Username already exists. Try a different username or clear the database.

### Error: "Cannot read property 'username' of null"
**Solution:** Make sure you're logged in and using a valid token.

### Error: 404 Not Found
**Solution:** Make sure the server is running on port 5000 and routes are correct.

### No search results
**Solution:** 
- Make sure you're authenticated (sending Bearer token)
- Check that users exist in database
- Try searching with different terms

---

## Success Criteria ✅

Your implementation is successful if:
- [ ] Check username availability works for both available and taken usernames
- [ ] Invalid usernames (too short, special chars) return proper error messages
- [ ] Login returns username in response
- [ ] Search finds users by username and name
- [ ] Username can be updated with proper validation
- [ ] Duplicate usernames are prevented
- [ ] All responses include username field where expected

---

## Next: Frontend Testing

Once backend tests pass, test in frontend:
1. Display username in profile components
2. Add username input to forms
3. Implement search with results display
4. Show real-time availability checking
5. Test username update in profile settings

Happy Testing! 🚀
