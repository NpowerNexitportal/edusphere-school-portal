// EduSphere Backend - Ultra Simple Version (No Dependencies!)
const http = require('http');
const url = require('url');

const PORT = process.env.PORT || 5000;

// Enable CORS
const setCORS = (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

// Parse JSON body
const parseBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (e) {
                resolve({});
            }
        });
    });
};

// Create Server
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    setCORS(res);

    // Handle OPTIONS (CORS preflight)
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    res.setHeader('Content-Type', 'application/json');

    // Routes
    if (pathname === '/health' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            status: 'OK',
            timestamp: new Date().toISOString(),
            message: 'EduSphere Backend Running! (No dependencies version)',
            version: '1.0.0-simple'
        }));
    }

    else if (pathname === '/api/v1/dashboard/stats' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
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
                        action: 'New Student Registered',
                        user: 'Sarah Johnson joined Grade 10A',
                        timestamp: new Date(Date.now() - 7200000).toISOString()
                    },
                    {
                        id: '2',
                        action: 'Tuition Fee Payment',
                        user: 'Payment of $1,200 received from Michael Chen',
                        timestamp: new Date(Date.now() - 14400000).toISOString()
                    },
                    {
                        id: '3',
                        action: 'Attendance Alert',
                        user: 'Emily Rodriguez has 5 unexcused absences this month',
                        timestamp: new Date(Date.now() - 86400000).toISOString()
                    }
                ],
                upcomingExams: [
                    {
                        id: '1',
                        name: 'Mathematics Midterm',
                        date: '2026-02-15',
                        class: 'Grade 10A'
                    }
                ],
                feeCollection: {
                    total: 500000,
                    collected: 425000,
                    pending: 75000,
                    collectionRate: 85
                }
            }
        }));
    }

    else if (pathname === '/api/v1/auth/login' && req.method === 'POST') {
        const body = await parseBody(req);

        if (body.username && body.password) {
            res.writeHead(200);
            res.end(JSON.stringify({
                success: true,
                message: 'Login successful',
                data: {
                    user: {
                        id: '123',
                        username: body.username,
                        email: `${body.username}@edusphere.com`,
                        role: body.role || 'admin',
                        firstName: 'John',
                        lastName: 'Doe'
                    },
                    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token.' + Date.now(),
                    refreshToken: 'refresh-token-' + Date.now()
                }
            }));
        } else {
            res.writeHead(401);
            res.end(JSON.stringify({
                success: false,
                message: 'Invalid credentials'
            }));
        }
    }

    else if (pathname === '/api/v1/students' && req.method === 'GET') {
        const students = [];
        for (let i = 1; i <= 20; i++) {
            students.push({
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

        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            data: {
                students: students,
                pagination: {
                    total: 1248,
                    page: 1,
                    limit: 20,
                    totalPages: 63
                }
            }
        }));
    }

    else if (pathname === '/api/v1/teachers' && req.method === 'GET') {
        const teachers = [];
        for (let i = 1; i <= 10; i++) {
            teachers.push({
                id: `teacher-${i}`,
                employeeId: `EMP${String(i).padStart(4, '0')}`,
                firstName: `Teacher`,
                lastName: `${i}`,
                email: `teacher${i}@edusphere.com`,
                department: i % 2 === 0 ? 'Mathematics' : 'Science',
                designation: 'Senior Teacher'
            });
        }

        res.writeHead(200);
        res.end(JSON.stringify({
            success: true,
            data: {
                teachers: teachers,
                pagination: {
                    total: 86,
                    page: 1,
                    limit: 10,
                    totalPages: 9
                }
            }
        }));
    }

    else {
        res.writeHead(404);
        res.end(JSON.stringify({
            success: false,
            message: 'Route not found',
            path: pathname
        }));
    }
});

server.listen(PORT, () => {
    console.log('\n╔════════════════════════════════════════════════╗');
    console.log('║    🎓 EduSphere Backend Server (Simple)      ║');
    console.log('╚════════════════════════════════════════════════╝\n');
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}\n`);
    console.log('📍 Available endpoints:');
    console.log(`   🔗 Health Check:    http://localhost:${PORT}/health`);
    console.log(`   📊 Dashboard Stats: http://localhost:${PORT}/api/v1/dashboard/stats`);
    console.log(`   🔐 Login:          POST http://localhost:${PORT}/api/v1/auth/login`);
    console.log(`   👨‍🎓 Students:        http://localhost:${PORT}/api/v1/students`);
    console.log(`   👨‍🏫 Teachers:        http://localhost:${PORT}/api/v1/teachers\n`);
    console.log('✨ Ready to accept requests!\n');
    console.log('💡 Test it: Open your browser and visit:');
    console.log(`   http://localhost:${PORT}/health\n`);
});
