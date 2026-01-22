-- ========================================
-- EduSphere Exam Management System
-- Complete Database Schema (PostgreSQL/SQLite Compatible)
-- ========================================

-- ==========================================
-- 1. STUDENTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    class_id INTEGER,
    roll_number VARCHAR(20),
    admission_date DATE,
    is_active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 2. EXAMS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS exams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exam_code VARCHAR(50) UNIQUE NOT NULL,
    exam_name VARCHAR(255) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    class_name VARCHAR(50) NOT NULL,
    exam_date DATE NOT NULL,
    duration_minutes INTEGER NOT NULL,
    total_marks INTEGER DEFAULT 100,
    passing_marks INTEGER DEFAULT 40,
    term VARCHAR(50),
    academic_year VARCHAR(20),
    instructions TEXT,
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, ongoing, completed, cancelled
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 3. EXAM RESULTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS exam_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    result_code VARCHAR(50) UNIQUE NOT NULL,
    exam_id INTEGER NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    
    -- Score Details
    marks_obtained DECIMAL(5,2) NOT NULL,
    total_marks INTEGER NOT NULL,
    percentage DECIMAL(5,2),
    grade VARCHAR(5),
    
    -- Additional Info
    remarks TEXT,
    attendance_status VARCHAR(20) DEFAULT 'present', -- present, absent, exempted
    
    -- Publishing Control
    status VARCHAR(20) DEFAULT 'draft', -- draft, published
    published_at TIMESTAMP,
    published_by VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- ==========================================
-- 4. SUBJECT SCORES TABLE (For Multi-Subject Exams)
-- ==========================================
CREATE TABLE IF NOT EXISTS subject_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    result_id INTEGER NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    marks_obtained DECIMAL(5,2) NOT NULL,
    total_marks INTEGER NOT NULL,
    grade VARCHAR(5),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (result_id) REFERENCES exam_results(id) ON DELETE CASCADE
);

-- ==========================================
-- 5. RESULT PINS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS result_pins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pin_code VARCHAR(20) UNIQUE NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    exam_id INTEGER,
    
    -- PIN Usage Control
    max_usage_count INTEGER DEFAULT 3,
    current_usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    
    -- Validity Period
    valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP,
    
    -- Tracking
    first_used_at TIMESTAMP,
    last_used_at TIMESTAMP,
    last_used_ip VARCHAR(45),
    
    -- Generation Info
    generated_by VARCHAR(100),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Metadata
    notes TEXT,
    
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE SET NULL
);

-- ==========================================
-- 6. PIN USAGE LOG TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS pin_usage_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pin_id INTEGER NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    exam_id INTEGER,
    
    -- Usage Details
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    -- Result
    success BOOLEAN DEFAULT 1,
    error_message TEXT,
    
    FOREIGN KEY (pin_id) REFERENCES result_pins(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE SET NULL
);

-- ==========================================
-- 7. GRADING SCALE TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS grading_scale (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    grade VARCHAR(5) NOT NULL,
    min_percentage DECIMAL(5,2) NOT NULL,
    max_percentage DECIMAL(5,2) NOT NULL,
    description VARCHAR(100),
    grade_point DECIMAL(3,2),
    is_passing BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 8. RESULT NOTIFICATIONS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS result_notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    result_id INTEGER NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    
    -- Notification Details
    notification_type VARCHAR(20) NOT NULL, -- email, sms, whatsapp
    recipient VARCHAR(255) NOT NULL,
    message TEXT,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending', -- pending, sent, failed
    sent_at TIMESTAMP,
    error_message TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (result_id) REFERENCES exam_results(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- ==========================================
-- 9. INDEXES FOR PERFORMANCE
-- ==========================================

-- Students indexes
CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class_id);

-- Exams indexes
CREATE INDEX IF NOT EXISTS idx_exams_code ON exams(exam_code);
CREATE INDEX IF NOT EXISTS idx_exams_date ON exams(exam_date);
CREATE INDEX IF NOT EXISTS idx_exams_status ON exams(status);

-- Results indexes
CREATE INDEX IF NOT EXISTS idx_results_exam ON exam_results(exam_id);
CREATE INDEX IF NOT EXISTS idx_results_student ON exam_results(student_id);
CREATE INDEX IF NOT EXISTS idx_results_status ON exam_results(status);

-- PINs indexes
CREATE INDEX IF NOT EXISTS idx_pins_code ON result_pins(pin_code);
CREATE INDEX IF NOT EXISTS idx_pins_student ON result_pins(student_id);
CREATE INDEX IF NOT EXISTS idx_pins_active ON result_pins(is_active);

-- ==========================================
-- 10. INSERT DEFAULT GRADING SCALE
-- ==========================================
INSERT INTO grading_scale (grade, min_percentage, max_percentage, description, grade_point, is_passing) VALUES
('A+', 90.00, 100.00, 'Outstanding', 4.00, 1),
('A', 80.00, 89.99, 'Excellent', 3.70, 1),
('B+', 70.00, 79.99, 'Very Good', 3.30, 1),
('B', 60.00, 69.99, 'Good', 3.00, 1),
('C+', 50.00, 59.99, 'Satisfactory', 2.70, 1),
('C', 40.00, 49.99, 'Pass', 2.00, 1),
('F', 0.00, 39.99, 'Fail', 0.00, 0);

-- ==========================================
-- 11. SAMPLE DATA (For Testing)
-- ==========================================

-- Insert sample students
INSERT INTO students (student_id, first_name, last_name, email, class_id, roll_number) VALUES
('STU001', 'Sarah', 'Johnson', 'sarah.j@example.com', 10, '101'),
('STU002', 'Michael', 'Chen', 'michael.c@example.com', 10, '102'),
('STU003', 'Emily', 'Rodriguez', 'emily.r@example.com', 9, '201');

-- Insert sample exams
INSERT INTO exams (exam_code, exam_name, subject, class_name, exam_date, duration_minutes, total_marks, term, academic_year, status) VALUES
('EX001', 'Midterm Exam', 'Mathematics', 'Grade 10A', '2026-02-15', 120, 100, 'Midterm', '2025-2026', 'scheduled'),
('EX002', 'Final Exam', 'Science', 'Grade 9B', '2026-03-20', 180, 100, 'Final', '2025-2026', 'scheduled'),
('EX003', 'Unit Test 1', 'English', 'Grade 10A', '2026-01-25', 60, 50, 'Unit Test', '2025-2026', 'completed');

-- Insert sample results
INSERT INTO exam_results (result_code, exam_id, student_id, marks_obtained, total_marks, percentage, grade, status) VALUES
('RES001', 3, 'STU001', 42.5, 50, 85.00, 'A', 'published'),
('RES002', 3, 'STU002', 38.0, 50, 76.00, 'B+', 'published');

-- Insert sample PINs
INSERT INTO result_pins (pin_code, student_id, exam_id, max_usage_count, current_usage_count, is_active) VALUES
('PIN-2026-0001', 'STU001', 3, 5, 0, 1),
('PIN-2026-0002', 'STU002', 3, 5, 0, 1),
('PIN-2026-0003', 'STU003', NULL, 10, 0, 1);

-- ==========================================
-- END OF SCHEMA
-- ==========================================
