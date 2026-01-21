// =============================================
// CREATOR DASHBOARD MODULE
// =============================================

const CreatorDashboard = {
    render() {
        const products = DataManager.getProducts();
        const customers = DataManager.getCustomers();
        const transactions = DataManager.getTransactions();
        const users = DataManager.getUsers();
        const complaints = DataManager.getComplaints();

        // Calculate total sales
        const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);

        return `
            <div class="dashboard-container">
                <!-- Metrics Section -->
                <div class="grid grid-4 mb-2">
                    <div class="card dashboard-stat">
                        <div class="stat-icon" style="background: rgba(99, 102, 241, 0.1); color: var(--primary-color);">
                            <i class="fas fa-box"></i>
                        </div>
                        <div class="stat-info">
                            <h3>${products.length}</h3>
                            <p>Products</p>
                        </div>
                    </div>
                    <div class="card dashboard-stat">
                        <div class="stat-icon" style="background: rgba(16, 185, 129, 0.1); color: var(--success-color);">
                            <i class="fas fa-file-invoice"></i>
                        </div>
                        <div class="stat-info">
                            <h3>${transactions.length}</h3>
                            <p>Documents (Invoices)</p>
                        </div>
                    </div>
                    <div class="card dashboard-stat">
                        <div class="stat-icon" style="background: rgba(245, 158, 11, 0.1); color: var(--warning-color);">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-info">
                            <h3>${customers.length}</h3>
                            <p>Customers</p>
                        </div>
                    </div>
                    <div class="card dashboard-stat">
                        <div class="stat-icon" style="background: rgba(236, 72, 153, 0.1); color: var(--accent-color);">
                            <i class="fas fa-user-shield"></i>
                        </div>
                        <div class="stat-info">
                            <h3>${users.length}</h3>
                            <p>App Users</p>
                        </div>
                    </div>
                </div>

                <div class="grid grid-2">
                    <!-- Active Admin Users -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title"><i class="fas fa-user-tie"></i> Active Admin Users</h3>
                        </div>
                        <div class="card-body">
                            ${this.renderActiveAdmins(users)}
                        </div>
                    </div>

                    <!-- System Complaints -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title"><i class="fas fa-exclamation-triangle"></i> System Complaints</h3>
                        </div>
                        <div class="card-body">
                            ${this.renderComplaints(complaints)}
                        </div>
                    </div>
                </div>

                <div class="grid grid-2 mt-2">
                    <!-- Features Checklist -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title"><i class="fas fa-list-check"></i> System Features & Capabilities</h3>
                        </div>
                        <div class="card-body">
                            <div class="feature-list">
                                ${this.renderFeatureList()}
                            </div>
                        </div>
                    </div>

                    <!-- Recent Activity / System Status -->
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title"><i class="fas fa-server"></i> System Status</h3>
                        </div>
                        <div class="card-body">
                            <ul class="list-group">
                                <li class="list-item">
                                    <div class="flex-between">
                                        <span><i class="fas fa-database text-primary"></i> Database Status</span>
                                        <span class="badge badge-success">Active (LocalStorage)</span>
                                    </div>
                                </li>
                                <li class="list-item">
                                    <div class="flex-between">
                                        <span><i class="fas fa-network-wired text-primary"></i> Multi-Device Support</span>
                                        <span class="badge badge-warning">Single Device Mode</span>
                                    </div>
                                </li>
                                <li class="list-item">
                                    <div class="flex-between">
                                        <span><i class="fas fa-shield-alt text-primary"></i> Security Level</span>
                                        <span class="badge badge-success">Standard</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderActiveAdmins(users) {
        const admins = users.filter(u => ['Creator', 'Administrator'].includes(u.role) || u.username === 'admin');

        if (admins.length === 0) {
            return '<p class="text-muted">No active admin users found.</p>';
        }

        return `
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${admins.map(u => `
                            <tr>
                                <td>
                                    <div style="display: flex; align-items: center; gap: 10px;">
                                        <div class="user-avatar-sm" style="width: 30px; height: 30px; background: var(--primary-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;">
                                            ${u.username.charAt(0).toUpperCase()}
                                        </div>
                                        ${u.username}
                                    </div>
                                </td>
                                <td><span class="badge badge-${u.role === 'Creator' ? 'primary' : 'info'}">${u.role}</span></td>
                                <td><span class="badge badge-success">Active</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    renderComplaints(complaints) {
        if (complaints.length === 0) {
            return '<p class="text-muted">No complaints reported.</p>';
        }

        return `
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Issue</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${complaints.map(c => `
                            <tr>
                                <td>#${c.id}</td>
                                <td>${c.username}</td>
                                <td>${c.issue}</td>
                                <td>
                                    <span class="badge badge-${c.status === 'Resolved' ? 'success' : 'danger'}">
                                        ${c.status}
                                    </span>
                                </td>
                                <td>
                                    ${c.status !== 'Resolved' ? `
                                        <button class="btn btn-sm btn-success" onclick="CreatorDashboard.resolveComplaint(${c.id})">
                                            <i class="fas fa-check"></i>
                                        </button>
                                    ` : '<i class="fas fa-check-circle text-success"></i>'}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    resolveComplaint(id) {
        if (confirm('Mark this complaint as resolved?')) {
            DataManager.resolveComplaint(id);
            // Refresh view
            App.loadModule('creator-dashboard');
        }
    },

    renderFeatureList() {
        const features = [
            'Multiple computers using single database',
            'Printed or electronic receipts',
            'Inventory management',
            'Discounts',
            'Security',
            'Loyalty cards',
            'Credit payments',
            'Standard and Touch screen layout',
            'Custom payment types',
            'Promotions & Happy hour',
            'Tax exempt sale',
            'Email Reporting',
            'Support barcodes and weight barcodes',
            'Custom receipts',
            'Notes',
            'Stock control',
            'Priority support'
        ];

        return `
            <ul class="feature-checklist" style="list-style: none; padding: 0;">
                ${features.map(feature => `
                    <li style="padding: 8px 0; border-bottom: 1px solid var(--border-color); display: flex; align-items: center;">
                        <i class="fas fa-check-circle text-success" style="margin-right: 10px;"></i>
                        ${feature}
                    </li>
                `).join('')}
            </ul>
        `;
    }
};
