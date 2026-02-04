// Admin Dashboard JavaScript

// Initialize Admin Dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Admin Dashboard Initialized');
    
    // Set up navigation
    setupNavigation();
    
    // Load initial data
    loadDashboardData();
    loadUsersData();
    loadApplicationsData();
    loadPaymentsData();
});

// Navigation Setup
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link:not(.danger)');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get section to show
            const sectionId = this.getAttribute('data-section') + '-section';
            
            // Hide all sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show selected section
            const section = document.getElementById(sectionId);
            if (section) {
                section.classList.add('active');
                
                // Load data based on section
                if (sectionId === 'users-section') {
                    loadUsersData();
                } else if (sectionId === 'applications-section') {
                    loadApplicationsData();
                } else if (sectionId === 'payments-section') {
                    loadPaymentsData();
                } else if (sectionId === 'courses-section') {
                    loadCoursesData();
                }
            }
        });
    });
}

// Load Dashboard Statistics
async function loadDashboardData() {
    try {
        // Fetch users data
        const response = await fetch(window.appConfig.API_URL + '/api/admin/dashboard', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('admin_token')
            }
        });
        
        if (!response.ok) {
            console.error('Failed to load dashboard data');
            return;
        }
        
        const data = await response.json();
        
        // Update stats
        document.getElementById('total-users').textContent = data.totalUsers || 0;
        document.getElementById('pending-apps').textContent = data.pendingApplications || 0;
        document.getElementById('approved-apps').textContent = data.approvedApplications || 0;
        document.getElementById('total-revenue').textContent = '$' + (data.totalRevenue || 0);
        
        // Load recent registrations
        if (data.recentRegistrations && data.recentRegistrations.length > 0) {
            const recentDiv = document.getElementById('recent-registrations');
            recentDiv.innerHTML = '';
            
            data.recentRegistrations.forEach(user => {
                const item = document.createElement('div');
                item.className = 'recent-item';
                item.innerHTML = `
                    <strong>${user.name}</strong> - ${user.email}
                    <br><small>${new Date(user.created_at).toLocaleDateString()}</small>
                `;
                recentDiv.appendChild(item);
            });
        }
        
    } catch (error) {
        console.error('❌ Dashboard error:', error);
    }
}

// Load Users Data
async function loadUsersData() {
    try {
        const response = await fetch(window.appConfig.API_URL + '/api/admin/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('admin_token')
            }
        });
        
        if (!response.ok) {
            console.error('Failed to load users');
            return;
        }
        
        const data = await response.json();
        const tbody = document.getElementById('users-tbody');
        
        if (data.users && data.users.length > 0) {
            tbody.innerHTML = data.users.map(user => `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.full_name}</td>
                    <td>${user.email}</td>
                    <td>${user.phone || 'N/A'}</td>
                    <td>${user.country || 'N/A'}</td>
                    <td><span class="status-badge ${user.email_verified ? 'verified' : 'pending'}">${user.email_verified ? 'Verified' : 'Pending'}</span></td>
                    <td>
                        <button class="btn-action" onclick="viewUserDetails('${user.id}')">View</button>
                        <button class="btn-action danger" onclick="deleteUser('${user.id}')">Delete</button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr class="empty-row"><td colspan="7" class="empty-state">No users found</td></tr>';
        }
        
    } catch (error) {
        console.error('❌ Users error:', error);
    }
}

// Load Applications Data
async function loadApplicationsData() {
    try {
        const response = await fetch(window.appConfig.API_URL + '/api/admin/applications', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('admin_token')
            }
        });
        
        if (!response.ok) {
            console.error('Failed to load applications');
            return;
        }
        
        const data = await response.json();
        const tbody = document.getElementById('applications-tbody');
        
        if (data.applications && data.applications.length > 0) {
            tbody.innerHTML = data.applications.map(app => `
                <tr>
                    <td>${app.id}</td>
                    <td>${app.user_name}</td>
                    <td>${app.email}</td>
                    <td>${app.track || 'N/A'}</td>
                    <td><span class="status-badge ${app.status}">${app.status}</span></td>
                    <td>${new Date(app.created_at).toLocaleDateString()}</td>
                    <td>
                        <button class="btn-action" onclick="viewApplicationDetails('${app.id}')">Review</button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr class="empty-row"><td colspan="7" class="empty-state">No applications found</td></tr>';
        }
        
    } catch (error) {
        console.error('❌ Applications error:', error);
    }
}

