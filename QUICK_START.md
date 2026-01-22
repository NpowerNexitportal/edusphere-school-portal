# 🚀 EduSphere Backend - Quick Start Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** v18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 15+ ([Download](https://www.postgresql.org/download/))
- **Redis** 7+ ([Download](https://redis.io/download))
- **Git** ([Download](https://git-scm.com/))
- **Docker** (Optional, for containerized setup) ([Download](https://www.docker.com/))

---

## 🎯 Option 1: Quick Setup with Docker (Recommended)

### Step 1: Clone or Navigate to Project
```bash
cd "C:\Users\CLASSIC\OneDrive\Documents\Ollama school admin"
```

### Step 2: Create Environment File
```bash
# Copy the example environment file
copy .env.example .env

# Edit .env and update the values as needed
notepad .env
```

### Step 3: Start All Services with Docker
```bash
# Start PostgreSQL, Redis, and the API
docker-compose up -d

# View logs
docker-compose logs -f api
```

### Step 4: Run Database Migrations
```bash
# Access the API container
docker exec -it edusphere-api sh

# Run migrations
npm run prisma:migrate

# Seed the database (optional)
npm run prisma:seed

# Exit container
exit
```

### Step 5: Access the Application
- **API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health
- **pgAdmin**: http://localhost:5050 (admin@edusphere.com / admin123)
- **Redis Commander**: http://localhost:8081

---

## 🛠️ Option 2: Manual Setup (Without Docker)

### Step 1: Install Dependencies
```bash
cd "C:\Users\CLASSIC\OneDrive\Documents\Ollama school admin"
npm install
```

### Step 2: Setup PostgreSQL Database
```sql
-- Open PostgreSQL command line or pgAdmin
CREATE DATABASE edusphere;
CREATE USER edusphere WITH PASSWORD 'edusphere123';
GRANT ALL PRIVILEGES ON DATABASE edusphere TO edusphere;
```

### Step 3: Setup Environment Variables
```bash
# Copy the example file
copy .env.example .env

# Edit the .env file with your configuration
notepad .env
```

Update these critical values in `.env`:
```env
DATABASE_URL=postgresql://edusphere:edusphere123@localhost:5432/edusphere
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-unique-secret-key-here
JWT_REFRESH_SECRET=your-unique-refresh-secret-here
```

### Step 4: Start Redis
```bash
# Windows (if installed via MSI)
redis-server

# Or if using WSL
wsl redis-server
```

### Step 5: Generate Prisma Client & Run Migrations
```bash
# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Seed the database with sample data
npm run prisma:seed
```

### Step 6: Start the Development Server
```bash
npm run dev
```

The API will be available at: **http://localhost:5000**

---

## 📝 Create the Project Structure

Create the following folder structure:

```bash
mkdir src
mkdir src\config
mkdir src\controllers
mkdir src\models
mkdir src\routes
mkdir src\middleware
mkdir src\services
mkdir src\utils
mkdir src\validators
mkdir src\types
mkdir src\socket
mkdir src\jobs
mkdir src\tests
mkdir prisma
mkdir logs
mkdir uploads
```

---

## 🧪 Testing the API

### 1. Health Check
```bash
curl http://localhost:5000/health
```

Expected Response:
```json
{
  "status": "OK",
  "timestamp": "2026-01-21T19:47:04.000Z"
}
```

### 2. Register a New User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"admin\",
    \"email\": \"admin@edusphere.com\",
    \"password\": \"Admin@123\",
    \"role\": \"admin\",
    \"firstName\": \"John\",
    \"lastName\": \"Doe\"
  }"
```

### 3. Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"admin\",
    \"password\": \"Admin@123\",
    \"role\": \"admin\"
  }"
```

---

## 📦 Essential Files to Create

### 1. TypeScript Configuration (`tsconfig.json`)
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
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 2. Nodemon Configuration (`nodemon.json`)
```json
{
  "watch": ["src"],
  "ext": "ts,json",
  "ignore": ["src/**/*.spec.ts"],
  "exec": "ts-node src/server.ts",
  "env": {
    "NODE_ENV": "development"
  }
}
```

### 3. Prisma Schema (`prisma/schema.prisma`)
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
  isActive      Boolean   @default(true) @map("is_active")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  @@map("users")
}

enum Role {
  admin
  teacher
  student
  parent
}
```

### 4. Main Application (`src/app.ts`)
```typescript
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString() 
  });
});

export default app;
```

### 5. Server Entry Point (`src/server.ts`)
```typescript
import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});
```

---

## 🔧 Common Commands

```bash
# Development
npm run dev                  # Start development server
npm run build                # Build for production
npm start                    # Start production server

# Database
npm run prisma:generate      # Generate Prisma Client
npm run prisma:migrate       # Run migrations
npm run prisma:studio        # Open Prisma Studio (DB GUI)
npm run prisma:seed          # Seed database

# Testing
npm test                     # Run tests
npm run test:watch           # Run tests in watch mode
npm run test:coverage        # Generate coverage report

# Code Quality
npm run lint                 # Check for linting errors
npm run lint:fix             # Fix linting errors
npm run format               # Format code with Prettier

# Docker
npm run docker:up            # Start Docker containers
npm run docker:down          # Stop Docker containers
npm run docker:logs          # View Docker logs
```

---

## 🐛 Troubleshooting

### Issue: Port 5000 already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Change port in .env
PORT=5001
```

### Issue: Database connection failed
```bash
# Check PostgreSQL is running
# Windows Services: Look for "postgresql-x64-15"

# Test connection
psql -U edusphere -d edusphere -h localhost
```

### Issue: Redis connection failed
```bash
# Check Redis is running
redis-cli ping
# Should return: PONG
```

### Issue: Prisma Client not generated
```bash
npm run prisma:generate
```

---

## 📚 Next Steps

1. **Review the full documentation**: `BACKEND_STACK.md`
2. **Implement authentication**: Create auth controllers and routes
3. **Add student management**: Implement CRUD operations
4. **Setup WebSocket**: For real-time notifications
5. **Integrate with frontend**: Connect to `index2.html`
6. **Add tests**: Write unit and integration tests
7. **Deploy**: Use Docker or cloud platforms (AWS, Azure, Heroku)

---

## 🆘 Need Help?

- Check the main documentation: `BACKEND_STACK.md`
- Review Prisma docs: https://www.prisma.io/docs
- Express.js guide: https://expressjs.com/
- TypeScript handbook: https://www.typescriptlang.org/docs/

---

## 🎉 You're Ready!

Your EduSphere backend is now set up and ready for development. Start building amazing features! 🚀

**Estimated setup time: 10-15 minutes**
