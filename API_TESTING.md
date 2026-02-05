# API Testing Guide

## Introduction to API Testing

API testing is the process of verifying that your API endpoints work correctly, return expected data, handle errors properly, and meet performance requirements. This guide covers testing the Sprint 1 Backend API.

## Why Test Your API?

- **Reliability**: Ensure endpoints work as expected
- **Catch Bugs Early**: Find issues before users do
- **Documentation**: Tests serve as living documentation
- **Confidence**: Make changes without breaking existing functionality
- **Quality Assurance**: Verify data validation and error handling

## Testing Tools Overview

### 1. cURL (Command Line)
- Built into most operating systems
- Great for quick tests and automation
- No installation needed

### 2. Postman
- Popular GUI-based API testing tool
- Supports collections and environment variables
- Great for team collaboration

### 3. Thunder Client (VS Code Extension)
- Lightweight alternative to Postman
- Integrated into VS Code
- Simple and fast

### 4. REST Client (VS Code Extension)
- Test APIs directly from `.http` files
- Version control friendly
- Simple syntax

### 5. Automated Testing (Jest/Supertest)
- Write programmatic tests
- Run in CI/CD pipelines
- Best for continuous testing

## Testing with cURL

### Basic cURL Syntax

```bash
curl [options] [URL]
```

### Common Options:
- `-X` : Specify HTTP method (GET, POST, PUT, DELETE)
- `-H` : Add headers
- `-d` : Send data in request body
- `-i` : Include response headers
- `-v` : Verbose output (detailed)

### Testing All Endpoints

#### Health Check & Welcome
```bash
# Welcome message
curl http://localhost:3000/

# Health check
curl http://localhost:3000/health
```

---

### Users Endpoints

#### 1. Get All Users
```bash
curl http://localhost:3000/api/users
```

**Expected Response (200 OK):**
```json
[
  {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "created_at": "2026-02-05T12:00:00.000Z"
  }
]
```

#### 2. Get Specific User
```bash
curl http://localhost:3000/api/users/1
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "created_at": "2026-02-05T12:00:00.000Z"
}
```

#### 3. Get User with Tasks
```bash
curl http://localhost:3000/api/users/1/tasks
```

#### 4. Create New User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "email": "test@example.com"
  }'
```

**Expected Response (201 Created):**
```json
{
  "id": 4,
  "username": "test_user",
  "email": "test@example.com",
  "created_at": "2026-02-05T14:30:00.000Z"
}
```

#### 5. Update User
```bash
curl -X PUT http://localhost:3000/api/users/4 \
  -H "Content-Type: application/json" \
  -d '{
    "username": "updated_user",
    "email": "updated@example.com"
  }'
```

#### 6. Delete User
```bash
curl -X DELETE http://localhost:3000/api/users/4
```

**Expected Response (200 OK):**
```json
{
  "message": "User deleted successfully"
}
```

---

### Categories Endpoints

#### 1. Get All Categories
```bash
curl http://localhost:3000/api/categories
```

#### 2. Get Category with Task Counts
```bash
curl http://localhost:3000/api/categories/counts
```

#### 3. Get Specific Category
```bash
curl http://localhost:3000/api/categories/1
```

#### 4. Create New Category
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Testing",
    "description": "Quality assurance and testing tasks"
  }'
```

#### 5. Update Category
```bash
curl -X PUT http://localhost:3000/api/categories/4 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "QA Testing",
    "description": "Updated description"
  }'
```

#### 6. Delete Category
```bash
curl -X DELETE http://localhost:3000/api/categories/4
```

---

### Tasks Endpoints

#### 1. Get All Tasks
```bash
curl http://localhost:3000/api/tasks
```

#### 2. Get Task Statistics
```bash
curl http://localhost:3000/api/tasks/stats
```

**Expected Response:**
```json
{
  "total": 10,
  "by_status": {
    "pending": 4,
    "in_progress": 3,
    "completed": 3
  },
  "by_priority": {
    "high": 3,
    "medium": 4,
    "low": 3
  }
}
```

#### 3. Get Specific Task
```bash
curl http://localhost:3000/api/tasks/1
```

#### 4. Create New Task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Write API Tests",
    "description": "Create comprehensive API testing guide",
    "status": "in_progress",
    "priority": "high",
    "user_id": 1,
    "category_id": 2,
    "due_date": "2026-02-10"
  }'
```

**Expected Response (201 Created):**
```json
{
  "id": 11,
  "title": "Write API Tests",
  "description": "Create comprehensive API testing guide",
  "status": "in_progress",
  "priority": "high",
  "user_id": 1,
  "category_id": 2,
  "due_date": "2026-02-10",
  "created_at": "2026-02-05T14:45:00.000Z",
  "updated_at": "2026-02-05T14:45:00.000Z"
}
```

#### 5. Update Task
```bash
curl -X PUT http://localhost:3000/api/tasks/11 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete API Tests",
    "status": "completed",
    "priority": "high"
  }'
