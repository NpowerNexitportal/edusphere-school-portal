# 🚀 Manual Setup Guide (No Docker Required)

## Current System Status
✅ Node.js v24.11.0 - Installed  
✅ npm v11.6.1 - Installed  
✅ Python 3.13.7 - Installed  
❌ Docker - Not installed  
❌ PostgreSQL - Not installed  

---

## 🎯 Quick Setup (15 minutes)

### Step 1: Install Dependencies
```powershell
cd "C:\Users\CLASSIC\OneDrive\Documents\Ollama school admin"
npm install
```

### Step 2: Update Environment for SQLite
The `.env` file has been created. Open it and change:

**FROM:**
```env
DATABASE_URL=postgresql://edusphere:edusphere123@localhost:5432/edusphere
```

**TO:**
```env
DATABASE_URL=file:./dev.db
```

This will use SQLite instead of PostgreSQL (no installation required!).

### Step 3: Create Minimal Project Structure

Create these essential files:

#### A. `tsconfig.json`
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
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### B. `prisma/schema.prisma` (Simplified for SQLite)
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  username      String    @unique
  email         String    @unique
  passwordHash  String
  role          String
  firstName     String
  lastName      String
  phone         String?
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Student {
  id            String    @id @default(uuid())
  userId        String    @unique
  studentId     String    @unique
  classId       String?
  rollNumber    String?
  admissionDate DateTime
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Teacher {
  id           String    @id @default(uuid())
  userId       String    @unique
  employeeId   String    @unique
  department   String?
  designation  String?
  joiningDate  DateTime
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}
```

#### C. `src/app.ts`
```typescript
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'EduSphere Backend Running!'
  });
});

app.get('/api/v1/dashboard/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalStudents: 1248,
      totalTeachers: 86,
      attendanceRate: 92,
      pendingRequests: 24
    }
  });
});

export default app;
```

#### D. `src/server.ts`
```typescript
import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/v1/dashboard/stats`);
});
```

### Step 4: Run the Server
```powershell
npm run dev
```

---

## 🎯 Alternative: Install Docker (Recommended for Full Setup)

If you want the complete setup with PostgreSQL, Redis, etc.:

1. **Download Docker Desktop:**
   https://www.docker.com/products/docker-desktop/

2. **Install and restart your computer**

3. **Then run:**
   ```powershell
   docker-compose up -d
   ```

---

## 🔧 Troubleshooting

### Issue: npm install fails
```powershell
# Clear cache and try again
npm cache clean --force
npm install
```

### Issue: Port 5000 already in use
Change PORT in `.env`:
```env
PORT=5001
```

---

## ✅ Testing Your API

Once the server is running, visit:
- http://localhost:5000/health
- http://localhost:5000/api/v1/dashboard/stats

---

**You're all set!** 🎉
