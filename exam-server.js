// ========================================
// EduSphere Exam Management Backend Server
// Complete API with Database Integration
// ========================================

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;

// ==========================================
// IN-MEMORY DATABASE (Replace with real DB in production)
// ==========================================

let examsDB = [
    {
        id: 1,
        exam_code: 'EX001',
        exam_name: 'Midterm Exam',
        subject: 'Mathematics',
        class_name: 'Grade 10A',
        exam_date: '2026-02-15',
        duration_minutes: 120,
        total_marks: 100,
        passing_marks: 40,
        term: 'Midterm',
        academic_year: '2025-2026',
        status: 'scheduled',
        created_at: new Date().toISOString()
    },
    {
        id: 2,
        exam_code: 'EX002',
        exam_name: 'Final Exam',
        subject: 'Science',
        class_name: 'Grade 9B',
        exam_date: '2026-03-20',
        duration_minutes: 180,
        total_marks: 100,
        passing_marks: 40,
        term: 'Final',
        academic_year: '2025-2026',
        status: 'scheduled',
        created_at: new Date().toISOString()
    }
];

let resultsDB = [
    {
        id: 1,
        result_code: 'RES001',
        exam_id: 1,
        student_id: 'STU001',
        student_name: 'Sarah Johnson',
        marks_obtained: 85,
        total_marks: 100,
        percentage: 85.0,
        grade: 'A',
        remarks: 'Excellent performance',
        status: 'published',
        published_at: new Date().toISOString()
    }
];

let pinsDB = [
    {
        id: 1,
        pin_code: 'PIN-2026-0001',
        student_id: 'STU001',
        exam_id: null,
        max_usage_count: 5,
        current_usage_count: 0,
        is_active: true,
        valid_from: new Date().toISOString(),
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 2,
        pin_code: 'PIN-2026-0002',
        student_id: 'STU002',
        exam_id: null,
        max_usage_count: 5,
        current_usage_count: 0,
        is_active: true,
        valid_from: new Date().toISOString(),
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }
];

let studentsDB = [
    {
        id: 1,
        student_id: 'STU001',
        first_name: 'Sarah',
        last_name: 'Johnson',
        email: 'sarah.j@example.com',
        class_name: 'Grade 10A',
        roll_number: '101'
    },
    {
        id: 2,
        student_id: 'STU002',
        first_name: 'Michael',
        last_name: 'Chen',
        email: 'michael.c@example.com',
        class_name: 'Grade 10A',
        roll_number: '102'
    }
];

// ==========================================
// HELPER FUNCTIONS
// ==========================================

const setCORS = (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

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

const sendJSON = (res, statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
};

// Calculate grade based on percentage
const calculateGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    return 'F';
};

// Generate unique PIN
const generatePIN = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `PIN-${year}-${random}`;
};