```

#### 6. Delete Task
```bash
curl -X DELETE http://localhost:3000/api/tasks/11
```

---

## Testing with Postman

### Setup

1. Download and install [Postman](https://www.postman.com/downloads/)
2. Create a new Collection: "Sprint 1 Backend API"
3. Set up environment variables

### Environment Variables

Create a new environment with:
- `base_url`: `http://localhost:3000`
- `api_url`: `{{base_url}}/api`

For production:
- `base_url`: `https://your-app.onrender.com`

### Creating Requests

#### Example: Get All Tasks

1. **Method**: GET
2. **URL**: `{{api_url}}/tasks`
3. **Headers**: None needed
4. Click **Send**

#### Example: Create New Task

1. **Method**: POST
2. **URL**: `{{api_url}}/tasks`
3. **Headers**: 
   - Key: `Content-Type`
   - Value: `application/json`
4. **Body** (raw JSON):
```json
{
  "title": "New Task from Postman",
  "description": "Testing POST endpoint",
  "status": "pending",
  "priority": "medium",
  "user_id": 1,
  "category_id": 1,
  "due_date": "2026-02-15"
}
```
5. Click **Send**

### Postman Tests (Scripts)

Add test scripts in the "Tests" tab:

```javascript
// Test status code
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Test response time
pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

// Test response structure
pm.test("Response has correct structure", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an('array');
    pm.expect(jsonData[0]).to.have.property('id');
    pm.expect(jsonData[0]).to.have.property('title');
});

// Save data for next request
pm.test("Save task ID", function () {
    var jsonData = pm.response.json();
    pm.environment.set("task_id", jsonData.id);
});
```

---

## Testing with Thunder Client (VS Code)

### Setup

1. Install Thunder Client extension in VS Code
2. Click Thunder Client icon in sidebar
3. Create new request

### Creating a Collection

1. Click "Collections"
2. Click "New Collection"
3. Name it "Sprint 1 API"
4. Add requests to collection

### Environment Setup

1. Click "Env" tab
2. Create new environment
3. Add variables:
```json
{
  "base_url": "http://localhost:3000",
  "api_url": "{{base_url}}/api"
}
```

### Example Request

**Get All Users:**
- Method: `GET`
- URL: `{{api_url}}/users`
- Click "Send"

---

## Testing with REST Client (.http files)

### Setup

1. Install "REST Client" extension in VS Code
2. Create `api-tests.http` file in your project

### Example .http File

```http
### Variables
@base_url = http://localhost:3000
@api_url = {{base_url}}/api

### Health Check
GET {{base_url}}/health

### Get All Users
GET {{api_url}}/users

### Get Specific User
GET {{api_url}}/users/1

### Create New User
POST {{api_url}}/users
Content-Type: application/json

{
  "username": "rest_client_user",
  "email": "rest@example.com"
}

### Get All Tasks
GET {{api_url}}/tasks

### Create New Task
POST {{api_url}}/tasks
Content-Type: application/json

{
  "title": "Task from REST Client",
  "description": "Testing with .http file",
  "status": "pending",
  "priority": "low",
  "user_id": 1,
  "category_id": 1,
  "due_date": "2026-02-20"
}

### Update Task
PUT {{api_url}}/tasks/1
Content-Type: application/json

{
  "status": "completed"
}

### Delete Task
DELETE {{api_url}}/tasks/10

### Get All Categories
GET {{api_url}}/categories

### Create Category
POST {{api_url}}/categories
Content-Type: application/json

{
  "name": "Research",
  "description": "Research and analysis tasks"
}
```

**Usage**: Click "Send Request" link above each request

---

## Automated Testing with Jest & Supertest

### Setup

```bash
npm install --save-dev jest supertest
```

### Update package.json

```json
{
  "scripts": {
    "test": "jest --watchAll"
  },
  "jest": {
    "testEnvironment": "node"
  }
}
```

### Create Test File: `__tests__/api.test.js`

```javascript
const request = require('supertest');
const app = require('../server');

describe('API Endpoints', () => {
  
  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'healthy');
    });
  });

  describe('Users API', () => {
    it('should get all users', async () => {
      const res = await request(app).get('/api/users');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should create a new user', async () => {
      const newUser = {
        username: 'test_jest_user',
        email: 'jest@test.com'
      };
      const res = await request(app)
        .post('/api/users')
        .send(newUser);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('username', newUser.username);
      expect(res.body).toHaveProperty('email', newUser.email);
    });

    it('should get a specific user', async () => {
      const res = await request(app).get('/api/users/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', 1);
    });
  });

  describe('Tasks API', () => {
    it('should get all tasks', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should get task statistics', async () => {
      const res = await request(app).get('/api/tasks/stats');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('total');
      expect(res.body).toHaveProperty('by_status');
      expect(res.body).toHaveProperty('by_priority');
    });

    it('should create a new task', async () => {
      const newTask = {
        title: 'Jest Test Task',
        description: 'Created by automated test',
        status: 'pending',
        priority: 'low',
        user_id: 1,
        category_id: 1,
        due_date: '2026-03-01'
      };
      const res = await request(app)
        .post('/api/tasks')
        .send(newTask);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('title', newTask.title);
    });
  });

  describe('Categories API', () => {
    it('should get all categories', async () => {
      const res = await request(app).get('/api/categories');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
```

