// ============================================
// EduSphere Backend - Sample Implementation
// ============================================

// ==========================================
// 1. APP.TS - Main Application Setup
// ==========================================

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

const app: Application = express();

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined'));

// Health Check
app.get('/health', (req: Request, res: Response) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
    });
});

// API Routes (to be implemented)
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/students', studentRoutes);
// app.use('/api/v1/teachers', teacherRoutes);
// etc...

// 404 Handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

export default app;


// ==========================================
// 2. SERVER.TS - Server Entry Point
// ==========================================

import app from './app';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Test database connection
        await prisma.$connect();
        console.log('✅ Database connected successfully');

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📡 Environment: ${process.env.NODE_ENV}`);
            console.log(`🔗 Health check: http://localhost:${PORT}/health`);
            console.log(`📚 API Base URL: http://localhost:${PORT}/api/v1`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});

startServer();


// ==========================================
// 3. AUTH CONTROLLER - Authentication Logic
// ==========================================

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface RegisterBody {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'teacher' | 'student' | 'parent';
    firstName: string;
    lastName: string;
}

interface LoginBody {
    username: string;
    password: string;
    role: 'admin' | 'teacher' | 'student' | 'parent';
}

// Generate JWT Tokens
const generateTokens = (userId: string, username: string, email: string, role: string) => {
    const accessToken = jwt.sign(
        { userId, username, email, role },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    const refreshToken = jwt.sign(
        { userId },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    return { accessToken, refreshToken };
};

// Register Controller
export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password, role, firstName, lastName }: RegisterBody = req.body;

        // Validation
        if (!username || !email || !password || !role || !firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if user exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username or email already exists'
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
                lastName: true,
                createdAt: true
            }
        });

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(
            user.id,
            user.username,
            user.email,
            user.role
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user,
                accessToken,
                refreshToken
            }
        });
    } catch (error: any) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
};

// Login Controller
export const login = async (req: Request, res: Response) => {
    try {
        const { username, password, role }: LoginBody = req.body;

        // Validation
        if (!username || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'Username, password, and role are required'
            });
        }

        // Find user
        const user = await prisma.user.findFirst({
            where: {
                username,
                role,
                isActive: true
            }
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
        const { accessToken, refreshToken } = generateTokens(
            user.id,
            user.username,
            user.email,
            user.role
        );

        res.json({
            success: true,
            message: 'Login successful',
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
    } catch (error: any) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
};

// Refresh Token Controller
export const refreshToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required'
            });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;

        // Get user
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });

        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }

        // Generate new tokens
        const tokens = generateTokens(
            user.id,
            user.username,
            user.email,
            user.role
        );

        res.json({
            success: true,
            data: tokens
        });
    } catch (error: any) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired refresh token',
            error: error.message
        });
    }
};


// ==========================================
// 4. AUTH MIDDLEWARE - Protect Routes
// ==========================================

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                username: string;
                email: string;
                role: string;
            };
        }
    }
}

// Authentication Middleware
export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

        req.user = {
            userId: decoded.userId,
            username: decoded.username,
            email: decoded.email,
            role: decoded.role
        };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

// Authorization Middleware
export const authorize = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: Insufficient permissions'
            });
        }

        next();
    };
};


// ==========================================
// 5. STUDENT CONTROLLER - Sample CRUD
// ==========================================

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all students with pagination
export const getStudents = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const search = req.query.search as string;
        const classId = req.query.classId as string;

        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {};

        if (search) {
            where.user = {
                OR: [
                    { firstName: { contains: search, mode: 'insensitive' } },
                    { lastName: { contains: search, mode: 'insensitive' } },
                    { username: { contains: search, mode: 'insensitive' } }
                ]
            };
        }

        if (classId) {
            where.classId = classId;
        }

        // Get students
        const [students, total] = await Promise.all([
            prisma.student.findMany({
                where,
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            phone: true,
                            avatarUrl: true
                        }
                    },
                    class: true,
                    parent: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.student.count({ where })
        ]);

        res.json({
            success: true,
            data: {
                students,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch students',
            error: error.message
        });
    }
};

