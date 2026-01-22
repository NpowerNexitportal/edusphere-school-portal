# 🎓 EduSphere - Complete Backend Stack Architecture

## 📋 Table of Contents
1. [Technology Stack Overview](#technology-stack-overview)
2. [Database Schema](#database-schema)
3. [API Architecture](#api-architecture)
4. [Authentication & Authorization](#authentication--authorization)
5. [Core Modules](#core-modules)
6. [File Structure](#file-structure)
7. [Implementation Guide](#implementation-guide)

---

## 🛠️ Technology Stack Overview

### **Backend Framework: Node.js + Express.js**
- **Runtime**: Node.js v18+ (LTS)
- **Framework**: Express.js 4.18+
- **Language**: TypeScript 5.0+
- **API Style**: RESTful + GraphQL (optional)

### **Database Layer**
- **Primary Database**: PostgreSQL 15+ (Relational data)
- **Cache Layer**: Redis 7+ (Session management, caching)
- **File Storage**: AWS S3 / MinIO (Documents, images)
- **Search Engine**: Elasticsearch 8+ (Full-text search)

### **Authentication & Security**
- **Auth Strategy**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Rate Limiting**: express-rate-limit
- **CORS**: cors middleware
- **Helmet**: Security headers

### **Real-time Features**
- **WebSockets**: Socket.io
- **Notifications**: Firebase Cloud Messaging (FCM)
- **Email**: Nodemailer + SendGrid

### **Additional Tools**
- **ORM**: Prisma / TypeORM
- **Validation**: Joi / Zod
- **Logging**: Winston + Morgan
- **Testing**: Jest + Supertest
- **Documentation**: Swagger/OpenAPI
- **Process Manager**: PM2
- **Monitoring**: Prometheus + Grafana

---

## 🗄️ Database Schema

### **1. Users Table**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'teacher', 'student', 'parent') NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
```

### **2. Students Table**
```sql
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    admission_date DATE NOT NULL,
    class_id UUID REFERENCES classes(id),
    section VARCHAR(10),
    roll_number VARCHAR(20),
    blood_group VARCHAR(5),
    emergency_contact VARCHAR(20),
    parent_id UUID REFERENCES parents(id),
    medical_conditions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_students_class ON students(class_id);
CREATE INDEX idx_students_parent ON students(parent_id);
```

### **3. Teachers Table**
```sql
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    department VARCHAR(50),
    designation VARCHAR(50),
    qualification TEXT,
    specialization VARCHAR(100),
    joining_date DATE NOT NULL,
    salary DECIMAL(10, 2),
    experience_years INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_teachers_department ON teachers(department);
```

### **4. Parents Table**
```sql
CREATE TABLE parents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    occupation VARCHAR(100),
    annual_income DECIMAL(12, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **5. Classes Table**
```sql
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    grade_level INTEGER NOT NULL,
    section VARCHAR(10),
    class_teacher_id UUID REFERENCES teachers(id),
    room_number VARCHAR(20),
    capacity INTEGER,
    academic_year VARCHAR(10),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_classes_teacher ON classes(class_teacher_id);
```

### **6. Subjects Table**
```sql
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    credits INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **7. Class Subjects (Junction Table)**
```sql
CREATE TABLE class_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES teachers(id),
    schedule_time VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(class_id, subject_id)
);
```

### **8. Attendance Table**
```sql
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id),
    date DATE NOT NULL,
    status ENUM('present', 'absent', 'late', 'excused') NOT NULL,
    marked_by UUID REFERENCES users(id),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, date)
);

CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_student ON attendance(student_id);
```

### **9. Exams Table**
```sql
CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    exam_type ENUM('midterm', 'final', 'quiz', 'assignment') NOT NULL,
    class_id UUID REFERENCES classes(id),
    subject_id UUID REFERENCES subjects(id),
    exam_date DATE NOT NULL,
    start_time TIME,
    duration_minutes INTEGER,
    total_marks INTEGER NOT NULL,
    passing_marks INTEGER NOT NULL,
    instructions TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exams_date ON exams(exam_date);
CREATE INDEX idx_exams_class ON exams(class_id);
```

### **10. Exam Results Table**
```sql
CREATE TABLE exam_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    marks_obtained DECIMAL(5, 2) NOT NULL,
    grade VARCHAR(5),
    remarks TEXT,
    submitted_at TIMESTAMP,
    graded_by UUID REFERENCES teachers(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(exam_id, student_id)
);

CREATE INDEX idx_results_student ON exam_results(student_id);
CREATE INDEX idx_results_exam ON exam_results(exam_id);
```

### **11. Fees Table**
```sql
CREATE TABLE fees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    fee_type ENUM('tuition', 'transport', 'library', 'sports', 'other') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    status ENUM('pending', 'paid', 'overdue', 'waived') DEFAULT 'pending',
    payment_date DATE,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fees_student ON fees(student_id);
CREATE INDEX idx_fees_status ON fees(status);
```

### **12. Messages Table**
```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(200),
    body TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    parent_message_id UUID REFERENCES messages(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_read ON messages(is_read);
```

### **13. Notifications Table**
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'warning', 'success', 'error') DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
```

### **14. Timetable Table**
```sql
CREATE TABLE timetable (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id),
    teacher_id UUID REFERENCES teachers(id),
    day_of_week INTEGER NOT NULL, -- 1=Monday, 7=Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_timetable_class ON timetable(class_id);
CREATE INDEX idx_timetable_day ON timetable(day_of_week);
```

### **15. Assignments Table**
```sql
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    class_id UUID REFERENCES classes(id),
    subject_id UUID REFERENCES subjects(id),
    teacher_id UUID REFERENCES teachers(id),
    due_date TIMESTAMP NOT NULL,
    total_marks INTEGER,
    attachment_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **16. Assignment Submissions Table**
```sql
CREATE TABLE assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    submission_text TEXT,
    attachment_url TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    marks_obtained DECIMAL(5, 2),
    feedback TEXT,
    graded_at TIMESTAMP,
    graded_by UUID REFERENCES teachers(id),
    UNIQUE(assignment_id, student_id)
);
```

### **17. Audit Logs Table**
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);
```

---

## 🔌 API Architecture

### **Base URL Structure**
```
https://api.edusphere.com/v1
```

### **Authentication Endpoints**

#### POST /auth/register
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "student",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### POST /auth/login
```json
{
  "username": "john_doe",
  "password": "SecurePass123!",
  "role": "student"
}
```

**Response:**
```json
{
  "success": true,
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

#### POST /auth/refresh-token
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### POST /auth/logout
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### POST /auth/forgot-password
```json
{
  "email": "john@example.com"
}
```

#### POST /auth/reset-password
```json
{
  "token": "reset_token_here",
  "newPassword": "NewSecurePass123!"
}
```

---

### **Student Endpoints**

#### GET /students
**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `search` (search by name, student_id)
- `classId` (filter by class)
- `status` (active/inactive)

**Response:**
```json
{
  "success": true,
  "data": {
    "students": [...],
    "pagination": {
      "total": 1248,
      "page": 1,
      "limit": 20,
      "totalPages": 63
    }
  }
}
```

#### GET /students/:id
#### POST /students
#### PUT /students/:id
#### DELETE /students/:id
#### GET /students/:id/attendance
#### GET /students/:id/grades
#### GET /students/:id/fees

---

### **Teacher Endpoints**

#### GET /teachers
#### GET /teachers/:id
#### POST /teachers
#### PUT /teachers/:id
#### DELETE /teachers/:id
#### GET /teachers/:id/classes
#### GET /teachers/:id/schedule

---

### **Class Endpoints**

#### GET /classes
#### GET /classes/:id
#### POST /classes
#### PUT /classes/:id
#### DELETE /classes/:id
#### GET /classes/:id/students
#### GET /classes/:id/subjects
#### GET /classes/:id/timetable

---

### **Attendance Endpoints**

#### GET /attendance
**Query Parameters:**
- `studentId`
- `classId`
- `date`
- `startDate`
- `endDate`

#### POST /attendance/mark
```json
{
  "classId": "uuid",
  "date": "2026-01-21",
  "attendance": [
    {
      "studentId": "uuid",
      "status": "present"
    },
    {
      "studentId": "uuid",
      "status": "absent",
      "remarks": "Sick leave"
    }
  ]
}
```

#### GET /attendance/statistics
#### GET /attendance/student/:studentId

---

### **Exam Endpoints**

#### GET /exams
#### GET /exams/:id
#### POST /exams
#### PUT /exams/:id
#### DELETE /exams/:id
#### POST /exams/:id/results
#### GET /exams/:id/results
#### GET /exams/:id/analytics

---

### **Fee Endpoints**

#### GET /fees
#### GET /fees/:id
#### POST /fees
#### PUT /fees/:id
#### POST /fees/:id/payment
#### GET /fees/student/:studentId
#### GET /fees/overdue
#### GET /fees/statistics

---

### **Message Endpoints**

#### GET /messages
#### GET /messages/:id
#### POST /messages
#### PUT /messages/:id/read
#### DELETE /messages/:id
#### GET /messages/unread-count

---

### **Notification Endpoints**

#### GET /notifications
#### PUT /notifications/:id/read
#### PUT /notifications/mark-all-read
#### DELETE /notifications/:id

---

### **Dashboard Endpoints**

#### GET /dashboard/stats
```json
{
  "success": true,
  "data": {
    "totalStudents": 1248,
    "totalTeachers": 86,
    "attendanceRate": 92,
    "pendingRequests": 24,
    "recentActivity": [...],
    "upcomingExams": [...],
    "feeCollection": {
      "total": 500000,
      "collected": 425000,
      "pending": 75000
    }
  }
}
```

#### GET /dashboard/analytics
#### GET /dashboard/performance

---

## 🔐 Authentication & Authorization

### **JWT Token Structure**

**Access Token (15 minutes expiry):**
```json
{
  "userId": "uuid",
  "username": "john_doe",
  "email": "john@example.com",
  "role": "student",
  "iat": 1705867200,
  "exp": 1705868100
}
```

**Refresh Token (7 days expiry):**
```json
{
  "userId": "uuid",
  "tokenVersion": 1,
  "iat": 1705867200,
  "exp": 1706472000
}
```

### **Role-Based Access Control (RBAC)**

```typescript
const permissions = {
  admin: [
    'users:create', 'users:read', 'users:update', 'users:delete',
    'students:*', 'teachers:*', 'classes:*', 'fees:*',
    'exams:*', 'attendance:*', 'messages:*', 'settings:*'
  ],
  teacher: [
    'students:read', 'classes:read', 'attendance:create',
    'attendance:read', 'exams:create', 'exams:read',
    'exams:update', 'grades:create', 'grades:update',
    'messages:create', 'messages:read'
  ],
  student: [
    'profile:read', 'profile:update', 'grades:read',
    'attendance:read', 'fees:read', 'messages:create',
    'messages:read', 'assignments:read', 'assignments:submit'
  ],
  parent: [
    'children:read', 'grades:read', 'attendance:read',
    'fees:read', 'fees:pay', 'messages:create', 'messages:read'
  ]
};
```

### **Middleware Implementation**

```typescript
// Authentication Middleware
export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token provided');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

// Authorization Middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Forbidden' 
      });
    }
    next();
  };
};

