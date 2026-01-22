# 📡 EduSphere API Reference Guide

## Base URL
```
http://localhost:5000/api/v1
```

---

## 🔐 Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

---

## 📋 API Endpoints Reference

### **Authentication Endpoints**

#### 1. Register New User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "student",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "student",
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2026-01-21T19:47:04.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### 2. Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123!",
  "role": "student"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "student",
      "firstName": "John",
      "lastName": "Doe"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### 3. Refresh Access Token
```http
POST /auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### 4. Logout
```http
POST /auth/logout
Authorization: Bearer <token>

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### 5. Forgot Password
```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### 6. Reset Password
```http
POST /auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePass123!"
}
```

---

### **Student Endpoints**

#### 1. Get All Students
```http
GET /students?page=1&limit=20&search=john&classId=uuid
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `search` (optional): Search by name or student ID
- `classId` (optional): Filter by class
- `status` (optional): active | inactive

**Response (200):**
```json
{
  "success": true,
  "data": {
    "students": [
      {
        "id": "uuid",
        "studentId": "STU001",
        "user": {
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com",
          "phone": "+1234567890",
          "avatarUrl": "https://..."
        },
        "class": {
          "name": "Grade 10A",
          "section": "A"
        },
        "rollNumber": "10",
        "admissionDate": "2025-09-01"
      }
    ],
    "pagination": {
      "total": 1248,
      "page": 1,
      "limit": 20,
      "totalPages": 63
    }
  }
}
```

#### 2. Get Single Student
```http
GET /students/:id
Authorization: Bearer <token>
```

#### 3. Create Student
```http
POST /students
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "student123",
  "email": "student@example.com",
  "password": "Pass123!",
  "firstName": "Jane",
  "lastName": "Smith",
  "studentId": "STU002",
  "classId": "uuid",
  "section": "A",
  "rollNumber": "15",
  "admissionDate": "2026-01-21",
  "dateOfBirth": "2010-05-15",
  "gender": "female",
  "bloodGroup": "O+",
  "parentId": "uuid",
  "address": "123 Main St",
  "phone": "+1234567890"
}
```

#### 4. Update Student
```http
PUT /students/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "classId": "new-class-uuid",
  "section": "B",
  "rollNumber": "20"
}
```

#### 5. Delete Student
```http
DELETE /students/:id
Authorization: Bearer <token>
```

#### 6. Get Student Attendance
```http
GET /students/:id/attendance?startDate=2026-01-01&endDate=2026-01-31
Authorization: Bearer <token>
```

#### 7. Get Student Grades
```http
GET /students/:id/grades?semester=1&year=2026
Authorization: Bearer <token>
```

#### 8. Get Student Fees
```http
GET /students/:id/fees?status=pending
Authorization: Bearer <token>
```

---

### **Teacher Endpoints**

#### 1. Get All Teachers
```http
GET /teachers?page=1&limit=20&department=Mathematics
Authorization: Bearer <token>
```

#### 2. Get Single Teacher
```http
GET /teachers/:id
Authorization: Bearer <token>
```

#### 3. Create Teacher
```http
POST /teachers
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "teacher123",
  "email": "teacher@example.com",
  "password": "Pass123!",
  "firstName": "Robert",
  "lastName": "Johnson",
  "employeeId": "EMP001",
  "department": "Mathematics",
  "designation": "Senior Teacher",
  "qualification": "M.Sc. Mathematics",
  "specialization": "Algebra",
  "joiningDate": "2020-08-15",
  "salary": 50000,
  "experienceYears": 10,
  "phone": "+1234567890"
}
```

#### 4. Update Teacher
```http
PUT /teachers/:id
Authorization: Bearer <token>
```

#### 5. Delete Teacher
```http
DELETE /teachers/:id
Authorization: Bearer <token>
```

#### 6. Get Teacher's Classes
```http
GET /teachers/:id/classes
Authorization: Bearer <token>
```

#### 7. Get Teacher's Schedule
```http
GET /teachers/:id/schedule?date=2026-01-21
Authorization: Bearer <token>
```

---

### **Class Endpoints**

#### 1. Get All Classes
```http
GET /classes?academicYear=2025-2026&isActive=true
Authorization: Bearer <token>
```

#### 2. Get Single Class
```http
GET /classes/:id
Authorization: Bearer <token>
```

#### 3. Create Class
```http
POST /classes
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Grade 10",
  "gradeLevel": 10,
  "section": "A",
  "classTeacherId": "uuid",
  "roomNumber": "101",
  "capacity": 40,
  "academicYear": "2025-2026"
}
```