// Get single student
export const getStudent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const student = await prisma.student.findUnique({
            where: { id },
            include: {
                user: true,
                class: true,
                parent: true
            }
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.json({
            success: true,
            data: student
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch student',
            error: error.message
        });
    }
};


// ==========================================
// 6. DASHBOARD CONTROLLER - Statistics
// ==========================================

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        // Get counts
        const [
            totalStudents,
            totalTeachers,
            totalClasses,
            pendingFees
        ] = await Promise.all([
            prisma.student.count({ where: { user: { isActive: true } } }),
            prisma.teacher.count({ where: { user: { isActive: true } } }),
            prisma.class.count({ where: { isActive: true } }),
            prisma.fee.count({ where: { status: 'pending' } })
        ]);

        // Calculate attendance rate (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const attendanceStats = await prisma.attendance.groupBy({
            by: ['status'],
            where: {
                date: {
                    gte: thirtyDaysAgo
                }
            },
            _count: true
        });

        const totalAttendance = attendanceStats.reduce((sum, stat) => sum + stat._count, 0);
        const presentCount = attendanceStats.find(s => s.status === 'present')?._count || 0;
        const attendanceRate = totalAttendance > 0
            ? Math.round((presentCount / totalAttendance) * 100)
            : 0;

        // Get recent activity
        const recentActivity = await prisma.auditLog.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        role: true
                    }
                }
            }
        });

        res.json({
            success: true,
            data: {
                totalStudents,
                totalTeachers,
                totalClasses,
                attendanceRate,
                pendingRequests: pendingFees,
                recentActivity: recentActivity.map(activity => ({
                    id: activity.id,
                    action: activity.action,
                    user: `${activity.user.firstName} ${activity.user.lastName}`,
                    role: activity.user.role,
                    timestamp: activity.createdAt
                }))
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard stats',
            error: error.message
        });
    }
};


// ==========================================
// 7. ROUTES SETUP - Example
// ==========================================

import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import * as studentController from '../controllers/student.controller';
import * as dashboardController from '../controllers/dashboard.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Auth Routes (Public)
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/refresh-token', authController.refreshToken);

// Student Routes (Protected)
router.get('/students', authenticate, authorize('admin', 'teacher'), studentController.getStudents);
router.get('/students/:id', authenticate, studentController.getStudent);

// Dashboard Routes (Protected)
router.get('/dashboard/stats', authenticate, dashboardController.getDashboardStats);

export default router;


// ==========================================
// 8. WEBSOCKET SETUP - Real-time Features
// ==========================================

import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

export const initializeSocket = (io: Server) => {
    // Authentication middleware for socket
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error('Authentication error'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
            socket.data.user = decoded;
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.data.user.username}`);

        // Join user-specific room
        socket.join(`user:${socket.data.user.userId}`);

        // Join role-specific room
        socket.join(`role:${socket.data.user.role}`);

        // Handle messages
        socket.on('send_message', async (data) => {
            // Emit to recipient
            io.to(`user:${data.recipientId}`).emit('new_message', {
                from: socket.data.user.username,
                message: data.message,
                timestamp: new Date()
            });
        });

        // Handle notifications
        socket.on('send_notification', (data) => {
            io.to(`role:${data.role}`).emit('notification', {
                title: data.title,
                message: data.message,
                type: data.type
            });
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.data.user.username}`);
        });
    });
};


// ==========================================
// USAGE NOTES
// ==========================================

/*
This file demonstrates the core structure of the EduSphere backend.

To implement:
1. Create the folder structure as shown in BACKEND_STACK.md
2. Split this code into appropriate files
3. Install dependencies from package.json
4. Setup database with Prisma
5. Configure environment variables
6. Run migrations
7. Start the server

Key Features Demonstrated:
- Express.js setup with security middleware
- JWT authentication & authorization
- Prisma ORM for database operations
- RESTful API design
- WebSocket for real-time features
- Error handling
- Pagination
- Role-based access control

Next Steps:
- Implement remaining controllers (teachers, classes, exams, etc.)
- Add input validation with Joi or Zod
- Implement file upload functionality
- Add email notifications
- Create comprehensive tests
- Setup logging with Winston
- Add API documentation with Swagger
*/
