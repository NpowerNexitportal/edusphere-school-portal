/**
 * ========================================
 * Exam Management Frontend Components
 * Modal, Forms, and CRUD Operations
 * ========================================
 */

// ==========================================
// 1. EDIT EXAM MODAL
// ==========================================

/**
 * Show Edit Exam Modal
 * @param {number} examId - ID of exam to edit
 */
async function openEditExamModal(examId) {
    try {
        // Fetch exam data
        const response = await fetch(`http://localhost:5000/api/v1/exams/${examId}`);
        const result = await response.json();

        if (!result.success) {
            showToast('Error loading exam data', 'error');
            return;
        }

        const exam = result.data;

        // Create modal HTML
        const modalHTML = `
            <div class="modal-overlay" id="editExamModal">
                <div class="modal-content animate-slide-up">
                    <div class="modal-header">
                        <h2><i class="fas fa-edit"></i> Edit Exam</h2>
                        <button class="modal-close" onclick="closeEditExamModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <form id="editExamForm" class="modal-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="edit_exam_name">Exam Name <span class="required">*</span></label>
                                <input type="text" id="edit_exam_name" name="exam_name" value="${exam.exam_name}" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="edit_subject">Subject <span class="required">*</span></label>
                                <input type="text" id="edit_subject" name="subject" value="${exam.subject}" required>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="edit_class_name">Class <span class="required">*</span></label>
                                <input type="text" id="edit_class_name" name="class_name" value="${exam.class_name}" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="edit_exam_date">Exam Date <span class="required">*</span></label>
                                <input type="date" id="edit_exam_date" name="exam_date" value="${exam.exam_date}" required>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="edit_duration">Duration (minutes) <span class="required">*</span></label>
                                <input type="number" id="edit_duration" name="duration_minutes" value="${exam.duration_minutes}" required min="30">
                            </div>
                            
                            <div class="form-group">
                                <label for="edit_total_marks">Total Marks</label>
                                <input type="number" id="edit_total_marks" name="total_marks" value="${exam.total_marks || 100}" min="1">
                            </div>
                        </div>
                        
                        <div class="modal-footer">
                            <button type="button" class="btn-secondary" onclick="closeEditExamModal()">
                                Cancel
                            </button>
                            <button type="submit" class="btn-primary">
                                <i class="fas fa-save"></i> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Add modal to DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Attach form submit handler
        document.getElementById('editExamForm').addEventListener('submit', (e) => {
            e.preventDefault();
            saveExamChanges(examId);
        });

        // Show modal with animation
        setTimeout(() => {
            document.getElementById('editExamModal').classList.add('active');
        }, 10);

    } catch (error) {
        console.error('Error opening edit modal:', error);
        showToast('Failed to open edit form', 'error');
    }
}

/**
 * Close Edit Exam Modal
 */
function closeEditExamModal() {
    const modal = document.getElementById('editExamModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

/**
 * Save Exam Changes
 * @param {number} examId - ID of exam being updated
 */
async function saveExamChanges(examId) {
    const form = document.getElementById('editExamForm');
    const formData = new FormData(form);

    const examData = {
        exam_name: formData.get('exam_name'),
        subject: formData.get('subject'),
        class_name: formData.get('class_name'),
        exam_date: formData.get('exam_date'),
        duration_minutes: parseInt(formData.get('duration_minutes')),
        total_marks: parseInt(formData.get('total_marks'))
    };

    // Validate
    if (!examData.exam_name || !examData.subject || !examData.class_name || !examData.exam_date) {
        showToast('Please fill all required fields', 'error');
        return;
    }

    try {
        // Show loading state
        const saveBtn = form.querySelector('button[type="submit"]');
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

        // Send to backend
        const response = await fetch(`http://localhost:5000/api/v1/exams/${examId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(examData)
        });

        const result = await response.json();

        if (result.success) {
            showToast('Exam updated successfully!', 'success');
            closeEditExamModal();

            // Refresh the exams page
            if (window.location.hash === '#exams') {
                loadExamsPage();
            }
        } else {
            showToast(result.message || 'Failed to update exam', 'error');
        }

    } catch (error) {
        console.error('Error saving exam:', error);
        showToast('Network error. Please try again.', 'error');
    }
}

// ==========================================
// 2. RESULT UPLOAD MODAL
// ==========================================

/**
 * Open Result Upload Modal
 * @param {number} examId - Optional exam ID to pre-select
 */
