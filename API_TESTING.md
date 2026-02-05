# API Testing Guide - Postman with Render

## Base URL
**Production (Render):** `https://sprint1-backend-xxxx.onrender.com`

Replace `xxxx` with your actual Render app name. You can find this in your Render dashboard.

---

## Setup in Postman

### 1. Create New Collection
1. Open Postman
2. Click **Collections** in left sidebar
3. Click **+ Create new collection**
4. Name it: `Sprint 1 Backend API - Render`

### 2. Set Environment Variables
1. Click **Environments** (top right)
2. Click **+ Create Environment**
3. Name it: `Sprint 1 Production`
4. Add variable:
   - **Variable:** `base_url`
   - **Initial Value:** `https://sprint1-backend-xxxx.onrender.com` (replace with your URL)
   - **Current Value:** `https://sprint1-backend-xxxx.onrender.com`
5. Click **Save**
6. Select this environment from dropdown (top right)

---

## All API Tests for Postman

### 🏥 Health Check Endpoints

#### 1. Welcome Message
- **Method:** `GET`
- **URL:** `{{base_url}}/`
- **Description:** Check if API is running
- **Expected Status:** `200 OK`

**Expected Response:**
```json
{
  "message": "Welcome to Sprint 1 Backend API",
  "version": "1.0.0",
  "endpoints": {
    "tasks": "/api/tasks",
    "users": "/api/users",
    "categories": "/api/categories"
  }
}
```

#### 2. Health Check
- **Method:** `GET`
- **URL:** `{{base_url}}/health`
- **Description:** Verify server health
- **Expected Status:** `200 OK`

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-05T15:30:00.000Z",
  "uptime": 123.45,
  "database": "connected"
}
```

---

## 👤 USER ENDPOINTS

### 1. Get All Users
- **Method:** `GET`
- **URL:** `{{base_url}}/api/users`
- **Headers:** None
- **Body:** None
- **Expected Status:** `200 OK`

**Expected Response:**
```json
[
  {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "created_at": "2026-02-05T10:00:00.000Z"
  },
  {
    "id": 2,
    "username": "jane_smith",
    "email": "jane@example.com",
    "created_at": "2026-02-05T10:00:00.000Z"
  },
  {
    "id": 3,
    "username": "bob_wilson",
    "email": "bob@example.com",
    "created_at": "2026-02-05T10:00:00.000Z"
  }
]
```

---

### 2. Get Specific User by ID
- **Method:** `GET`
- **URL:** `{{base_url}}/api/users/1`
- **Headers:** None
- **Body:** None
- **Expected Status:** `200 OK`

**Expected Response:**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "created_at": "2026-02-05T10:00:00.000Z"
}
```

---

### 3. Get User with Their Tasks
- **Method:** `GET`
- **URL:** `{{base_url}}/api/users/1/tasks`
- **Headers:** None
- **Body:** None
- **Expected Status:** `200 OK`

**Expected Response:**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "created_at": "2026-02-05T10:00:00.000Z",
  "tasks": [
    {
      "id": 1,
      "title": "Complete project proposal",
      "description": "Write and submit the Q1 project proposal",
      "status": "in_progress",
      "priority": "high",
      "due_date": "2026-02-10",
      "category_name": "Work"
    }
  ]
}
```

---

### 4. Create New User
- **Method:** `POST`
- **URL:** `{{base_url}}/api/users`
- **Headers:** 
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "username": "postman_user",
  "email": "postman@test.com"
}
```
- **Expected Status:** `201 Created`

**Expected Response:**
```json
{
  "id": 4,
  "username": "postman_user",
  "email": "postman@test.com",
  "created_at": "2026-02-05T15:45:00.000Z"
}
```

---