### Run Tests

```bash
npm test
```

---

## Testing Checklist

### Before Testing
- [ ] Server is running (`npm start`)
- [ ] Database is initialized (`npm run init-db`)
- [ ] Environment variables are set
- [ ] You know the base URL (local or production)

### What to Test

#### ✅ Happy Paths (Success Cases)
- [ ] GET all resources returns 200 and array
- [ ] GET specific resource returns 200 and object
- [ ] POST creates resource and returns 201
- [ ] PUT updates resource and returns 200
- [ ] DELETE removes resource and returns 200

#### ✅ Error Cases
- [ ] GET non-existent resource returns 404
- [ ] POST with missing fields returns 400
- [ ] POST with invalid data returns 400
- [ ] PUT non-existent resource returns 404
- [ ] DELETE non-existent resource returns 404

#### ✅ Validation
- [ ] Email format is validated
- [ ] Username is unique
- [ ] Required fields are enforced
- [ ] Date formats are correct
- [ ] Foreign keys are validated

#### ✅ Relationships
- [ ] Tasks include user and category info
- [ ] Users can have multiple tasks
- [ ] Categories can have multiple tasks
- [ ] Deleting user doesn't break tasks (or cascades)

#### ✅ Special Endpoints
- [ ] Health check returns status
- [ ] Statistics endpoint returns correct counts
- [ ] Task filtering works correctly

---

## Common Testing Scenarios

### Scenario 1: Test Complete CRUD Flow

```bash
# 1. Create
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username": "crud_test", "email": "crud@test.com"}'
# Note the returned ID (e.g., 5)

# 2. Read
curl http://localhost:3000/api/users/5

# 3. Update
curl -X PUT http://localhost:3000/api/users/5 \
  -H "Content-Type: application/json" \
  -d '{"username": "updated_crud", "email": "updated@test.com"}'

# 4. Delete
curl -X DELETE http://localhost:3000/api/users/5

# 5. Verify deletion
curl http://localhost:3000/api/users/5
# Should return 404
```

### Scenario 2: Test Error Handling

```bash
# Missing required field
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username": "test"}'
# Should return 400 Bad Request

# Invalid ID
curl http://localhost:3000/api/users/99999
# Should return 404 Not Found

# Duplicate username
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username": "john_doe", "email": "new@email.com"}'
# Should return 400 or 409 Conflict
```

### Scenario 3: Test Relationships

```bash
# Create task with user and category
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Relationship Test",
    "description": "Testing foreign keys",
    "status": "pending",
    "priority": "medium",
    "user_id": 1,
    "category_id": 1,
    "due_date": "2026-02-15"
  }'

# Get user with their tasks
curl http://localhost:3000/api/users/1/tasks

# Get categories with task counts
curl http://localhost:3000/api/categories/counts
```

---

## Testing Production (Render)

Replace `localhost:3000` with your Render URL:

```bash
# Set your Render URL
RENDER_URL="https://sprint1-backend-xxxx.onrender.com"

# Test health
curl $RENDER_URL/health

# Test endpoints
curl $RENDER_URL/api/tasks
curl $RENDER_URL/api/users
curl $RENDER_URL/api/categories
```

---

## Tips for Effective API Testing

### 1. Test Systematically
- Start with health check
- Test GET endpoints first
- Then test POST, PUT, DELETE
- Test error cases last

### 2. Use Proper Tools
- cURL for quick tests
- Postman for collections
- Automated tests for CI/CD

### 3. Document Your Tests
- Keep .http files in version control
- Share Postman collections with team
- Write test documentation

### 4. Test Early and Often
- Test after each feature
- Test before commits
- Test before deployment

### 5. Verify Both Success and Failure
- Don't just test happy paths
- Verify error messages
- Check status codes

---

## Troubleshooting

### Connection Refused
**Problem**: `curl: (7) Failed to connect to localhost port 3000`
**Solution**: Make sure server is running with `npm start`

### 404 Not Found
**Problem**: All endpoints return 404
**Solution**: Check if routes are properly registered in `server.js`

### 500 Internal Server Error
**Problem**: Endpoints return 500
**Solution**: Check server logs and database connection

### Empty Response
**Problem**: Endpoints return empty arrays
**Solution**: Check if database is initialized with `npm run init-db`

### CORS Errors (Browser)
**Problem**: Browser shows CORS error
**Solution**: Ensure CORS middleware is configured in server

---

## Summary

**Key Takeaways**:
1. Test all CRUD operations
2. Verify both success and error cases
3. Use appropriate tools for the job
4. Automate tests when possible
5. Document your testing process
6. Test before every deployment

**Remember**: Good testing prevents bugs and builds confidence in your API!

---

## Additional Resources

- [HTTP Status Codes](https://httpstatuses.com/)
- [REST API Best Practices](https://restfulapi.net/)
- [Postman Learning Center](https://learning.postman.com/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