// ==========================================
// CREATE SERVER
// ==========================================

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    setCORS(res);

    // Handle OPTIONS (CORS preflight)
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    res.setHeader('Content-Type', 'application/json');

    // ==========================================
    // HEALTH CHECK
    // ==========================================
    if (pathname === '/health' && req.method === 'GET') {
        sendJSON(res, 200, {
            status: 'OK',
            timestamp: new Date().toISOString(),
            message: 'EduSphere Exam Management API Running!',
            version: '2.0.0'
        });
    }

    // ==========================================
    // AUTHENTICATION
    // ==========================================

    // LOGIN (Mock - accepts any credentials)
    else if (pathname === '/api/v1/auth/login' && req.method === 'POST') {
        const body = await parseBody(req);

        // Mock login - accepts ANY credentials
        sendJSON(res, 200, {
            success: true,
            message: 'Login successful',
            data: {
                accessToken: 'mock-jwt-token-' + Date.now(),
                user: {
                    id: 1,
                    username: body.username || 'admin',
                    firstName: 'Admin',
                    lastName: 'User',
                    email: 'admin@edusphere.com',
                    role: body.role || 'admin'
                }
            }
        });
    }

    // ==========================================
    // EXAM ENDPOINTS
    // ==========================================

    // GET ALL EXAMS
    else if (pathname === '/api/v1/exams' && req.method === 'GET') {
        sendJSON(res, 200, {
            success: true,
            data: {
                exams: examsDB,
                total: examsDB.length
            }
        });
    }

    // GET SINGLE EXAM
    else if (pathname.match(/^\/api\/v1\/exams\/(\d+)$/) && req.method === 'GET') {
        const id = parseInt(pathname.split('/').pop());
        const exam = examsDB.find(e => e.id === id);

        if (exam) {
            sendJSON(res, 200, { success: true, data: exam });
        } else {
            sendJSON(res, 404, { success: false, message: 'Exam not found' });
        }
    }

    // CREATE EXAM
    else if (pathname === '/api/v1/exams' && req.method === 'POST') {
        const body = await parseBody(req);

        const newExam = {
            id: examsDB.length + 1,
            exam_code: `EX${String(examsDB.length + 1).padStart(3, '0')}`,
            exam_name: body.exam_name,
            subject: body.subject,
            class_name: body.class_name,
            exam_date: body.exam_date,
            duration_minutes: parseInt(body.duration_minutes),
            total_marks: parseInt(body.total_marks) || 100,
            passing_marks: parseInt(body.passing_marks) || 40,
            term: body.term,
            academic_year: body.academic_year || '2025-2026',
            status: 'scheduled',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        examsDB.push(newExam);

        sendJSON(res, 201, {
            success: true,
            message: 'Exam created successfully',
            data: newExam
        });
    }

    // UPDATE EXAM
    else if (pathname.match(/^\/api\/v1\/exams\/(\d+)$/) && req.method === 'PUT') {
        const id = parseInt(pathname.split('/').pop());
        const body = await parseBody(req);

        const examIndex = examsDB.findIndex(e => e.id === id);

        if (examIndex !== -1) {
            examsDB[examIndex] = {
                ...examsDB[examIndex],
                exam_name: body.exam_name || examsDB[examIndex].exam_name,
                subject: body.subject || examsDB[examIndex].subject,
                class_name: body.class_name || examsDB[examIndex].class_name,
                exam_date: body.exam_date || examsDB[examIndex].exam_date,
                duration_minutes: body.duration_minutes || examsDB[examIndex].duration_minutes,
                updated_at: new Date().toISOString()
            };

            sendJSON(res, 200, {
                success: true,
                message: 'Exam updated successfully',
                data: examsDB[examIndex]
            });
        } else {
            sendJSON(res, 404, { success: false, message: 'Exam not found' });
        }
    }

    // DELETE EXAM
    else if (pathname.match(/^\/api\/v1\/exams\/(\d+)$/) && req.method === 'DELETE') {
        const id = parseInt(pathname.split('/').pop());
        const examIndex = examsDB.findIndex(e => e.id === id);

        if (examIndex !== -1) {
            examsDB.splice(examIndex, 1);
            sendJSON(res, 200, {
                success: true,
                message: 'Exam deleted successfully'
            });
        } else {
            sendJSON(res, 404, { success: false, message: 'Exam not found' });
        }
    }

    // ==========================================
    // RESULT ENDPOINTS
    // ==========================================

    // GET ALL RESULTS
    else if (pathname === '/api/v1/results' && req.method === 'GET') {
        const examId = query.exam_id;
        let filteredResults = resultsDB;

        if (examId) {
            filteredResults = resultsDB.filter(r => r.exam_id === parseInt(examId));
        }

        sendJSON(res, 200, {
            success: true,
            data: {
                results: filteredResults,
                total: filteredResults.length
            }
        });
    }

    // UPLOAD/CREATE RESULT
    else if (pathname === '/api/v1/results' && req.method === 'POST') {
        const body = await parseBody(req);

        const percentage = (body.marks_obtained / body.total_marks) * 100;
        const grade = calculateGrade(percentage);

        const newResult = {
            id: resultsDB.length + 1,
            result_code: `RES${String(resultsDB.length + 1).padStart(3, '0')}`,
            exam_id: parseInt(body.exam_id),
            student_id: body.student_id,
            student_name: body.student_name,
            marks_obtained: parseFloat(body.marks_obtained),
            total_marks: parseInt(body.total_marks),
            percentage: parseFloat(percentage.toFixed(2)),
            grade: grade,
            remarks: body.remarks || '',
            status: body.status || 'draft',
            created_at: new Date().toISOString(),
            published_at: body.status === 'published' ? new Date().toISOString() : null
        };

        resultsDB.push(newResult);

        sendJSON(res, 201, {
            success: true,
            message: 'Result uploaded successfully',
            data: newResult
        });
    }

    // UPDATE RESULT
    else if (pathname.match(/^\/api\/v1\/results\/(\d+)$/) && req.method === 'PUT') {
        const id = parseInt(pathname.split('/').pop());
        const body = await parseBody(req);

        const resultIndex = resultsDB.findIndex(r => r.id === id);

        if (resultIndex !== -1) {
            const percentage = (body.marks_obtained / body.total_marks) * 100;
            const grade = calculateGrade(percentage);

            resultsDB[resultIndex] = {
                ...resultsDB[resultIndex],
                marks_obtained: parseFloat(body.marks_obtained),
                total_marks: parseInt(body.total_marks),
                percentage: parseFloat(percentage.toFixed(2)),
                grade: grade,
                remarks: body.remarks || resultsDB[resultIndex].remarks,
                status: body.status || resultsDB[resultIndex].status,
                updated_at: new Date().toISOString()
            };

            sendJSON(res, 200, {
                success: true,
                message: 'Result updated successfully',
                data: resultsDB[resultIndex]
            });
        } else {
            sendJSON(res, 404, { success: false, message: 'Result not found' });
        }
    }

    // PUBLISH RESULT
    else if (pathname.match(/^\/api\/v1\/results\/(\d+)\/publish$/) && req.method === 'POST') {
        const id = parseInt(pathname.split('/')[4]);
        const resultIndex = resultsDB.findIndex(r => r.id === id);

        if (resultIndex !== -1) {
            resultsDB[resultIndex].status = 'published';
            resultsDB[resultIndex].published_at = new Date().toISOString();

            sendJSON(res, 200, {
                success: true,
                message: 'Result published successfully',
                data: resultsDB[resultIndex]
            });
        } else {
            sendJSON(res, 404, { success: false, message: 'Result not found' });
        }
    }

    // ==========================================
    // PIN VALIDATION & RESULT CHECKER
    // ==========================================

    // CHECK RESULT WITH PIN
    else if (pathname === '/api/v1/results/check' && req.method === 'POST') {
        const body = await parseBody(req);
        const { student_id, pin_code, exam_id } = body;

        // Validate input
        if (!student_id || !pin_code) {
            sendJSON(res, 400, {
                success: false,
                message: 'Student ID and PIN are required'
            });
            return;
        }

        // Find PIN
        const pin = pinsDB.find(p =>
            p.pin_code === pin_code &&
            p.student_id === student_id &&
            p.is_active === true
        );

        if (!pin) {
            sendJSON(res, 401, {
                success: false,
                message: 'Invalid PIN or Student ID'
            });
            return;
        }

        // Check PIN expiry
        if (pin.valid_until && new Date(pin.valid_until) < new Date()) {
            sendJSON(res, 401, {
                success: false,
                message: 'PIN has expired'
            });
            return;
        }

        // Check usage limit
        if (pin.current_usage_count >= pin.max_usage_count) {
            sendJSON(res, 403, {
                success: false,
                message: 'PIN usage limit exceeded'
            });
            return;
        }

        // Find student
        const student = studentsDB.find(s => s.student_id === student_id);
        if (!student) {
            sendJSON(res, 404, {
                success: false,
                message: 'Student not found'
            });
            return;
        }

        // Find results
        let results = resultsDB.filter(r =>
            r.student_id === student_id &&
            r.status === 'published'
        );

        if (exam_id) {
            results = results.filter(r => r.exam_id === parseInt(exam_id));
        }

        if (results.length === 0) {
            sendJSON(res, 404, {
                success: false,
                message: 'No published results found for this student'
            });
            return;
        }

        // Update PIN usage
        pin.current_usage_count += 1;
        pin.last_used_at = new Date().toISOString();
        if (!pin.first_used_at) {
            pin.first_used_at = new Date().toISOString();
        }

        // Get exam details for each result
        const resultsWithExam = results.map(result => {
            const exam = examsDB.find(e => e.id === result.exam_id);
            return {
                ...result,
                exam_details: exam
            };
        });

        sendJSON(res, 200, {
            success: true,
            message: 'Results retrieved successfully',
            data: {
                student: student,
                results: resultsWithExam,
                pin_info: {
                    remaining_checks: pin.max_usage_count - pin.current_usage_count
                }
            }
        });
    }

    // ==========================================
    // PIN MANAGEMENT
    // ==========================================

    // GENERATE PIN
    else if (pathname === '/api/v1/pins/generate' && req.method === 'POST') {
        const body = await parseBody(req);

        const newPIN = {
            id: pinsDB.length + 1,
            pin_code: generatePIN(),
            student_id: body.student_id,
            exam_id: body.exam_id || null,
            max_usage_count: body.max_usage_count || 5,
            current_usage_count: 0,
            is_active: true,
            valid_from: new Date().toISOString(),
            valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            generated_at: new Date().toISOString()
        };

        pinsDB.push(newPIN);

        sendJSON(res, 201, {
            success: true,
            message: 'PIN generated successfully',
            data: newPIN
        });
    }

    // BULK PIN GENERATION
    else if (pathname === '/api/v1/pins/bulk-generate' && req.method === 'POST') {
        const body = await parseBody(req);
        const studentIds = body.student_ids || [];

        const generatedPINs = studentIds.map(student_id => {
            const newPIN = {
                id: pinsDB.length + 1,
                pin_code: generatePIN(),
                student_id: student_id,
                exam_id: body.exam_id || null,
                max_usage_count: body.max_usage_count || 5,
                current_usage_count: 0,
                is_active: true,
                valid_from: new Date().toISOString(),
                valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                generated_at: new Date().toISOString()
            };
            pinsDB.push(newPIN);
            return newPIN;
        });

        sendJSON(res, 201, {
            success: true,
            message: `${generatedPINs.length} PINs generated successfully`,
            data: generatedPINs
        });
    }

    // GET PINS
    else if (pathname === '/api/v1/pins' && req.method === 'GET') {
        const studentId = query.student_id;
        let filteredPINs = pinsDB;

        if (studentId) {
            filteredPINs = pinsDB.filter(p => p.student_id === studentId);
        }

        sendJSON(res, 200, {
            success: true,
            data: {
                pins: filteredPINs,
                total: filteredPINs.length
            }
        });
    }

    // ==========================================
    // STUDENTS ENDPOINT (for autocomplete, etc.)
    // ==========================================
    else if (pathname === '/api/v1/students' && req.method === 'GET') {
        sendJSON(res, 200, {
            success: true,
            data: {
                students: studentsDB,
                total: studentsDB.length
            }
        });
    }

    // ==========================================
    // DASHBOARD STATS (from previous implementation)
    // ==========================================
    else if (pathname === '/api/v1/dashboard/stats' && req.method === 'GET') {
        sendJSON(res, 200, {
            success: true,
            data: {
                totalStudents: studentsDB.length,
                totalTeachers: 86,
                totalClasses: 24,
                attendanceRate: 92,
                pendingRequests: 24,
                totalExams: examsDB.length,
                publishedResults: resultsDB.filter(r => r.status === 'published').length
            }
        });
    }

    // ==========================================
    // ADMISSION PORTAL ENDPOINTS
    // ==========================================

    // Initialize admissions database
    if (!global.admissionsDB) {
        global.admissionsDB = [];
    }

    // SUBMIT ADMISSION APPLICATION
    else if (pathname === '/api/v1/admissions' && req.method === 'POST') {
        const body = await parseBody(req);

        const newApplication = {
            id: global.admissionsDB.length + 1,
            applicationId: `APP-${new Date().getFullYear()}-${String(global.admissionsDB.length + 1).padStart(4, '0')}`,
            firstName: body.firstName,
            lastName: body.lastName,
            dateOfBirth: body.dateOfBirth,
            gender: body.gender,
            email: body.email,
            phone: body.phone,
            address: body.address,
            city: body.city,
            country: body.country,
            classApplying: body.classApplying,
            previousSchool: body.previousSchool || 'N/A',
            guardianName: body.guardianName,
            guardianPhone: body.guardianPhone,
            paymentMethod: body.paymentMethod,
            totalAmount: 60.00,
            paymentStatus: 'paid',
            status: 'pending_review',
            submittedAt: new Date().toISOString()
        };

        global.admissionsDB.push(newApplication);

        sendJSON(res, 201, {
            success: true,
            message: 'Application submitted successfully',
            data: {
                applicationId: newApplication.applicationId,
                status: newApplication.status
            }
        });
    }

    // GET ALL APPLICATIONS
    else if (pathname === '/api/v1/admissions' && req.method === 'GET') {
        sendJSON(res, 200, {
            success: true,
            data: {
                applications: global.admissionsDB || [],
                total: (global.admissionsDB || []).length
            }
        });
    }

    // ==========================================
    // 404 NOT FOUND
    // ==========================================
    else {
        sendJSON(res, 404, {
            success: false,
            message: 'Route not found',
            path: pathname
        });
    }
});

// ==========================================
// START SERVER
// ==========================================

server.listen(PORT, () => {
    console.log('\n╔════════════════════════════════════════════════╗');
    console.log('║    🎓 EduSphere Exam Management API          ║');
    console.log('╚════════════════════════════════════════════════╝\n');
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}\n`);
    console.log('📍 Available endpoints:');
    console.log(`   🔗 Health:          http://localhost:${PORT}/health`);
    console.log(`   📝 Exams:          http://localhost:${PORT}/api/v1/exams`);
    console.log(`   📊 Results:        http://localhost:${PORT}/api/v1/results`);
    console.log(`   🔑 Result Checker: http://localhost:${PORT}/api/v1/results/check`);
    console.log(`   🎟️  PINs:           http://localhost:${PORT}/api/v1/pins`);
    console.log(`   👨‍🎓 Students:       http://localhost:${PORT}/api/v1/students\n`);
    console.log('✨ Exam Management System Ready!\n');
});