// Permission Middleware
export const checkPermission = (permission) => {
  return (req, res, next) => {
    const userPermissions = permissions[req.user.role];
    const hasPermission = userPermissions.some(p => 
      p === permission || p.endsWith(':*')
    );
    
    if (!hasPermission) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions' 
      });
    }
    next();
  };
};
```

---

## 📦 Core Modules

### **1. User Management Module**
- User registration and authentication
- Profile management
- Password reset functionality
- Email verification
- Role management

### **2. Student Management Module**
- Student enrollment
- Student profile management
- Academic records
- Parent-student linking
- Bulk import/export

### **3. Teacher Management Module**
- Teacher onboarding
- Subject assignment
- Class assignment
- Performance tracking
- Salary management

### **4. Class Management Module**
- Class creation and management
- Section management
- Student-class assignment
- Class teacher assignment
- Capacity management

### **5. Attendance Module**
- Daily attendance marking
- Attendance reports
- Absence tracking
- Late arrivals
- Attendance analytics

### **6. Examination Module**
- Exam scheduling
- Grade management
- Result publication
- Performance analytics
- Report card generation

### **7. Fee Management Module**
- Fee structure creation
- Fee collection
- Payment tracking
- Overdue notifications
- Receipt generation
- Financial reports

### **8. Communication Module**
- Internal messaging
- Announcements
- Email notifications
- SMS integration
- Parent-teacher communication

### **9. Timetable Module**
- Schedule creation
- Conflict detection
- Teacher availability
- Room allocation
- Timetable distribution

### **10. Assignment Module**
- Assignment creation
- Submission tracking
- Grading
- Feedback system
- Plagiarism detection

### **11. Library Module** (Optional)
- Book management
- Issue/return tracking
- Fine calculation
- Inventory management

### **12. Transport Module** (Optional)
- Route management
- Vehicle tracking
- Driver management
- Fee calculation

---

## 📁 File Structure

```
edusphere-backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   ├── aws.ts
│   │   └── env.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── student.controller.ts
│   │   ├── teacher.controller.ts
│   │   ├── class.controller.ts
│   │   ├── attendance.controller.ts
│   │   ├── exam.controller.ts
│   │   ├── fee.controller.ts
│   │   ├── message.controller.ts
│   │   └── dashboard.controller.ts
│   ├── models/
│   │   ├── User.model.ts
│   │   ├── Student.model.ts
│   │   ├── Teacher.model.ts
│   │   ├── Class.model.ts
│   │   ├── Attendance.model.ts
│   │   ├── Exam.model.ts
│   │   ├── Fee.model.ts
│   │   └── Message.model.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── student.routes.ts
│   │   ├── teacher.routes.ts
│   │   ├── class.routes.ts
│   │   ├── attendance.routes.ts
│   │   ├── exam.routes.ts
│   │   ├── fee.routes.ts
│   │   ├── message.routes.ts
│   │   └── index.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── logger.middleware.ts
│   │   └── rateLimit.middleware.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── email.service.ts
│   │   ├── sms.service.ts
│   │   ├── notification.service.ts
│   │   ├── upload.service.ts
│   │   └── analytics.service.ts
│   ├── utils/
│   │   ├── jwt.util.ts
│   │   ├── bcrypt.util.ts
│   │   ├── validation.util.ts
│   │   ├── pagination.util.ts
│   │   └── date.util.ts
│   ├── validators/
│   │   ├── auth.validator.ts
│   │   ├── student.validator.ts
│   │   ├── teacher.validator.ts
│   │   └── common.validator.ts
│   ├── types/
│   │   ├── express.d.ts
│   │   ├── user.types.ts
│   │   └── api.types.ts
│   ├── socket/
│   │   ├── socket.ts
│   │   └── handlers/
│   │       ├── message.handler.ts
│   │       └── notification.handler.ts
│   ├── jobs/
│   │   ├── emailQueue.ts
│   │   ├── reportGeneration.ts
│   │   └── backupDatabase.ts
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   ├── app.ts
│   └── server.ts
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── jest.config.js
├── docker-compose.yml
├── Dockerfile
└── README.md
```

---

## 🚀 Implementation Guide

### **Step 1: Initialize Project**

```bash
# Create project directory
mkdir edusphere-backend
cd edusphere-backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express typescript ts-node @types/node @types/express
npm install prisma @prisma/client
npm install jsonwebtoken bcrypt cors helmet express-rate-limit
npm install dotenv joi winston morgan
npm install socket.io redis ioredis
npm install nodemailer multer aws-sdk