async function openResultUploadModal(examId = null) {
    try {
        // Fetch exams and students for dropdowns
        const [examsRes, studentsRes] = await Promise.all([
            fetch('http://localhost:5000/api/v1/exams'),
            fetch('http://localhost:5000/api/v1/students')
        ]);

        const examsData = await examsRes.json();
        const studentsData = await studentsRes.json();

        const exams = examsData.data.exams || [];
        const students = studentsData.data.students || [];

        // Build exam options
        const examOptions = exams.map(exam =>
            `<option value="${exam.id}" ${exam.id === examId ? 'selected' : ''}>${exam.exam_name} - ${exam.subject} (${exam.class_name})</option>`
        ).join('');

        // Build student options
        const studentOptions = students.map(student =>
            `<option value="${student.student_id}">${student.student_id} - ${student.first_name} ${student.last_name} (${student.class_name})</option>`
        ).join('');

        const modalHTML = `
            <div class="modal-overlay" id="resultUploadModal">
                <div class="modal-content large animate-slide-up">
                    <div class="modal-header">
                        <h2><i class="fas fa-upload"></i> Upload Result</h2>
                        <button class="modal-close" onclick="closeResultUploadModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <form id="resultUploadForm" class="modal-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="result_exam">Exam <span class="required">*</span></label>
                                <select id="result_exam" name="exam_id" required>
                                    <option value="">Select Exam</option>
                                    ${examOptions}
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="result_student">Student <span class="required">*</span></label>
                                <select id="result_student" name="student_id" required>
                                    <option value="">Select Student</option>
                                    ${studentOptions}
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="result_marks">Marks Obtained <span class="required">*</span></label>
                                <input type="number" id="result_marks" name="marks_obtained" required min="0" step="0.5">
                            </div>
                            
                            <div class="form-group">
                                <label for="result_total">Total Marks <span class="required">*</span></label>
                                <input type="number" id="result_total" name="total_marks" value="100" required min="1">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="result_remarks">Remarks</label>
                            <textarea id="result_remarks" name="remarks" rows="3" placeholder="Optional comments about performance"></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="result_publish" name="publish">
                                <span>Publish result immediately</span>
                            </label>
                            <small class="form-hint">If unchecked, result will be saved as draft</small>
                        </div>
                        
                        <div class="modal-footer">
                            <button type="button" class="btn-secondary" onclick="closeResultUploadModal()">
                                Cancel
                            </button>
                            <button type="submit" class="btn-primary">
                                <i class="fas fa-save"></i> Save Result
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Attach form submit
        document.getElementById('resultUploadForm').addEventListener('submit', (e) => {
            e.preventDefault();
            uploadResult();
        });

        // Auto-populate student name
        document.getElementById('result_student').addEventListener('change', function () {
            const selectedOption = this.options[this.selectedIndex];
            const studentName = selectedOption.textContent.split(' - ')[1].split(' (')[0];
            document.getElementById('resultUploadForm').dataset.studentName = studentName;
        });

        setTimeout(() => {
            document.getElementById('resultUploadModal').classList.add('active');
        }, 10);

    } catch (error) {
        console.error('Error opening result upload modal:', error);
        showToast('Failed to load form data', 'error');
    }
}

/**
 * Close Result Upload Modal
 */
function closeResultUploadModal() {
    const modal = document.getElementById('resultUploadModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

/**
 * Upload Result
 */
async function uploadResult() {
    const form = document.getElementById('resultUploadForm');
    const formData = new FormData(form);

    const resultData = {
        exam_id: formData.get('exam_id'),
        student_id: formData.get('student_id'),
        student_name: form.dataset.studentName || 'Unknown',
        marks_obtained: parseFloat(formData.get('marks_obtained')),
        total_marks: parseInt(formData.get('total_marks')),
        remarks: formData.get('remarks') || '',
        status: formData.get('publish') ? 'published' : 'draft'
    };

    try {
        const saveBtn = form.querySelector('button[type="submit"]');
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

        const response = await fetch('http://localhost:5000/api/v1/results', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(resultData)
        });

        const result = await response.json();

        if (result.success) {
            showToast(`Result ${resultData.status === 'published' ? 'published' : 'saved as draft'} successfully!`, 'success');
            closeResultUploadModal();

            // Refresh if on results page
            if (typeof loadResultsPage === 'function') {
                loadResultsPage();
            }
        } else {
            showToast(result.message || 'Failed to save result', 'error');
            saveBtn.disabled = false;
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Result';
        }

    } catch (error) {
        console.error('Error uploading result:', error);
        showToast('Network error. Please try again.', 'error');
    }
}

// ==========================================
// 3. DELETE CONFIRMATION
// ==========================================

/**
 * Delete Exam with Confirmation
 * @param {number} examId - ID of exam to delete
 * @param {string} examName - Name of exam
 */
function deleteExam(examId, examName) {
    if (!confirm(`Are you sure you want to delete "${examName}"?\n\nThis action cannot be undone.`)) {
        return;
    }

    fetch(`http://localhost:5000/api/v1/exams/${examId}`, {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                showToast('Exam deleted successfully', 'success');
                loadExamsPage();
            } else {
                showToast(result.message || 'Failed to delete exam', 'error');
            }
        })
        .catch(error => {
            console.error('Error deleting exam:', error);
            showToast('Network error', 'error');
        });
}

