// Navigation switching functionality
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');
const pageTitle = document.getElementById('page-title');

// Navigation titles mapping (student view)
const navigationTitles = {
    'dashboard': 'Dashboard',
    'class-activities': 'Class Activities',
    'notification': 'Notification',
    'programming-lab': 'Programming Lab',
    'library': 'Library'
};

// Add click handlers to navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        if (link.classList.contains('logout')) {
            handleLogout();
            return;
        }

        e.preventDefault();

        // Get section name
        const sectionName = link.getAttribute('data-section');
        if (!sectionName) return;

        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Hide all sections
        contentSections.forEach(section => section.classList.remove('active'));

        // Show selected section
        const selectedSection = document.getElementById(`${sectionName}-section`);
        if (selectedSection) {
            selectedSection.classList.add('active');
            pageTitle.textContent = navigationTitles[sectionName] || 'Dashboard';
        }

        // Update URL
        window.history.pushState(null, null, `#${sectionName}`);
    });
});

// Handle page navigation on load
window.addEventListener('load', () => {
    const hash = window.location.hash.slice(1);
    if (hash && navigationTitles[hash]) {
        const link = document.querySelector(`[data-section="${hash}"]`);
        if (link) link.click();
    }
});

// Logout handler
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear any stored data
        localStorage.removeItem('userToken');
        sessionStorage.clear();
        
        // Redirect to login page
        window.location.href = '../index.html';
    }
}

// Sample data loading functions (student view)
function loadDashboardData() {
    console.log('Loading dashboard data...');
    const activitiesEl = document.getElementById('activities-count');
    const notificationsEl = document.getElementById('notifications-count');
    const labProgressEl = document.getElementById('lab-progress');
    const libraryEl = document.getElementById('library-count');

    if (activitiesEl) activitiesEl.textContent = '3';
    if (notificationsEl) notificationsEl.textContent = '12';
    if (labProgressEl) labProgressEl.textContent = '24/50';
    if (libraryEl) libraryEl.textContent = '15';
}

// Class Activities handler
function setupClassActivities() {
    const activityTable = document.getElementById('class-activities');
    if (!activityTable) return;

    const buttons = activityTable.querySelectorAll('.btn-view');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            if (row) {
                const course = row.cells[0].textContent;
                const activity = row.cells[1].textContent;
                console.log(`Opening: ${course} - ${activity}`);
                alert(`${btn.textContent} ${activity}`);
            }
        });
    });
}

// Lab handlers
function setupLabButtons() {
    const joinLabBtn = document.getElementById('join-lab');
    const practiceBtn = document.getElementById('start-practice');
    const progressBtn = document.getElementById('view-progress');

    if (joinLabBtn) {
        joinLabBtn.addEventListener('click', () => {
            alert('Joining live lab session...');
            console.log('User joined live lab');
        });
    }

    if (practiceBtn) {
        practiceBtn.addEventListener('click', () => {
            alert('Starting practice problems...');
            console.log('User started practice');
        });
    }

    if (progressBtn) {
        progressBtn.addEventListener('click', () => {
            alert('Opening progress dashboard...');
            console.log('User viewing progress');
        });
    }
}

// Library handlers
function setupLibraryLinks() {
    const materialLinks = document.querySelectorAll('#course-materials a');
    const bookLinks = document.querySelectorAll('#reference-books a');
    const resourceLinks = document.querySelectorAll('#external-resources a');

    const allLinks = [...materialLinks, ...bookLinks, ...resourceLinks];
    
    allLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const text = link.textContent;
            console.log(`Opening library resource: ${text}`);
            alert(`Opening: ${text}`);
        });
    });
}

// Search functionality
const searchBox = document.querySelector('.search-box');
if (searchBox) {
    searchBox.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        console.log('Searching for:', searchTerm);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is authenticated
    const userName = localStorage.getItem('userName') || 'John Doe';
    const userEl = document.getElementById('user-name');
    if (userEl) userEl.textContent = userName;
    
    // Load initial data
    loadDashboardData();
    
    // Setup event handlers
    setupClassActivities();
    setupLabButtons();
    setupLibraryLinks();
    
    console.log('Student Dashboard initialized');
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchBox?.focus();
    }
});

console.log('Student Dashboard Script Loaded Successfully');

// Add click handlers to navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        if (link.classList.contains('logout')) {
            handleLogout();
            return;
        }

        e.preventDefault();

        // Get section name
        const sectionName = link.getAttribute('data-section');
        if (!sectionName) return;

        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Hide all sections
        contentSections.forEach(section => section.classList.remove('active'));

        // Show selected section
        const selectedSection = document.getElementById(`${sectionName}-section`);
        if (selectedSection) {
            selectedSection.classList.add('active');
            pageTitle.textContent = navigationTitles[sectionName] || 'Dashboard';
        }

        // Update URL
        window.history.pushState(null, null, `#${sectionName}`);
    });
});

// Handle page navigation on load
window.addEventListener('load', () => {
    const hash = window.location.hash.slice(1);
    if (hash && navigationTitles[hash]) {
        const link = document.querySelector(`[data-section="${hash}"]`);
        if (link) link.click();
    }
});

// Logout handler
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear any stored data
        localStorage.removeItem('adminToken');
        sessionStorage.clear();
        
        // Redirect to login page
        window.location.href = '../index.html';
    }
}

// Sample data loading functions
function loadDashboardData() {
    // You can fetch data from your API here
    console.log('Loading dashboard data...');
    
    // Sample data update
    document.getElementById('total-users').textContent = '1,234';
    document.getElementById('total-orders').textContent = '567';
    document.getElementById('total-revenue').textContent = '$45,230';
    document.getElementById('growth-rate').textContent = '+12.5%';
}

function loadUsersData() {
    console.log('Loading users data...');
    // Fetch users from API
}

function loadOrdersData() {
    console.log('Loading orders data...');
    // Fetch orders from API
}

function loadProductsData() {
    console.log('Loading products data...');
    // Fetch products from API
}

// Save settings button handler
const settingsForm = document.querySelector('.settings-form');
if (settingsForm) {
    const saveBtn = settingsForm.querySelector('.btn-primary');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const inputs = settingsForm.querySelectorAll('.form-control, .form-checkbox');
            const settings = {};
            
            inputs.forEach(input => {
                const label = input.previousElementSibling?.textContent || 'setting';
                if (input.type === 'checkbox') {
                    settings[label] = input.checked;
                } else {
                    settings[label] = input.value;
                }
            });
            
            console.log('Saving settings:', settings);
            alert('Settings saved successfully!');
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is authenticated (you can add your auth logic here)
    const adminName = localStorage.getItem('adminName') || 'Admin User';
    document.getElementById('admin-name').textContent = adminName;
    
    // Load initial data
    loadDashboardData();
    
    console.log('Admin Dashboard initialized');
});
