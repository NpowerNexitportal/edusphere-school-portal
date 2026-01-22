/**
 * ========================================
 * EduSphere SPA Router & Navigation System
 * ========================================
 * Handles all menu navigation, page transitions,
 * breadcrumb updates, and content loading
 */

// ==========================================
// 1. PAGE CONTENT TEMPLATES
// ==========================================

const pageContent = {
    dashboard: `
        <!-- Dashboard content is already in HTML -->
    `,

    students: `
        <div class="page-title">
            <h1><i class="fas fa-users"></i> Students Management</h1>
            <p>Manage student records, enrollments, and academic information</p>
        </div>

        <div class="stats-container" style="margin-bottom: 30px;">
            <div class="stat-card">
                <div class="stat-header">
                    <div>
                        <div class="stat-value" id="totalStudents">1,248</div>
                        <div class="stat-label">Total Students</div>
                    </div>
                    <div class="stat-icon icon-blue">
                        <i class="fas fa-user-graduate"></i>
                    </div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <div>
                        <div class="stat-value">145</div>
                        <div class="stat-label">New This Month</div>
                    </div>
                    <div class="stat-icon icon-green">
                        <i class="fas fa-user-plus"></i>
                    </div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <div>
                        <div class="stat-value">24</div>
                        <div class="stat-label">Classes</div>
                    </div>
                    <div class="stat-icon icon-orange">
                        <i class="fas fa-door-open"></i>
                    </div>
                </div>
            </div>
        </div>

        <div class="data-table">
            <table>
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Class</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>STU001</td>
                        <td>Sarah Johnson</td>
                        <td>Grade 10A</td>
                        <td>sarah.j@example.com</td>
                        <td><span style="color: var(--success);">Active</span></td>
                        <td>
                            <button class="action-btn view"><i class="fas fa-eye"></i> View</button>
                            <button class="action-btn edit"><i class="fas fa-edit"></i> Edit</button>
                        </td>
                    </tr>
                    <tr>
                        <td>STU002</td>
                        <td>Michael Chen</td>
                        <td>Grade 10A</td>
                        <td>michael.c@example.com</td>
                        <td><span style="color: var(--success);">Active</span></td>
                        <td>
                            <button class="action-btn view"><i class="fas fa-eye"></i> View</button>
                            <button class="action-btn edit"><i class="fas fa-edit"></i> Edit</button>
                        </td>
                    </tr>
                    <tr>
                        <td>STU003</td>
                        <td>Emily Rodriguez</td>
                        <td>Grade 9B</td>
                        <td>emily.r@example.com</td>
                        <td><span style="color: var(--warning);">On Leave</span></td>
                        <td>
                            <button class="action-btn view"><i class="fas fa-eye"></i> View</button>
                            <button class="action-btn edit"><i class="fas fa-edit"></i> Edit</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `,

    teachers: `
        <div class="page-title">
            <h1><i class="fas fa-chalkboard-teacher"></i> Teachers Management</h1>
            <p>Manage faculty information, assignments, and schedules</p>
        </div>

        <div class="stats-container" style="margin-bottom: 30px;">
            <div class="stat-card">
                <div class="stat-header">
                    <div>
                        <div class="stat-value">86</div>
                        <div class="stat-label">Total Teachers</div>
                    </div>
                    <div class="stat-icon icon-green">
                        <i class="fas fa-users"></i>
                    </div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <div>
                        <div class="stat-value">12</div>
                        <div class="stat-label">Departments</div>
                    </div>
                    <div class="stat-icon icon-blue">
                        <i class="fas fa-building"></i>
                    </div>
                </div>
            </div>
        </div>

        <div class="data-table">
            <table>
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Designation</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>EMP001</td>
                        <td>Dr. Robert Williams</td>
                        <td>Mathematics</td>
                        <td>Senior Teacher</td>
                        <td>r.williams@edusphere.com</td>
                        <td>
                            <button class="action-btn view"><i class="fas fa-eye"></i> View</button>
                            <button class="action-btn edit"><i class="fas fa-edit"></i> Edit</button>
                        </td>
                    </tr>
                    <tr>
                        <td>EMP002</td>
                        <td>Ms. Jennifer Davis</td>
                        <td>Science</td>
                        <td>Head of Department</td>
                        <td>j.davis@edusphere.com</td>
                        <td>
                            <button class="action-btn view"><i class="fas fa-eye"></i> View</button>
                            <button class="action-btn edit"><i class="fas fa-edit"></i> Edit</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `,

    classes: `
        <div class="page-title">
            <h1><i class="fas fa-book"></i> Classes Management</h1>
            <p>Manage classes, sections, and subject assignments</p>
        </div>

        <div class="stat-card" style="margin-bottom: 30px;">
            <div class="stat-header">
                <div>
                    <div class="stat-value">24</div>
                    <div class="stat-label">Active Classes</div>
                </div>
                <div class="stat-icon icon-blue">
                    <i class="fas fa-door-open"></i>
                </div>
            </div>
        </div>

        <div class="data-table">
            <table>
                <thead>
                    <tr>
                        <th>Class Name</th>
                        <th>Grade</th>
                        <th>Section</th>
                        <th>Students</th>
                        <th>Class Teacher</th>
                        <th>Room</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Grade 10A</td>
                        <td>10</td>
                        <td>A</td>
                        <td>42</td>
                        <td>Dr. Williams</td>
                        <td>101</td>
                        <td>
                            <button class="action-btn view"><i class="fas fa-eye"></i> View</button>
                            <button class="action-btn edit"><i class="fas fa-edit"></i> Edit</button>
                        </td>
                    </tr>
                    <tr>
                        <td>Grade 9B</td>
                        <td>9</td>
                        <td>B</td>
                        <td>38</td>
                        <td>Ms. Davis</td>
                        <td>202</td>
                        <td>
                            <button class="action-btn view"><i class="fas fa-eye"></i> View</button>
                            <button class="action-btn edit"><i class="fas fa-edit"></i> Edit</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `,

    attendance: `
        <div class="page-title">
            <h1><i class="fas fa-calendar-check"></i> Attendance Management</h1>
            <p>Track and manage student attendance records</p>
        </div>

        <div class="stats-container" style="margin-bottom: 30px;">
            <div class="stat-card">
                <div class="stat-header">
                    <div>
                        <div class="stat-value">92%</div>
                        <div class="stat-label">Overall Attendance</div>
                    </div>
                    <div class="stat-icon icon-green">
                        <i class="fas fa-check-circle"></i>
                    </div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <div>
                        <div class="stat-value">15</div>
                        <div class="stat-label">Absent Today</div>
                    </div>
                    <div class="stat-icon icon-orange">
                        <i class="fas fa-exclamation-circle"></i>
                    </div>
                </div>
            </div>
        </div>

        <div class="recent-activity">
            <div class="chart-header">
                <h3>Attendance Records - Today</h3>
            </div>
            <div class="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Class</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Sarah Johnson</td>
                            <td>Grade 10A</td>
                            <td>Today</td>
                            <td><span style="color: var(--success);">Present</span></td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>Michael Chen</td>
                            <td>Grade 10A</td>
                            <td>Today</td>
                            <td><span style="color: var(--success);">Present</span></td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>Emily Rodriguez</td>
                            <td>Grade 9B</td>
                            <td>Today</td>
                            <td><span style="color: var(--warning);">Absent</span></td>
                            <td>Sick leave</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,

    exams: `
        <div class="page-title">
            <h1><i class="fas fa-file-alt"></i> Examinations</h1>
            <p>Manage exams, grades, and assessments</p>
        </div>

        <div class="stats-container" style="margin-bottom: 30px;">
            <div class="stat-card">
                <div class="stat-header">
                    <div>
                        <div class="stat-value">8</div>
                        <div class="stat-label">Upcoming Exams</div>
                    </div>
                    <div class="stat-icon icon-blue">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <div>
                        <div class="stat-value">15</div>
                        <div class="stat-label">Pending Results</div>
                    </div>
                    <div class="stat-icon icon-orange">
                        <i class="fas fa-hourglass-half"></i>
                    </div>
                </div>
            </div>
        </div>

        <div class="recent-activity">
            <div class="chart-header">
                <h3>Upcoming Exams</h3>
            </div>
            <div class="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>Exam Name</th>
                            <th>Subject</th>
                            <th>Class</th>
                            <th>Date</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Midterm Exam</td>
                            <td>Mathematics</td>
                            <td>Grade 10A</td>
                            <td>Feb 15, 2026</td>
                            <td>2 hours</td>
                            <td>
                                <button class="action-btn edit"><i class="fas fa-edit"></i> Edit</button>
                            </td>
                        </tr>
                        <tr>
                            <td>Final Exam</td>
                            <td>Science</td>
                            <td>Grade 9B</td>
                            <td>March 20, 2026</td>
                            <td>3 hours</td>
                            <td>
                                <button class="action-btn edit"><i class="fas fa-edit"></i> Edit</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,

    fees: `
        <div class="page-title">
            <h1><i class="fas fa-money-bill-wave"></i> Fees Management</h1>
            <p>Manage tuition fees, payments, and transactions</p>
        </div>

        <div class="stats-container" style="margin-bottom: 30px;">
            <div class="stat-card">
                <div class="stat-header">
                    <div>
                        <div class="stat-value">$425K</div>
                        <div class="stat-label">Collected</div>
                    </div>
                    <div class="stat-icon icon-green">
                        <i class="fas fa-dollar-sign"></i>
                    </div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <div>
                        <div class="stat-value">$75K</div>
                        <div class="stat-label">Pending</div>
                    </div>
                    <div class="stat-icon icon-orange">
                        <i class="fas fa-clock"></i>
                    </div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-header">
                    <div>
                        <div class="stat-value">85%</div>
                        <div class="stat-label">Collection Rate</div>
                    </div>
                    <div class="stat-icon icon-blue">
                        <i class="fas fa-chart-pie"></i>
                    </div>
                </div>
            </div>
        </div>

        <div class="data-table">
            <table>
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Fee Type</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Due Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Sarah Johnson</td>
                        <td>Tuition</td>
                        <td>$1,200</td>
                        <td><span style="color: var(--success);">Paid</span></td>
                        <td>Jan 15, 2026</td>
                        <td>
                            <button class="action-btn view"><i class="fas fa-receipt"></i> Receipt</button>
                        </td>
                    </tr>
                    <tr>
                        <td>Michael Chen</td>
                        <td>Tuition</td>
                        <td>$1,200</td>
                        <td><span style="color: var(--warning);">Pending</span></td>
                        <td>Feb 1, 2026</td>
                        <td>
                            <button class="action-btn view"><i class="fas fa-exclamation"></i> Remind</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `,

    messages: `
        <div class="page-title">
            <h1><i class="fas fa-comments"></i> Messages</h1>
            <p>Communication hub for students, teachers, and parents</p>
        </div>

        <div class="stat-card" style="margin-bottom: 30px;">
            <div class="stat-header">
                <div>
                    <div class="stat-value">12</div>
                    <div class="stat-label">Unread Messages</div>
                </div>
                <div class="stat-icon icon-blue">
                    <i class="fas fa-envelope"></i>
                </div>
            </div>
        </div>

        <div class="recent-activity">
            <div class="chart-header">
                <h3>Recent Messages</h3>
            </div>
            <ul class="activity-list">
                <li class="activity-item">
                    <div class="activity-icon bg-primary">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="activity-content">
                        <h4>Parent Meeting Request</h4>
                        <p>From: Mrs. Johnson regarding Sarah's progress</p>
                    </div>
                    <div class="activity-time">1 hour ago</div>
                </li>
                <li class="activity-item">
                    <div class="activity-icon bg-success">
                        <i class="fas fa-bullhorn"></i>
                    </div>
                    <div class="activity-content">
                        <h4>Exam Schedule Announcement</h4>
                        <p>Midterm exam schedule has been published</p>
                    </div>
                    <div class="activity-time">3 hours ago</div>
                </li>
            </ul>
        </div>
    `,

    settings: `
        <div class="page-title">
            <h1><i class="fas fa-cog"></i> Settings</h1>
            <p>Configure system preferences and account settings</p>
        </div>

        <div class="recent-activity">
            <div class="chart-header">
                <h3>General Settings</h3>
            </div>
            <div style="padding: 20px;">
                <h3 style="margin-bottom: 15px;">Account Settings</h3>
                <p style="margin-bottom: 20px; color: var(--text-secondary);">Manage your profile and preferences</p>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">School Name</label>
                    <input type="text" value="EduSphere Academy" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Email</label>
                    <input type="email" value="admin@edusphere.com" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Time Zone</label>
                    <select style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
                        <option>UTC -5:00 (EST)</option>
                        <option selected>UTC +1:00 (CET)</option>
                        <option>UTC +8:00 (SGT)</option>
                    </select>
                </div>

                <button class="action-btn edit" style="padding: 10px 20px;">
                    <i class="fas fa-save"></i> Save Settings
                </button>
            </div>
        </div>
    `
};