# Install dev dependencies
npm install -D @types/jsonwebtoken @types/bcrypt @types/cors
npm install -D @types/multer jest @types/jest ts-jest supertest
npm install -D nodemon eslint prettier
```

### **Step 2: Setup TypeScript**

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### **Step 3: Environment Configuration**

**.env.example:**
```env
# Server
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/edusphere
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@edusphere.com

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=edusphere-files

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### **Step 4: Database Setup with Prisma**

**prisma/schema.prisma:**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  username      String    @unique
  email         String    @unique
  passwordHash  String    @map("password_hash")
  role          Role
  firstName     String    @map("first_name")
  lastName      String    @map("last_name")
  phone         String?
  avatarUrl     String?   @map("avatar_url")
  dateOfBirth   DateTime? @map("date_of_birth")
  gender        Gender?
  address       String?
  isActive      Boolean   @default(true) @map("is_active")
  emailVerified Boolean   @default(false) @map("email_verified")
  lastLogin     DateTime? @map("last_login")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  student       Student?
  teacher       Teacher?
  parent        Parent?
  
  @@map("users")
}

enum Role {
  admin
  teacher
  student
  parent
}

enum Gender {
  male
  female
  other
}

// Add other models following the schema above
```

**Initialize Prisma:**
```bash
npx prisma init
npx prisma migrate dev --name init
npx prisma generate
```

### **Step 5: Create Main Application**

**src/app.ts:**
```typescript
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';
import { notFound } from './middleware/notFound.middleware';

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(morgan('combined'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use(`/api/${process.env.API_VERSION}`, routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
```

**src/server.ts:**
```typescript
import app from './app';
import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { initializeSocket } from './socket/socket';

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  }
});

