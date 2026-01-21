// =============================================
// CASHIER-SPECIFIC MODULES
// Simplified interfaces for cashier operations
// =============================================

// Quick Inventory Lookup Module
const QuickInventory = {
    render() {
        const products = DataManager.getProducts();
        const settings = DataManager.getSettings();

        return `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-search"></i> Product Lookup</h3>
                </div>
                <div class="card-body">
                    <div class="search-bar mb-2">
                        <i class="fas fa-search"></i>
                        <input type="text" 
                            class="form-control" 
                            id="quickProductSearch" 
                            placeholder="Search by name, SKU, or barcode..."
                            autofocus>
                    </div>

                    <div class="alert alert-info">
                        <i class="fas fa-info-circle"></i> 
                        Search for products to check pricing and availability
                    </div>

                    <div id="quickSearchResults"></div>
                </div>
            </div>
        `;
    },

    init() {
        setTimeout(() => {
            const searchInput = document.getElementById('quickProductSearch');
            if (searchInput) {
                searchInput.addEventListener('input', () => this.search());
                searchInput.focus();
            }
        }, 100);
    },

    search() {
        const searchTerm = document.getElementById('quickProductSearch')?.value.toLowerCase() || '';
        const settings = DataManager.getSettings();

        if (searchTerm.length < 2) {
            document.getElementById('quickSearchResults').innerHTML = '';
            return;
        }

        let products = DataManager.getProducts().filter(p =>
            p.name.toLowerCase().includes(searchTerm) ||
            p.sku.toLowerCase().includes(searchTerm) ||
            p.barcode.includes(searchTerm)
        );

        if (products.length === 0) {
            document.getElementById('quickSearchResults').innerHTML = `
                <p class="text-muted text-center" style="padding: 2rem;">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i><br>
                    No products found matching "${searchTerm}"
                </p>
            `;
            return;
        }

        document.getElementById('quickSearchResults').innerHTML = `
            <div style="display: grid; gap: var(--spacing-md);">
                ${products.slice(0, 10).map(product => `
                    <div class="card" style="padding: var(--spacing-md);">
                        <div style="display: flex; gap: var(--spacing-md); align-items: center;">
                            <img src="${product.image}" 
                                style="width: 80px; height: 80px; object-fit: cover; border-radius: var(--border-radius-sm);" 
                                alt="${product.name}">
                            <div style="flex: 1;">
                                <h4 style="margin-bottom: 4px;">${product.name}</h4>
                                <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 8px;">
                                    SKU: ${product.sku} | Barcode: ${product.barcode}
                                </p>
                                <div style="display: flex; gap: var(--spacing-md); align-items: center;">
                                    <div>
                                        <span style="font-size: var(--font-size-xs); color: var(--text-muted);">Price</span><br>
                                        <span style="font-size: var(--font-size-xl); font-weight: 700; color: var(--accent-color);">
                                            ${settings.currencySymbol}${product.price.toFixed(2)}
                                        </span>
                                    </div>
                                    <div>
                                        <span style="font-size: var(--font-size-xs); color: var(--text-muted);">Stock</span><br>
                                        <span style="font-size: var(--font-size-xl); font-weight: 700; ${product.stock <= product.minStock ? 'color: var(--danger-color);' : ''}">
                                            ${product.stock}
                                        </span>
                                    </div>
                                    <div>
                                        <span style="font-size: var(--font-size-xs); color: var(--text-muted);">Status</span><br>
                                        ${product.stock <= product.minStock
                ? '<span class="badge badge-danger">Low Stock</span>'
                : product.stock > 0
                    ? '<span class="badge badge-success">Available</span>'
                    : '<span class="badge badge-danger">Out of Stock</span>'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            ${products.length > 10 ? `<p class="text-muted text-center mt-1">Showing 10 of ${products.length} results</p>` : ''}
        `;
    }
};

// Quick Customer Lookup Module
const QuickCustomers = {
    render() {
        return `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-user-check"></i> Customer Lookup</h3>
                </div>
                <div class="card-body">
                    <div class="search-bar mb-2">
                        <i class="fas fa-search"></i>
                        <input type="text" 
                            class="form-control" 
                            id="quickCustomerSearch" 
                            placeholder="Search by name, email, or phone..."
                            autofocus>
                    </div>

                    <div class="alert alert-info">
                        <i class="fas fa-info-circle"></i> 
                        Look up customer information and loyalty points
                    </div>

                    <div id="quickCustomerResults"></div>
                </div>
            </div>
        `;
    },

    init() {
        setTimeout(() => {
            const searchInput = document.getElementById('quickCustomerSearch');
            if (searchInput) {
                searchInput.addEventListener('input', () => this.search());
                searchInput.focus();
            }
        }, 100);
    },

    search() {
        const searchTerm = document.getElementById('quickCustomerSearch')?.value.toLowerCase() || '';
        const settings = DataManager.getSettings();

        if (searchTerm.length < 2) {
            document.getElementById('quickCustomerResults').innerHTML = '';
            return;
        }

        let customers = DataManager.getCustomers().filter(c =>
            c.name.toLowerCase().includes(searchTerm) ||
            c.email.toLowerCase().includes(searchTerm) ||
            c.phone.includes(searchTerm)
        );

        if (customers.length === 0) {
            document.getElementById('quickCustomerResults').innerHTML = `
                <p class="text-muted text-center" style="padding: 2rem;">
                    <i class="fas fa-user-slash" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i><br>
                    No customers found matching "${searchTerm}"
                </p>
            `;
            return;
        }

        document.getElementById('quickCustomerResults').innerHTML = `
            <div style="display: grid; gap: var(--spacing-md);">
                ${customers.slice(0, 10).map(customer => {
            const transactions = DataManager.getTransactions().filter(t => t.customerId === customer.id);
            return `
                        <div class="card" style="padding: var(--spacing-md);">
                            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--spacing-sm);">
                                <div>
                                    <h4 style="margin-bottom: 4px;">${customer.name}</h4>
                                    <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 4px;">
                                        <i class="fas fa-envelope"></i> ${customer.email}
                                    </p>
                                    <p style="color: var(--text-muted); font-size: 0.875rem;">
                                        <i class="fas fa-phone"></i> ${customer.phone}
                                    </p>
                                </div>
                                <span class="badge badge-primary" style="font-size: var(--font-size-base); padding: 8px 16px;">
                                    ${customer.points} Points
                                </span>
                            </div>
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--spacing-md); padding-top: var(--spacing-sm); border-top: 1px solid var(--border-color);">
                                <div>
                                    <div style="font-size: var(--font-size-xs); color: var(--text-muted);">Total Spent</div>
                                    <div style="font-weight: 700; color: var(--accent-color);">
                                        ${settings.currencySymbol}${customer.totalSpent.toFixed(2)}
                                    </div>
                                </div>
                                <div>
                                    <div style="font-size: var(--font-size-xs); color: var(--text-muted);">Purchases</div>
                                    <div style="font-weight: 700;">
                                        ${transactions.length}
                                    </div>
                                </div>
                                <div>
                                    <div style="font-size: var(--font-size-xs); color: var(--text-muted);">Last Visit</div>
                                    <div style="font-weight: 600; font-size: 0.875rem;">
                                        ${customer.lastPurchase ? new Date(customer.lastPurchase).toLocaleDateString() : 'Never'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
        }).join('')}
            </div>
            ${customers.length > 10 ? `<p class="text-muted text-center mt-1">Showing 10 of ${customers.length} results</p>` : ''}
        `;
    }
};

// Today's Sales Module
const TodaySales = {
    render() {
        const transactions = DataManager.getTransactions();
        const settings = DataManager.getSettings();
        const today = new Date().toISOString().split('T')[0];

        const todayTransactions = transactions.filter(t => t.date.startsWith(today));
        const todaySales = todayTransactions.reduce((sum, t) => sum + t.total, 0);
        const todayCount = todayTransactions.length;
        const todayCash = todayTransactions.filter(t => t.paymentMethod === 'Cash').reduce((sum, t) => sum + t.total, 0);
        const todayCard = todayTransactions.filter(t => t.paymentMethod === 'Card').reduce((sum, t) => sum + t.total, 0);
        const todayMobile = todayTransactions.filter(t => t.paymentMethod === 'Mobile').reduce((sum, t) => sum + t.total, 0);

        return `
            <div class="grid grid-3 mb-2">
                <div class="stat-card">
                    <div class="stat-icon" style="background: var(--accent-gradient);">
                        <i class="fas fa-dollar-sign"></i>
                    </div>
                    <div class="stat-value">${settings.currencySymbol}${todaySales.toFixed(2)}</div>
                    <div class="stat-label">Total Sales Today</div>
                    <div class="stat-change positive">
                        <i class="fas fa-receipt"></i> ${todayCount} transactions
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon" style="background: var(--primary-gradient);">
                        <i class="fas fa-money-bill-wave"></i>
                    </div>
                    <div class="stat-value">${settings.currencySymbol}${todayCash.toFixed(2)}</div>
                    <div class="stat-label">Cash Payments</div>
                    <div class="stat-change">
                        <i class="fas fa-coins"></i> Cash drawer
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);">
                        <i class="fas fa-credit-card"></i>
                    </div>
                    <div class="stat-value">${settings.currencySymbol}${(todayCard + todayMobile).toFixed(2)}</div>
                    <div class="stat-label">Card/Mobile Payments</div>
                    <div class="stat-change">
                        <i class="fas fa-mobile-alt"></i> Digital
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-list"></i> Today's Transactions</h3>
                </div>
                <div class="card-body">
                    ${todayTransactions.length > 0 ? `
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Transaction #</th>
                                        <th>Customer</th>
                                        <th>Items</th>
                                        <th>Payment</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${todayTransactions.reverse().map(t => {
            const customer = t.customerId ? DataManager.getCustomerById(t.customerId) : null;
            return `
                                            <tr>
                                                <td>${new Date(t.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</td>
                                                <td>#${t.id}</td>
                                                <td>${customer ? customer.name : 'Walk-in'}</td>
                                                <td>${t.items.length} item(s)</td>
                                                <td><span class="badge badge-secondary">${t.paymentMethod}</span></td>
                                                <td style="font-weight: 700; color: var(--accent-color);">
                                                    ${settings.currencySymbol}${t.total.toFixed(2)}
                                                </td>
                                            </tr>
                                        `;
        }).join('')}
                                </tbody>
                            </table>
                        </div>
                    ` : `
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle"></i> No transactions yet today. Start selling!
                        </div>
                    `}
                </div>
            </div>
        `;
    },

    init() {
        // Update today's sales in topbar
        this.updateTopbarSales();
    },

    updateTopbarSales() {
        const transactions = DataManager.getTransactions();
        const settings = DataManager.getSettings();
        const today = new Date().toISOString().split('T')[0];
        const todayTransactions = transactions.filter(t => t.date.startsWith(today));
        const todaySales = todayTransactions.reduce((sum, t) => sum + t.total, 0);

        const topbarElement = document.getElementById('todaySalesTotal');
        if (topbarElement) {
            topbarElement.textContent = `${settings.currencySymbol}${todaySales.toFixed(2)}`;
        }
    }
};
