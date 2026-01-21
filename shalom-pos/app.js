// =============================================
// MAIN APP CONTROLLER
// =============================================

const App = {
    currentModule: 'dashboard',

    init() {
        // Initialize data manager
        DataManager.init();

        // Update User Info
        this.updateUserInfo();

        // Set up navigation
        this.setupNavigation();

        // Load initial module
        const user = Auth.getCurrentUser();
        if (user && user.role === 'Creator') {
            this.loadModule('creator-dashboard');
        } else {
            this.loadModule('dashboard');
        }

        // Setup sidebar toggle for mobile
        this.setupSidebarToggle();
    },

    updateUserInfo() {
        const user = Auth.getCurrentUser();
        if (user) {
            const userInfoContainer = document.querySelector('.user-info');
            if (userInfoContainer) {
                userInfoContainer.innerHTML = `
                    <div class="user-avatar">
                        <i class="fas fa-${user.role === 'Creator' ? 'crown' : 'user-shield'}"></i>
                    </div>
                    <div>
                        <div style="font-weight: 600;">${user.username}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">${user.role}</div>
                    </div>
                `;
            }
        }
    },

    setupNavigation() {
        const user = Auth.getCurrentUser();
        const navMenu = document.querySelector('.nav-menu ul');

        if (navMenu && user) {
            let navHtml = '';

            // Creator Dashboard (Only for Creator)
            if (user.role === 'Creator') {
                navHtml += `
                    <li class="nav-item">
                        <a href="#" class="nav-link" data-module="creator-dashboard">
                            <i class="fas fa-crown"></i>
                            <span>Creator Dashboard</span>
                        </a>
                    </li>
                `;
            }

            // Standard Dashboard
            navHtml += `
                <li class="nav-item">
                    <a href="#" class="nav-link" data-module="dashboard">
                        <i class="fas fa-chart-line"></i>
                        <span>Dashboard</span>
                    </a>
                </li>
            `;

            // Sales / POS
            navHtml += `
                <li class="nav-item">
                    <a href="#" class="nav-link" data-module="sales">
                        <i class="fas fa-cash-register"></i>
                        <span>Sales / POS</span>
                    </a>
                </li>
            `;

            // Invoices (Admin & Creator)
            if (['Creator', 'Administrator'].includes(user.role) || user.username === 'admin') {
                navHtml += `
                    <li class="nav-item">
                        <a href="#" class="nav-link" data-module="invoices">
                            <i class="fas fa-file-invoice-dollar"></i>
                            <span>Invoices</span>
                        </a>
                    </li>
                `;
            }

            // Inventory
            navHtml += `
                <li class="nav-item">
                    <a href="#" class="nav-link" data-module="inventory">
                        <i class="fas fa-box"></i>
                        <span>Inventory</span>
                    </a>
                </li>
            `;

            // Customers
            navHtml += `
                <li class="nav-item">
                    <a href="#" class="nav-link" data-module="customers">
                        <i class="fas fa-users"></i>
                        <span>Customers</span>
                    </a>
                </li>
            `;

            // Reports
            navHtml += `
                <li class="nav-item">
                    <a href="#" class="nav-link" data-module="reports">
                        <i class="fas fa-file-alt"></i>
                        <span>Reports</span>
                    </a>
                </li>
            `;

            // Settings
            navHtml += `
                <li class="nav-item">
                    <a href="#" class="nav-link" data-module="settings">
                        <i class="fas fa-cog"></i>
                        <span>Settings</span>
                    </a>
                </li>
            `;

            // Report Issue (For all users)
            navHtml += `
                <li class="nav-item" style="margin-top: auto; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px;">
                    <a href="#" class="nav-link" onclick="App.showComplaintModal(event)">
                        <i class="fas fa-exclamation-circle text-warning"></i>
                        <span>Report Issue</span>
                    </a>
                </li>
            `;

            navMenu.innerHTML = navHtml;
        }

        // Re-attach event listeners
        const navLinks = document.querySelectorAll('.nav-link:not([onclick])');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const module = link.dataset.module;

                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Load module
                this.loadModule(module);

                // Close sidebar on mobile if open
                const sidebar = document.getElementById('sidebar');
                if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                }
            });
        });
    },

    setupSidebarToggle() {
        const toggleBtn = document.getElementById('toggleSidebar');
        const sidebar = document.getElementById('sidebar');

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        }
    },

    showComplaintModal(event) {
        if (event) event.preventDefault();

        const body = `
            <div class="form-group">
                <label class="form-label">Describe the issue or complaint</label>
                <textarea id="complaintText" class="form-control" rows="4" placeholder="Please provide details..."></textarea>
            </div>
        `;

        this.showModal('Report Issue', body, [
            { text: 'Cancel', class: 'btn-secondary', onclick: 'App.closeModal()' },
            { text: 'Submit', class: 'btn-primary', onclick: 'App.submitComplaint()' }
        ]);
    },

    submitComplaint() {
        const issue = document.getElementById('complaintText').value;
        if (!issue.trim()) {
            alert('Please describe the issue.');
            return;
        }

        const user = Auth.getCurrentUser();
        DataManager.addComplaint({
            username: user ? user.username : 'Anonymous',
            issue: issue
        });

        this.closeModal();
        alert('Complaint submitted successfully. An admin will review it shortly.');

        // Refresh dashboard if current user is creator
        if (this.currentModule === 'creator-dashboard') {
            this.loadModule('creator-dashboard');
        }
    },

    loadModule(moduleName) {
        this.currentModule = moduleName;
        const contentArea = document.getElementById('contentArea');
        const pageTitle = document.getElementById('pageTitle');

        // Update page title
        const titles = {
            'creator-dashboard': 'Creator Dashboard',
            'dashboard': 'Dashboard',
            'sales': 'Sales / POS',
            'invoices': 'Invoices',
            'inventory': 'Inventory Management',
            'customers': 'Customer Management',
            'reports': 'Reports & Analytics',
            'settings': 'Settings'
        };

        pageTitle.textContent = titles[moduleName] || 'Shalom POS';

        // Load module content
        const modules = {
            'creator-dashboard': CreatorDashboard,
            'dashboard': Dashboard,
            'sales': Sales,
            'invoices': Invoices,
            'inventory': Inventory,
            'customers': Customers,
            'reports': Reports,
            'settings': Settings
        };

        const module = modules[moduleName];
        if (module) {
            contentArea.innerHTML = module.render();

            // Call module init if it exists
            if (module.init) {
                module.init();
            }
        }
    },

    showModal(title, body, buttons = []) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        const modalFooter = document.getElementById('modalFooter');

        modalTitle.textContent = title;
        modalBody.innerHTML = body;

        // Create footer buttons
        modalFooter.innerHTML = buttons.map(btn => `
            <button class="btn ${btn.class}" onclick="${btn.onclick}">
                ${btn.text}
            </button>
        `).join('');

        modal.classList.add('active');
    },

    closeModal() {
        const modal = document.getElementById('modal');
        modal.classList.remove('active');
    }
};

// Setup modal close functionality
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modalClose');

    // Close on X button
    modalClose?.addEventListener('click', () => {
        App.closeModal();
    });

    // Close on backdrop click
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            App.closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            App.closeModal();
        }
    });

    // Initialize app
    App.init();
});