// Load Payments Data
async function loadPaymentsData() {
    try {
        const response = await fetch(window.appConfig.API_URL + '/api/admin/payments', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('admin_token')
            }
        });
        
        if (!response.ok) {
            console.error('Failed to load payments');
            return;
        }
        
        const data = await response.json();
        const tbody = document.getElementById('payments-tbody');
        
        if (data.payments && data.payments.length > 0) {
            tbody.innerHTML = data.payments.map(payment => `
                <tr>
                    <td>${payment.id}</td>
                    <td>${payment.user_name}</td>
                    <td>$${parseFloat(payment.amount).toFixed(2)}</td>
                    <td>${payment.method}</td>
                    <td><span class="status-badge ${payment.status}">${payment.status}</span></td>
                    <td>${new Date(payment.created_at).toLocaleDateString()}</td>
                    <td>
                        <button class="btn-action" onclick="viewPaymentDetails('${payment.id}')">Details</button>
                        <button class="btn-action" onclick="approvePayment('${payment.id}')">Approve</button>
                        <button class="btn-action danger" onclick="rejectPayment('${payment.id}')">Reject</button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr class="empty-row"><td colspan="7" class="empty-state">No payments found</td></tr>';
        }
        
    } catch (error) {
        console.error('❌ Payments error:', error);
    }
}

// Load Courses Data
async function loadCoursesData() {
    try {
        const response = await fetch(window.appConfig.API_URL + '/api/admin/courses', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('admin_token')
            }
        });
        
        if (!response.ok) {
            console.error('Failed to load courses');
            return;
        }
        
        const data = await response.json();
        const grid = document.getElementById('courses-grid');
        
        if (data.courses && data.courses.length > 0) {
            grid.innerHTML = data.courses.map(course => `
                <div class="course-card">
                    <div class="course-card-header">
                        <h3>${course.name}</h3>
                    </div>
                    <div class="course-card-body">
                        <p>${course.description}</p>
                        <div class="course-price">$${course.price}</div>
                        <button class="btn-action" onclick="editCourse('${course.id}')">Edit</button>
                        <button class="btn-action danger" onclick="deleteCourse('${course.id}')">Delete</button>
                    </div>
                </div>
            `).join('');
        } else {
            grid.innerHTML = '<p class="empty-state">No courses found</p>';
        }
        
    } catch (error) {
        console.error('❌ Courses error:', error);
    }
}

// Filter Applications
function filterApplications(status) {
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Reload with filter (implement API call with status parameter)
    loadApplicationsData();
}

// Modal Functions
function showUserModal() {
    document.getElementById('user-modal').classList.remove('hidden');
}

function showCourseModal() {
    document.getElementById('course-modal')?.classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function viewUserDetails(userId) {
    console.log('Viewing user:', userId);
    showUserModal();
    // Load and display user details
}

function viewApplicationDetails(appId) {
    console.log('Viewing application:', appId);
    document.getElementById('application-modal').classList.remove('hidden');
    // Load and display application details
}

function viewPaymentDetails(paymentId) {
    console.log('Viewing payment:', paymentId);
    // Load and display payment details
}

async function approvePayment(paymentId) {
    if (!confirm('Approve this payment?')) return;
    try {
        const response = await fetch(window.appConfig.API_URL + '/api/admin/payments/' + paymentId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('admin_token')
            },
            body: JSON.stringify({ status: 'approved' })
        });

        if (!response.ok) {
            alert('Failed to update payment');
            return;
        }

        const result = await response.json();
        console.log('✅ Payment approved:', result);
        
        // Get the payment details to extract userId and userEmail
        if (result.payment) {
            const userId = result.payment.userId;
            const userEmail = result.payment.userEmail;
            
            // 🔥 Update user's payment status to 'completed' in user.json
            await updateUserPaymentStatus(userId);
            
            // Send notification to user via WebSocket or direct API call
            await notifyUserApproval(userId, userEmail, paymentId);
        }

        alert('✅ Payment approved! User payment status updated. Student can now access dashboard.');
        loadPaymentsData();
    } catch (err) {
        console.error('Approve payment error:', err);
        alert('Error approving payment');
    }
}

// Update user's payment status to 'completed' when admin approves
async function updateUserPaymentStatus(userId) {
    try {
        console.log('💾 Updating user payment status for userId:', userId);
        
        const response = await fetch(window.appConfig.API_URL + '/api/user-payment-approval/' + userId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('admin_token')
            },
            body: JSON.stringify({ status: 'completed' })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ User payment status updated:', data);
            return true;
        } else {
            console.warn('⚠️ Failed to update user payment status');
            return false;
        }
    } catch (err) {
        console.error('Error updating user payment status:', err);
        return false;
    }
}

// Notify user of approval
async function notifyUserApproval(userId, userEmail, paymentId) {
    try {
        console.log('📢 Notifying user of approval:', { userId, userEmail, paymentId });
        
        // Send notification via API
        const notifyResponse = await fetch(window.appConfig.API_URL + '/api/notify-user-approval', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userId,
                userEmail: userEmail,
                paymentId: paymentId,
                message: 'Your payment has been approved! Your dashboard is now unlocked.'
            })
        });

        if (notifyResponse.ok) {
            console.log('✅ User notification sent successfully');
        }
    } catch (err) {
        console.error('Error notifying user:', err);
    }
}

async function rejectPayment(paymentId) {
    if (!confirm('Reject this payment?')) return;
    try {
        const response = await fetch(window.appConfig.API_URL + '/api/admin/payments/' + paymentId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('admin_token')
            },
            body: JSON.stringify({ status: 'rejected' })
        });

        if (!response.ok) {
            alert('Failed to update payment');
            return;
        }

        alert('Payment rejected');
        loadPaymentsData();
    } catch (err) {
        console.error('Reject payment error:', err);
        alert('Error rejecting payment');
    }
}

function approveApplication() {
    console.log('Application approved');
    alert('Application approved successfully!');
    closeModal('application-modal');
    loadApplicationsData();
}

function rejectApplication() {
    console.log('Application rejected');
    alert('Application rejected');
    closeModal('application-modal');
    loadApplicationsData();
}

function saveUserChanges() {
    console.log('Saving user changes');
    alert('User changes saved');
    closeModal('user-modal');
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        console.log('Deleting user:', userId);
        loadUsersData();
    }
}

function deleteCourse(courseId) {
    if (confirm('Are you sure you want to delete this course?')) {
        console.log('Deleting course:', courseId);
        loadCoursesData();
    }
}

function editCourse(courseId) {
    console.log('Editing course:', courseId);
    // Load course editing modal
}

function exportPayments() {
    console.log('Exporting payments');
    alert('Exporting payments...');
}

function saveSettings() {
    const adminEmail = document.getElementById('admin-email').value;
    const companyName = document.getElementById('company-name').value;
    const supportEmail = document.getElementById('support-email').value;
    
    console.log('Saving settings:', { adminEmail, companyName, supportEmail });
    alert('Settings saved successfully!');
}

function logoutAdmin(event) {
    event.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/admin/admin.html';
    }
}

// Status Badge Styling
const style = document.createElement('style');
style.textContent = `
    .status-badge {
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        font-size: 0.85rem;
        font-weight: 600;
        display: inline-block;
    }
    
    .status-badge.pending {
        background-color: #fed7aa;
        color: #92400e;
    }
    
    .status-badge.approved {
        background-color: #bbf7d0;
        color: #065f46;
    }
    
    .status-badge.rejected {
        background-color: #fecaca;
        color: #7f1d1d;
    }
    
    .status-badge.verified {
        background-color: #a7f3d0;
        color: #065f46;
    }
    
    .btn-action {
        padding: 0.4rem 0.8rem;
        border: 1px solid var(--border-color);
        background: white;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.85rem;
        margin-right: 0.3rem;
        transition: all 0.3s ease;
    }
    
    .btn-action:hover {
        background: var(--light-bg);
        border-color: var(--primary-color);
        color: var(--primary-color);
    }
    
    .btn-action.danger {
        color: var(--danger-color);
    }
    
    .btn-action.danger:hover {
        border-color: var(--danger-color);
    }
`;
document.head.appendChild(style);

console.log('✅ Admin Dashboard Ready');