// Initialize WebSocket
initializeSocket(io);

// Start server
const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

startServer();
```

### **Step 6: Authentication Implementation**

**src/controllers/auth.controller.ts:**
```typescript
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateTokens, verifyRefreshToken } from '../utils/jwt.util';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role, firstName, lastName } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        role,
        firstName,
        lastName
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true
      }
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    res.status(201).json({
      success: true,
      data: { user, accessToken, refreshToken }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password, role } = req.body;

    // Find user
    const user = await prisma.user.findFirst({
      where: { username, role }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};
```

### **Step 7: Package.json Scripts**

```json
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts"
  }
}
```

### **Step 8: Docker Setup**

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: edusphere
      POSTGRES_PASSWORD: edusphere123
      POSTGRES_DB: edusphere
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgresql://edusphere:edusphere123@postgres:5432/edusphere
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis
    volumes:
      - ./src:/app/src

volumes:
  postgres_data:
  redis_data:
```

---

## 📊 Performance Optimization

1. **Database Indexing**: All foreign keys and frequently queried fields
2. **Redis Caching**: Cache frequently accessed data (user sessions, dashboard stats)
3. **Query Optimization**: Use Prisma's select and include wisely
4. **Pagination**: Implement cursor-based pagination for large datasets
5. **Connection Pooling**: Configure Prisma connection pool
6. **Rate Limiting**: Prevent API abuse
7. **Compression**: Use gzip compression for responses
8. **CDN**: Serve static assets via CDN