#### 4. Update Class
```http
PUT /classes/:id
Authorization: Bearer <token>
```

#### 5. Delete Class
```http
DELETE /classes/:id
Authorization: Bearer <token>
```

#### 6. Get Class Students
```http
GET /classes/:id/students
Authorization: Bearer <token>
```

#### 7. Get Class Subjects
```http
GET /classes/:id/subjects
Authorization: Bearer <token>
```

#### 8. Get Class Timetable
```http
GET /classes/:id/timetable?day=1
Authorization: Bearer <token>
```

---

### **Attendance Endpoints**

#### 1. Get Attendance Records
```http
GET /attendance?studentId=uuid&date=2026-01-21
Authorization: Bearer <token>
```

**Query Parameters:**
- `studentId` (optional): Filter by student
- `classId` (optional): Filter by class
- `date` (optional): Specific date
- `startDate` (optional): Date range start
- `endDate` (optional): Date range end
- `status` (optional): present | absent | late | excused

#### 2. Mark Attendance
```http
POST /attendance/mark
Authorization: Bearer <token>
Content-Type: application/json

{
  "classId": "uuid",
  "date": "2026-01-21",
  "attendance": [
    {
      "studentId": "uuid-1",
      "status": "present"
    },
    {
      "studentId": "uuid-2",
      "status": "absent",
      "remarks": "Sick leave"
    },
    {
      "studentId": "uuid-3",
      "status": "late",
      "remarks": "Arrived at 9:15 AM"
    }
  ]
}
```

#### 3. Get Attendance Statistics
```http
GET /attendance/statistics?classId=uuid&startDate=2026-01-01&endDate=2026-01-31
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalDays": 20,
    "presentDays": 18,
    "absentDays": 2,
    "lateDays": 1,
    "attendanceRate": 90,
    "breakdown": {
      "present": 18,
      "absent": 2,
      "late": 1,
      "excused": 0
    }
  }
}
```

---

### **Exam Endpoints**

#### 1. Get All Exams
```http
GET /exams?classId=uuid&subjectId=uuid&examType=midterm
Authorization: Bearer <token>
```

#### 2. Get Single Exam
```http
GET /exams/:id
Authorization: Bearer <token>
```

#### 3. Create Exam
```http
POST /exams
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Mathematics Midterm 2026",
  "examType": "midterm",
  "classId": "uuid",
  "subjectId": "uuid",
  "examDate": "2026-02-15",
  "startTime": "09:00:00",
  "durationMinutes": 120,
  "totalMarks": 100,
  "passingMarks": 40,
  "instructions": "No calculators allowed. Bring your own stationery."
}
```

#### 4. Update Exam
```http
PUT /exams/:id
Authorization: Bearer <token>
```

#### 5. Delete Exam
```http
DELETE /exams/:id
Authorization: Bearer <token>
```

#### 6. Submit Exam Results
```http
POST /exams/:id/results
Authorization: Bearer <token>
Content-Type: application/json

{
  "results": [
    {
      "studentId": "uuid-1",
      "marksObtained": 85,
      "grade": "A",
      "remarks": "Excellent performance"
    },
    {
      "studentId": "uuid-2",
      "marksObtained": 72,
      "grade": "B",
      "remarks": "Good work"
    }
  ]
}
```

#### 7. Get Exam Results
```http
GET /exams/:id/results
Authorization: Bearer <token>
```

#### 8. Get Exam Analytics
```http
GET /exams/:id/analytics
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalStudents": 40,
    "submitted": 38,
    "pending": 2,
    "averageMarks": 76.5,
    "highestMarks": 98,
    "lowestMarks": 42,
    "passPercentage": 92.5,
    "gradeDistribution": {
      "A": 12,
      "B": 15,
      "C": 8,
      "D": 2,
      "F": 1
    }
  }
}
```

---

### **Fee Endpoints**

#### 1. Get All Fees
```http
GET /fees?studentId=uuid&status=pending&feeType=tuition
Authorization: Bearer <token>
```

#### 2. Get Single Fee
```http
GET /fees/:id
Authorization: Bearer <token>
```

#### 3. Create Fee
```http
POST /fees
Authorization: Bearer <token>
Content-Type: application/json

{
  "studentId": "uuid",
  "feeType": "tuition",
  "amount": 5000,
  "dueDate": "2026-02-01",
  "remarks": "Semester 1 tuition fee"
}
```

#### 4. Update Fee
```http
PUT /fees/:id
Authorization: Bearer <token>
```