// ==========================================
// 2. PAGE METADATA (Titles, Breadcrumbs)
// ==========================================

const pageMetadata = {
    dashboard: {
        title: 'Dashboard - EduSphere',
        breadcrumb: 'Dashboard',
        icon: 'fa-home'
    },
    students: {
        title: 'Students Management - EduSphere',
        breadcrumb: 'Students',
        icon: 'fa-users'
    },
    teachers: {
        title: 'Teachers Management - EduSphere',
        breadcrumb: 'Teachers',
        icon: 'fa-chalkboard-teacher'
    },
    classes: {
        title: 'Classes Management - EduSphere',
        breadcrumb: 'Classes',
        icon: 'fa-book'
    },
    attendance: {
        title: 'Attendance Management - EduSphere',
        breadcrumb: 'Attendance',
        icon: 'fa-calendar-check'
    },
    exams: {
        title: 'Examinations - EduSphere',
        breadcrumb: 'Exams',
        icon: 'fa-file-alt'
    },
    fees: {
        title: 'Fees Management - EduSphere',
        breadcrumb: 'Fees',
        icon: 'fa-money-bill-wave'
    },
    messages: {
        title: 'Messages - EduSphere',
        breadcrumb: 'Messages',
        icon: 'fa-comments'
    },
    settings: {
        title: 'Settings - EduSphere',
        breadcrumb: 'Settings',
        icon: 'fa-cog'
    }
};