### 5. Update User
- **Method:** `PUT`
- **URL:** `{{base_url}}/api/users/4`
- **Headers:** 
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "username": "updated_postman_user",
  "email": "updated_postman@test.com"
}
```
- **Expected Status:** `200 OK`

**Expected Response:**
```json
{
  "id": 4,
  "username": "updated_postman_user",
  "email": "updated_postman@test.com",
  "created_at": "2026-02-05T15:45:00.000Z"
}
```

---

### 6. Delete User
- **Method:** `DELETE`
- **URL:** `{{base_url}}/api/users/4`
- **Headers:** None
- **Body:** None
- **Expected Status:** `200 OK`

**Expected Response:**
```json
{
  "message": "User deleted successfully"
}
```

---

## 📋 TASK ENDPOINTS

### 1. Get All Tasks
- **Method:** `GET`
- **URL:** `{{base_url}}/api/tasks`
- **Headers:** None
- **Body:** None
- **Expected Status:** `200 OK`

**Expected Response:**
```json
[
  {
    "id": 1,
    "title": "Complete project proposal",
    "description": "Write and submit the Q1 project proposal",
    "status": "in_progress",
    "priority": "high",
    "user_id": 1,
    "category_id": 1,
    "due_date": "2026-02-10",
    "created_at": "2026-02-05T10:00:00.000Z",
    "updated_at": "2026-02-05T10:00:00.000Z",
    "username": "john_doe",
    "category_name": "Work"
  }
]
```

---

### 2. Get Task Statistics
- **Method:** `GET`
- **URL:** `{{base_url}}/api/tasks/stats`
- **Headers:** None
- **Body:** None
- **Expected Status:** `200 OK`

**Expected Response:**
```json
{
  "total": 10,
  "by_status": {
    "pending": 5,
    "in_progress": 2,
    "completed": 3
  },
  "by_priority": {
    "low": 1,
    "medium": 5,
    "high": 4
  }
}
```

---

### 3. Get Specific Task by ID
- **Method:** `GET`
- **URL:** `{{base_url}}/api/tasks/1`
- **Headers:** None
- **Body:** None
- **Expected Status:** `200 OK`

**Expected Response:**
```json
{
  "id": 1,
  "title": "Complete project proposal",
  "description": "Write and submit the Q1 project proposal",
  "status": "in_progress",
  "priority": "high",
  "user_id": 1,
  "category_id": 1,
  "due_date": "2026-02-10",
  "created_at": "2026-02-05T10:00:00.000Z",
  "updated_at": "2026-02-05T10:00:00.000Z",
  "username": "john_doe",
  "user_email": "john@example.com",
  "category_name": "Work",
  "category_description": "Work-related tasks"
}
```

---

### 4. Create New Task
- **Method:** `POST`
- **URL:** `{{base_url}}/api/tasks`
- **Headers:** 
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "title": "API Testing Task",
  "description": "Testing task creation from Postman",
  "status": "pending",
  "priority": "high",
  "user_id": 1,
  "category_id": 1,
  "due_date": "2026-02-20"
}
```
- **Expected Status:** `201 Created`

**Expected Response:**
```json
{
  "id": 11,
  "title": "API Testing Task",
  "description": "Testing task creation from Postman",
  "status": "pending",
  "priority": "high",
  "user_id": 1,
  "category_id": 1,
  "due_date": "2026-02-20",
  "created_at": "2026-02-05T16:00:00.000Z",
  "updated_at": "2026-02-05T16:00:00.000Z"
}
```

---