#### 5. Process Payment
```http
POST /fees/:id/payment
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 5000,
  "paymentMethod": "credit_card",
  "transactionId": "TXN123456789",
  "paymentDate": "2026-01-21"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "feeId": "uuid",
    "receiptNumber": "RCP-2026-001",
    "amount": 5000,
    "paymentDate": "2026-01-21",
    "status": "paid"
  }
}
```

#### 6. Get Student Fees
```http
GET /fees/student/:studentId?status=pending
Authorization: Bearer <token>
```

#### 7. Get Overdue Fees
```http
GET /fees/overdue
Authorization: Bearer <token>
```

#### 8. Get Fee Statistics
```http
GET /fees/statistics?startDate=2026-01-01&endDate=2026-01-31
Authorization: Bearer <token>
```

---

### **Message Endpoints**

#### 1. Get Messages
```http
GET /messages?page=1&limit=20&isRead=false
Authorization: Bearer <token>
```

#### 2. Get Single Message
```http
GET /messages/:id
Authorization: Bearer <token>
```

#### 3. Send Message
```http
POST /messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "recipientId": "uuid",
  "subject": "Meeting Request",
  "body": "I would like to schedule a meeting to discuss..."
}
```

#### 4. Mark as Read
```http
PUT /messages/:id/read
Authorization: Bearer <token>
```

#### 5. Delete Message
```http
DELETE /messages/:id
Authorization: Bearer <token>
```

#### 6. Get Unread Count
```http
GET /messages/unread-count
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "unreadCount": 5
  }
}
```

---

### **Notification Endpoints**

#### 1. Get Notifications
```http
GET /notifications?page=1&limit=20&isRead=false
Authorization: Bearer <token>
```

#### 2. Mark Notification as Read
```http
PUT /notifications/:id/read
Authorization: Bearer <token>
```

#### 3. Mark All as Read
```http
PUT /notifications/mark-all-read
Authorization: Bearer <token>
```

#### 4. Delete Notification
```http
DELETE /notifications/:id
Authorization: Bearer <token>
```

---

### **Dashboard Endpoints**

#### 1. Get Dashboard Statistics
```http
GET /dashboard/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalStudents": 1248,
    "totalTeachers": 86,
    "totalClasses": 24,
    "attendanceRate": 92,
    "pendingRequests": 24,
    "recentActivity": [
      {
        "id": "uuid",
        "action": "Student registered",
        "user": "John Admin",
        "role": "admin",
        "timestamp": "2026-01-21T19:00:00.000Z"
      }
    ],
    "upcomingExams": [
      {
        "id": "uuid",
        "name": "Mathematics Midterm",
        "date": "2026-02-15",
        "class": "Grade 10A"
      }
    ],
    "feeCollection": {
      "total": 500000,
      "collected": 425000,
      "pending": 75000,
      "collectionRate": 85
    }
  }
}
```

#### 2. Get Analytics
```http
GET /dashboard/analytics?period=month&year=2026
Authorization: Bearer <token>
```

#### 3. Get Performance Metrics
```http
GET /dashboard/performance?classId=uuid&semester=1
Authorization: Bearer <token>
```

---

## 🔄 WebSocket Events

### Connection
```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your_access_token'
  }
});
```

### Events

#### 1. Send Message
```javascript
socket.emit('send_message', {
  recipientId: 'uuid',
  message: 'Hello!'
});
```

#### 2. Receive Message
```javascript
socket.on('new_message', (data) => {
  console.log('New message from:', data.from);
  console.log('Message:', data.message);
});
```

#### 3. Send Notification
```javascript
socket.emit('send_notification', {
  role: 'student',
  title: 'New Assignment',
  message: 'Mathematics assignment has been posted',
  type: 'info'
});
```

#### 4. Receive Notification
```javascript
socket.on('notification', (data) => {
  console.log('Notification:', data);
});
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Forbidden: Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Detailed error message (development only)"
}
```

---

## 📝 Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@edusphere.com","password":"Admin@123","role":"admin","firstName":"John","lastName":"Doe"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123","role":"admin"}'
```

### Get Students (with auth)
```bash
curl -X GET http://localhost:5000/api/v1/students \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📚 Postman Collection

Import this collection into Postman for easy API testing:

1. Create a new collection named "EduSphere API"
2. Add environment variables:
   - `base_url`: http://localhost:5000/api/v1
   - `access_token`: (will be set after login)
3. Import all endpoints from this documentation

---

## 🔒 Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Headers**:
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset time

---

## 📖 Additional Resources

- Full Documentation: `BACKEND_STACK.md`
- Quick Start Guide: `QUICK_START.md`
- Sample Code: `SAMPLE_IMPLEMENTATION.ts`

---

**Last Updated**: January 21, 2026
**API Version**: v1.0.0