// ==========================================
// 3. NAVIGATION FUNCTIONS
// ==========================================

/**
 * Navigate to a specific page
 * @param {string} pageName - The name of the page to navigate to
 * @param {boolean} addToHistory - Whether to add to browser history
 */
function navigateToPage(pageName, addToHistory = true) {
    console.log(`🔄 Navigating to: ${pageName}`);

    // Show loading spinner
    showLoadingSpinner();

    // Simulate loading delay (remove in production if content loads instantly)
    setTimeout(() => {
        // Hide all page sections
        document.querySelectorAll('.page-section').forEach(section => {
            section.style.display = 'none';
            section.classList.remove('active');
        });

        // Show the requested page
        const targetPage = document.getElementById(`page-${pageName}`);
        if (targetPage) {
            if (pageName !== 'dashboard' && pageContent[pageName]) {
                targetPage.innerHTML = pageContent[pageName];
            }
            targetPage.style.display = 'block';
            targetPage.classList.add('active');
        }

        // Update menu active state
        updateMenuActiveState(pageName);

        // Update breadcrumb
        updateBreadcrumb(pageName);

        // Update document title
        if (pageMetadata[pageName]) {
            document.title = pageMetadata[pageName].title;
        }

        // Update URL hash (for browser back/forward support)
        if (addToHistory) {
            window.location.hash = pageName;
        }

        // Hide loading spinner
        hideLoadingSpinner();

        // Fetch data from backend if needed
        if (pageName !== 'dashboard') {
            loadPageData(pageName);
        }

        console.log(`✅ Navigation complete: ${pageName}`);
    }, 300); // 300ms loading animation
}