// ==========================================
// 4. TOAST NOTIFICATIONS
// ==========================================

/**
 * Show Toast Notification
 * @param {string} message - Message to display
 * @param {string} type - 'success', 'error', 'warning', 'info'
 */
function showToast(message, type = 'info') {
    // Remove existing toasts
    document.querySelectorAll('.toast-notification').forEach(t => t.remove());

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        border-left: 4px solid ${colors[type]};
    `;

    toast.innerHTML = `
        <i class="fas ${icons[type]}" style="color: ${colors[type]}; font-size: 20px;"></i>
        <span style="color: #1f2937; font-weight: 500;">${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; cursor: pointer; margin-left: 12px; color: #9ca3af;">
            <i class="fas fa-times"></i>
        </button>
    `;

    document.body.appendChild(toast);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ==========================================
// 5. LOAD EXAMS PAGE (with edit buttons)
// ==========================================

/**
 * Load Exams Page with Data
 */
async function loadExamsPage() {
    try {
        const response = await fetch('http://localhost:5000/api/v1/exams');
        const result = await response.json();

        if (!result.success) {
            console.error('Failed to load exams');
            return;
        }

        const exams = result.data.exams;

        // Build table HTML
        let tableHTML = `
            <div class="page-header">
                <h1><i class="fas fa-file-alt"></i> Examinations</h1>
                <button class="btn-primary" onclick="openCreateExamModal()">
                    <i class="fas fa-plus"></i> Create Exam
                </button>
            </div>
            
            <div class="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>Exam Code</th>
                            <th>Exam Name</th>
                            <th>Subject</th>
                            <th>Class</th>
                            <th>Date</th>
                            <th>Duration</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        exams.forEach(exam => {
            const statusColors = {
                scheduled: 'blue',
                ongoing: 'orange',
                completed: 'green',
                cancelled: 'red'
            };

            tableHTML += `
                <tr>
                    <td>${exam.exam_code}</td>
                    <td>${exam.exam_name}</td>
                    <td>${exam.subject}</td>
                    <td>${exam.class_name}</td>
                    <td>${new Date(exam.exam_date).toLocaleDateString()}</td>
                    <td>${exam.duration_minutes} min</td>
                    <td><span style="color: ${statusColors[exam.status] || 'gray'}">${exam.status}</span></td>
                    <td>
                        <button class="action-btn edit" onclick="openEditExamModal(${exam.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn view" onclick="openResultUploadModal(${exam.id})" title="Upload Results">
                            <i class="fas fa-upload"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteExam(${exam.id}, '${exam.exam_name}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        tableHTML += `
                    </tbody>
                </table>
            </div>
        `;

        // Update page content
        const examPage = document.getElementById('page-exams');
        if (examPage) {
            examPage.innerHTML = tableHTML;
        }

    } catch (error) {
        console.error('Error loading exams:', error);
        showToast('Failed to load exams', 'error');
    }
}

// ==========================================
// 6. CSS ANIMATIONS (Add to document head)
// ==========================================

const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(styleSheet);

// Export functions for global use
if (typeof window !== 'undefined') {
    window.openEditExamModal = openEditExamModal;
    window.closeEditExamModal = closeEditExamModal;
    window.openResultUploadModal = openResultUploadModal;
    window.closeResultUploadModal = closeResultUploadModal;
    window.deleteExam = deleteExam;
    window.showToast = showToast;
    window.loadExamsPage = loadExamsPage;
}

console.log('✅ Exam Management Components Loaded');