---

## 🔒 Security Best Practices

1. **Input Validation**: Validate all user inputs
2. **SQL Injection Prevention**: Use Prisma ORM (parameterized queries)
3. **XSS Protection**: Sanitize user-generated content
4. **CSRF Protection**: Implement CSRF tokens
5. **Rate Limiting**: Prevent brute force attacks
6. **Helmet.js**: Security headers
7. **HTTPS Only**: Force HTTPS in production
8. **Environment Variables**: Never commit secrets
9. **Audit Logging**: Track all critical operations
10. **Regular Updates**: Keep dependencies updated

---

## 📈 Monitoring & Logging

1. **Winston Logger**: Structured logging
2. **Prometheus Metrics**: Application metrics
3. **Grafana Dashboards**: Visualization
4. **Sentry**: Error tracking
5. **PM2 Monitoring**: Process monitoring
6. **Database Monitoring**: Query performance

---

## 🧪 Testing Strategy

1. **Unit Tests**: Test individual functions
2. **Integration Tests**: Test API endpoints
3. **E2E Tests**: Test complete workflows
4. **Load Testing**: Use Artillery or k6
5. **Security Testing**: OWASP ZAP

---

## 📝 Documentation

1. **Swagger/OpenAPI**: Auto-generated API docs
2. **Postman Collection**: API testing collection
3. **README**: Setup and deployment guide
4. **Architecture Diagrams**: System design docs
5. **Code Comments**: Inline documentation

---

## 🎯 Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificates installed
- [ ] Firewall rules configured
- [ ] Monitoring setup
- [ ] Backup strategy implemented
- [ ] CI/CD pipeline configured
- [ ] Load balancer configured
- [ ] CDN setup for static assets
- [ ] Error tracking enabled

---

**Estimated Implementation Time: 4-6 weeks**
**Team Size: 2-3 Backend Developers**

This backend stack provides a robust, scalable, and secure foundation for the EduSphere School Management System! 🚀