/**
 * Update active menu item
 * @param {string} pageName - The active page name
 */
function updateMenuActiveState(pageName) {
    // Remove active class from all menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
        item.removeAttribute('aria-current');
    });

    // Add active class to current menu item
    const activeMenuItem = document.querySelector(`.menu-item[data-page="${pageName}"]`);
    if (activeMenuItem) {
        activeMenuItem.classList.add('active');
        activeMenuItem.setAttribute('aria-current', 'page');
    }
}

/**
 * Update breadcrumb navigation
 * @param {string} pageName - The current page name
 */
function updateBreadcrumb(pageName) {
    const breadcrumbList = document.getElementById('breadcrumbList');
    const currentPageElement = document.getElementById('currentPage');

    if (breadcrumbList && currentPageElement && pageMetadata[pageName]) {
        currentPageElement.textContent = pageMetadata[pageName].breadcrumb;
    }
}

/**
 * Show loading spinner
 */
function showLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'flex';
    }
}

/**
 * Hide loading spinner
 */
function hideLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
}

/**
 * Load page-specific data from backend
 * @param {string} pageName - The page to load data for
 */
async function loadPageData(pageName) {
    const API_URL = 'http://localhost:5000/api/v1';

    try {
        // Example: Load students data
        if (pageName === 'students') {
            const response = await fetch(`${API_URL}/students`);
            if (response.ok) {
                const data = await response.json();
                console.log('📊 Students data loaded:', data);
                // Update the page with real data here
                if (data.success && data.data.students) {
                    // Update total students count if element exists
                    const totalElement = document.getElementById('totalStudents');
                    if (totalElement) {
                        totalElement.textContent = data.data.pagination.total.toLocaleString();
                    }
                }
            }
        }

        // Add more data loading for other pages as needed

    } catch (error) {
        console.warn(`⚠️ Could not load data for ${pageName}: `, error);
    }
}

