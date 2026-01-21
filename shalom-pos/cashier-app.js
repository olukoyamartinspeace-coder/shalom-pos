// =============================================
// CASHIER APP CONTROLLER
// =============================================

const CashierApp = {
    currentModule: 'pos',

    init() {
        // Initialize data manager
        DataManager.init();

        // Set up navigation
        this.setupNavigation();

        // Load initial module (POS)
        this.loadModule('pos');

        // Setup sidebar toggle for mobile
        this.setupSidebarToggle();

        // Update today's sales total in topbar
        this.updateTodaySales();
    },

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
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

    updateTodaySales() {
        const transactions = DataManager.getTransactions();
        const settings = DataManager.getSettings();
        const today = new Date().toISOString().split('T')[0];
        const todayTransactions = transactions.filter(t => t.date.startsWith(today));
        const todaySales = todayTransactions.reduce((sum, t) => sum + t.total, 0);

        const topbarElement = document.getElementById('todaySalesTotal');
        if (topbarElement) {
            topbarElement.textContent = `${settings.currencySymbol}${todaySales.toFixed(2)}`;
        }
    },

    loadModule(moduleName) {
        this.currentModule = moduleName;
        const contentArea = document.getElementById('contentArea');
        const pageTitle = document.getElementById('pageTitle');

        // Update page title
        const titles = {
            'pos': 'Point of Sale',
            'quick-inventory': 'Product Lookup',
            'quick-customers': 'Customer Lookup',
            'today': "Today's Sales"
        };

        pageTitle.textContent = titles[moduleName] || 'Cashier Terminal';

        // Load module content
        const modules = {
            'pos': Sales,  // Reuse the Sales module from main app
            'quick-inventory': QuickInventory,
            'quick-customers': QuickCustomers,
            'today': TodaySales
        };

        const module = modules[moduleName];
        if (module) {
            contentArea.innerHTML = module.render();

            // Call module init if it exists
            if (module.init) {
                module.init();
            }

            // Update today's sales after any module loads
            this.updateTodaySales();
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

        // Reload current module to refresh data (especially after sales)
        this.loadModule(this.currentModule);
    }
};

// Alias for Sales module to use cashier app
const App = CashierApp;

// Setup modal close functionality
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modalClose');

    // Close on X button
    modalClose?.addEventListener('click', () => {
        CashierApp.closeModal();
    });

    // Close on backdrop click
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            CashierApp.closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            CashierApp.closeModal();
        }
    });

    // Initialize cashier app
    CashierApp.init();
});