### 5. Update Task
- **Method:** `PUT`
- **URL:** `{{base_url}}/api/tasks/11`
- **Headers:** 
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "title": "Updated API Testing Task",
  "status": "in_progress",
  "priority": "medium"
}
```
- **Expected Status:** `200 OK`

**Expected Response:**
```json
{
  "id": 11,
  "title": "Updated API Testing Task",
  "description": "Testing task creation from Postman",
  "status": "in_progress",
  "priority": "medium",
  "user_id": 1,
  "category_id": 1,
  "due_date": "2026-02-20",
  "created_at": "2026-02-05T16:00:00.000Z",
  "updated_at": "2026-02-05T16:05:00.000Z"
}
```

---

### 6. Delete Task
- **Method:** `DELETE`
- **URL:** `{{base_url}}/api/tasks/11`
- **Headers:** None
- **Body:** None
- **Expected Status:** `200 OK`

**Expected Response:**
```json
{
  "message": "Task deleted successfully"
}
```

---

## 📁 CATEGORY ENDPOINTS

### 1. Get All Categories
- **Method:** `GET`
- **URL:** `{{base_url}}/api/categories`
- **Headers:** None
- **Body:** None
- **Expected Status:** `200 OK`

**Expected Response:**
```json
[
  {
    "id": 1,
    "name": "Work",
    "description": "Work-related tasks",
    "created_at": "2026-02-05T10:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Personal",
    "description": "Personal tasks and errands",
    "created_at": "2026-02-05T10:00:00.000Z"
  },
  {
    "id": 3,
    "name": "Study",
    "description": "Educational and learning tasks",
    "created_at": "2026-02-05T10:00:00.000Z"
  },
  {
    "id": 4,
    "name": "Health",
    "description": "Health and fitness related tasks",
    "created_at": "2026-02-05T10:00:00.000Z"
  },
  {
    "id": 5,
    "name": "Shopping",
    "description": "Shopping and purchasing tasks",
    "created_at": "2026-02-05T10:00:00.000Z"
  }
]
```

---

### 2. Get Categories with Task Counts
- **Method:** `GET`
- **URL:** `{{base_url}}/api/categories/counts`
- **Headers:** None
- **Body:** None
- **Expected Status:** `200 OK`

**Expected Response:**
```json
[
  {
    "id": 1,
    "name": "Work",
    "description": "Work-related tasks",
    "created_at": "2026-02-05T10:00:00.000Z",
    "task_count": "4"
  },
  {
    "id": 2,
    "name": "Personal",
    "description": "Personal tasks and errands",
    "created_at": "2026-02-05T10:00:00.000Z",
    "task_count": "1"
  }
]
```

---

### 3. Get Specific Category by ID
- **Method:** `GET`
- **URL:** `{{base_url}}/api/categories/1`
- **Headers:** None
- **Body:** None
- **Expected Status:** `200 OK`

**Expected Response:**
```json
{
  "id": 1,
  "name": "Work",
  "description": "Work-related tasks",
  "created_at": "2026-02-05T10:00:00.000Z"
}
```

---

### 4. Create New Category
- **Method:** `POST`
- **URL:** `{{base_url}}/api/categories`
- **Headers:** 
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "name": "Testing",
  "description": "Quality assurance and testing tasks"
}
```
- **Expected Status:** `201 Created`

**Expected Response:**
```json
{
  "id": 6,
  "name": "Testing",
  "description": "Quality assurance and testing tasks",
  "created_at": "2026-02-05T16:15:00.000Z"
}
```

---