// ==========================================
// 4. EVENT LISTENERS & INITIALIZATION
// ==========================================

/**
 * Initialize SPA Router
 */
function initializeSPARouter() {
    console.log('🚀 Initializing SPA Router...');

    // 1. Setup menu item click handlers
    const menuItems = document.querySelectorAll('.menu-item[data-page]');
    menuItems.forEach(item => {
        // Click event
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pageName = item.getAttribute('data-page');
            if (pageName) {
                navigateToPage(pageName);
            }
        });

        // Keyboard navigation (Enter key)
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const pageName = item.getAttribute('data-page');
                if (pageName) {
                    navigateToPage(pageName);
                }
            }
        });
    });

    // 2. Handle browser back/forward buttons
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1); // Remove #
        if (hash && pageContent[hash] !== undefined) {
            navigateToPage(hash, false); // Don't add to history again
        }
    });

    // 3. Handle initial page load from URL hash
    const initialHash = window.location.hash.substring(1);
    if (initialHash && pageContent[initialHash] !== undefined) {
        navigateToPage(initialHash, false);
    }

    // 4. Setup breadcrumb home link
    const breadcrumbList = document.getElementById('breadcrumbList');
    if (breadcrumbList) {
        const homeLink = breadcrumbList.querySelector('a[href="#dashboard"]');
        if (homeLink) {
            homeLink.addEventListener('click', (e) => {
                e.preventDefault();
                navigateToPage('dashboard');
            });
        }
    }

    console.log('✅ SPA Router initialized successfully!');
}

// ==========================================
// 5. AUTO-INITIALIZE ON DASHBOARD PAGE LOAD
// ==========================================

// Wait for dashboard page to be visible, then initialize
const checkDashboardReady = setInterval(() => {
    const dashboardPage = document.querySelector('.dashboard-page');
    if (dashboardPage && dashboardPage.classList.contains('active')) {
        clearInterval(checkDashboardReady);
        initializeSPARouter();
    }
}, 100);

// Also initialize if already on dashboard
if (document.querySelector('.dashboard-page.active')) {
    initializeSPARouter();
}

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { navigateToPage, initializeSPARouter };
}
