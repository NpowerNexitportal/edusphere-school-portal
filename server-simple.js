// EduSphere Backend - Simple Version (No TypeScript, No Database)
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        message: 'EduSphere Backend Running!',
        version: '1.0.0'
    });
});

// Dashboard Stats (matches your frontend)
app.get('/api/v1/dashboard/stats', (req, res) => {
    res.json({
        success: true,
        data: {
            totalStudents: 1248,
            totalTeachers: 86,
            totalClasses: 24,
            attendanceRate: 92,
            pendingRequests: 24,
            recentActivity: [
                {
                    id: '1',
                    action: 'Student registered',
                    user: 'John Admin',
                    role: 'admin',
                    timestamp: new Date().toISOString()
                },
                {
                    id: '2',
                    action: 'Fee payment received',
                    user: 'Payment System',
                    role: 'system',
                    timestamp: new Date().toISOString()
                }
            ]
        }
    });
});

// Login (Mock)
app.post('/api/v1/auth/login', (req, res) => {
    const { username, password, role } = req.body;

    if (username && password) {
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: '123',
                    username: username,
                    email: `${username}@edusphere.com`,
                    role: role || 'admin',
                    firstName: 'John',
                    lastName: 'Doe'
                },
                accessToken: 'mock-jwt-token-' + Date.now(),
                refreshToken: 'mock-refresh-token-' + Date.now()
            }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
});

// Get Students (Mock Data)
app.get('/api/v1/students', (req, res) => {
    const mockStudents = [];
    for (let i = 1; i <= 20; i++) {
        mockStudents.push({
            id: `student-${i}`,
            studentId: `STU${String(i).padStart(4, '0')}`,
            firstName: `Student`,
            lastName: `${i}`,
            email: `student${i}@example.com`,
            class: 'Grade 10A',
            rollNumber: i,
            admissionDate: '2025-09-01'
        });
    }

    res.json({
        success: true,
        data: {
            students: mockStudents,
            pagination: {
                total: 1248,
                page: 1,
                limit: 20,
                totalPages: 63
            }
        }
    });
});

// Get Teachers (Mock Data)
app.get('/api/v1/teachers', (req, res) => {
    const mockTeachers = [];
    for (let i = 1; i <= 10; i++) {
        mockTeachers.push({
            id: `teacher-${i}`,
            employeeId: `EMP${String(i).padStart(4, '0')}`,
            firstName: `Teacher`,
            lastName: `${i}`,
            email: `teacher${i}@edusphere.com`,
            department: i % 2 === 0 ? 'Mathematics' : 'Science',
            designation: 'Senior Teacher'
        });
    }

    res.json({
        success: true,
        data: {
            teachers: mockTeachers,
            pagination: {
                total: 86,
                page: 1,
                limit: 10,
                totalPages: 9
            }
        }
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.path
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});

// Start Server
app.listen(PORT, () => {
    console.log('╔════════════════════════════════════════╗');
    console.log('║   🎓 EduSphere Backend Server         ║');
    console.log('╚════════════════════════════════════════╝');
    console.log('');
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('');
    console.log('📍 Available endpoints:');
    console.log(`   🔗 Health Check:    http://localhost:${PORT}/health`);
    console.log(`   📊 Dashboard Stats: http://localhost:${PORT}/api/v1/dashboard/stats`);
    console.log(`   🔐 Login:          http://localhost:${PORT}/api/v1/auth/login`);
    console.log(`   👨‍🎓 Students:        http://localhost:${PORT}/api/v1/students`);
    console.log(`   👨‍🏫 Teachers:        http://localhost:${PORT}/api/v1/teachers`);
    console.log('');
    console.log('✨ Ready to accept requests!');
    console.log('');
});