### 5. Update Category
- **Method:** `PUT`
- **URL:** `{{base_url}}/api/categories/6`
- **Headers:** 
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "name": "QA Testing",
  "description": "Updated: Quality assurance and testing tasks"
}
```
- **Expected Status:** `200 OK`

**Expected Response:**
```json
{
  "id": 6,
  "name": "QA Testing",
  "description": "Updated: Quality assurance and testing tasks",
  "created_at": "2026-02-05T16:15:00.000Z"
}
```

---

### 6. Delete Category
- **Method:** `DELETE`
- **URL:** `{{base_url}}/api/categories/6`
- **Headers:** None
- **Body:** None
- **Expected Status:** `200 OK`

**Expected Response:**
```json
{
  "message": "Category deleted successfully"
}
```

---

## 🧪 Testing Scenarios

### Scenario 1: Complete Task Workflow

**Step 1:** Create a new user
```
POST {{base_url}}/api/users
Body: {"username": "workflow_test", "email": "workflow@test.com"}
```

**Step 2:** Get all categories (to find a category_id)
```
GET {{base_url}}/api/categories
```

**Step 3:** Create a task for the new user
```
POST {{base_url}}/api/tasks
Body: {
  "title": "Workflow Test Task",
  "description": "Testing complete workflow",
  "status": "pending",
  "priority": "high",
  "user_id": 4,
  "category_id": 1,
  "due_date": "2026-02-25"
}
```

**Step 4:** Get user with their tasks
```
GET {{base_url}}/api/users/4/tasks
```

**Step 5:** Update task status to completed
```
PUT {{base_url}}/api/tasks/11
Body: {"status": "completed"}
```

**Step 6:** Get task statistics
```
GET {{base_url}}/api/tasks/stats
```

---

### Scenario 2: Error Testing

**Test 1:** Get non-existent user
```
GET {{base_url}}/api/users/99999
Expected: 404 Not Found
```

**Test 2:** Create user with missing email
```
POST {{base_url}}/api/users
Body: {"username": "incomplete_user"}
Expected: 400 Bad Request
```

**Test 3:** Create task with invalid user_id
```
POST {{base_url}}/api/tasks
Body: {
  "title": "Invalid Task",
  "status": "pending",
  "priority": "high",
  "user_id": 99999,
  "category_id": 1
}
Expected: 400/500 error
```

**Test 4:** Delete non-existent category
```
DELETE {{base_url}}/api/categories/99999
Expected: 404 Not Found
```

---

## 📊 Postman Test Scripts

Add these scripts in the **Tests** tab of your requests:

### For GET All Requests:
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response is an array", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an('array');
});

pm.test("Response time is acceptable", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});
```

### For POST (Create) Requests:
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Response has ID", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
});

// Save ID for later use
pm.test("Save created ID", function () {
    var jsonData = pm.response.json();
    pm.environment.set("created_id", jsonData.id);
});
```

### For PUT (Update) Requests:
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has updated data", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
});
```

### For DELETE Requests:
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Success message received", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('message');
});
```

---

## ✅ Testing Checklist

Before testing:
- [ ] Server is deployed on Render
- [ ] Database is initialized with sample data
- [ ] Environment variable is set in Postman
- [ ] Base URL is correct

Test all endpoints:
- [ ] Health check works
- [ ] Get all users (3 users)
- [ ] Get all tasks (10 tasks)
- [ ] Get all categories (5 categories)
- [ ] Create new user
- [ ] Create new task
- [ ] Create new category
- [ ] Update user
- [ ] Update task
- [ ] Update category
- [ ] Delete user
- [ ] Delete task
- [ ] Delete category
- [ ] Get task statistics
- [ ] Get user with tasks
- [ ] Get categories with counts

Error testing:
- [ ] Test 404 errors (non-existent IDs)
- [ ] Test 400 errors (missing required fields)
- [ ] Test validation errors

---

## 🚀 Quick Testing Tips

1. **Start with Health Check** - Always verify server is running first
2. **Test GET before POST** - Understand existing data before creating new
3. **Save IDs** - Use Postman variables to save created IDs
4. **Test in Order** - Create → Read → Update → Delete
5. **Check Response Times** - Render free tier may have slow cold starts
6. **Document Errors** - Note any unexpected behaviors
7. **Use Collections** - Organize tests by resource type

---

## 📝 Notes

- **Render Cold Starts:** First request may take 30-60 seconds if service was asleep
- **Free Tier Limits:** Render free tier has limited resources
- **Database Persistence:** Data persists between requests on Render
- **CORS:** Already configured for web requests
- **Status Codes:** 
  - `200` = Success (GET, PUT, DELETE)
  - `201` = Created (POST)
  - `400` = Bad Request
  - `404` = Not Found
  - `500` = Server Error

---

## Need Help?

If endpoints don't work:
1. Check Render dashboard for service status
2. View application logs in Render
3. Verify database connection
4. Ensure environment variables are set
5. Try re-deploying the service

---

**Happy Testing! 🎉**
