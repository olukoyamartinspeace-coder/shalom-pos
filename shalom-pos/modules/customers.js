// =============================================
// CUSTOMERS MODULE
// =============================================

const Customers = {
    render() {
        const customers = DataManager.getCustomers();
        const settings = DataManager.getSettings();

        return `
            <div class="flex-between mb-2">
                <div class="search-bar" style="flex: 1; max-width: 400px;">
                    <i class="fas fa-search"></i>
                    <input type="text" 
                        class="form-control" 
                        id="customerSearch" 
                        placeholder="Search customers...">
                </div>
                <button class="btn btn-primary" onclick="Customers.showAddCustomer()">
                    <i class="fas fa-user-plus"></i> Add Customer
                </button>
            </div>

            <div class="card">
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Points</th>
                                    <th>Total Spent</th>
                                    <th>Join Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="customerTable">
                                ${this.renderCustomerRows(customers, settings)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    renderCustomerRows(customers, settings) {
        if (customers.length === 0) {
            return '<tr><td colspan="7" class="text-center text-muted">No customers found</td></tr>';
        }

        return customers.map(customer => `
            <tr>
                <td style="font-weight: 600;">${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td><span class="badge badge-primary">${customer.points} pts</span></td>
                <td style="font-weight: 600; color: var(--accent-color);">
                    ${settings.currencySymbol}${customer.totalSpent.toFixed(2)}
                </td>
                <td>${new Date(customer.joinDate).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="Customers.showCustomerDetails(${customer.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="Customers.showEditCustomer(${customer.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="Customers.deleteCustomer(${customer.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    },

    init() {
        setTimeout(() => {
            const searchInput = document.getElementById('customerSearch');
            if (searchInput) {
                searchInput.addEventListener('input', () => this.filterCustomers());
            }
        }, 100);
    },

    filterCustomers() {
        const searchTerm = document.getElementById('customerSearch')?.value.toLowerCase() || '';
        let customers = DataManager.getCustomers();

        if (searchTerm) {
            customers = customers.filter(c =>
                c.name.toLowerCase().includes(searchTerm) ||
                c.email.toLowerCase().includes(searchTerm) ||
                c.phone.includes(searchTerm)
            );
        }

        const settings = DataManager.getSettings();
        document.getElementById('customerTable').innerHTML = this.renderCustomerRows(customers, settings);
    },

    showAddCustomer() {
        App.showModal('Add New Customer', `
            <div class="form-group">
                <label class="form-label">Full Name *</label>
                <input type="text" class="form-control" id="customerName" placeholder="Enter customer name">
            </div>
            
            <div class="form-group">
                <label class="form-label">Email *</label>
                <input type="email" class="form-control" id="customerEmail" placeholder="customer@example.com">
            </div>
            
            <div class="form-group">
                <label class="form-label">Phone Number *</label>
                <input type="tel" class="form-control" id="customerPhone" placeholder="+1234567890">
            </div>
        `, [
            { text: 'Cancel', class: 'btn-secondary', onclick: 'App.closeModal()' },
            { text: 'Add Customer', class: 'btn-primary', onclick: 'Customers.saveCustomer()' }
        ]);
    },

    showEditCustomer(customerId) {
        const customer = DataManager.getCustomerById(customerId);
        if (!customer) return;

        App.showModal('Edit Customer', `
            <input type="hidden" id="editCustomerId" value="${customer.id}">
            
            <div class="form-group">
                <label class="form-label">Full Name *</label>
                <input type="text" class="form-control" id="customerName" value="${customer.name}">
            </div>
            
            <div class="form-group">
                <label class="form-label">Email *</label>
                <input type="email" class="form-control" id="customerEmail" value="${customer.email}">
            </div>
            
            <div class="form-group">
                <label class="form-label">Phone Number *</label>
                <input type="tel" class="form-control" id="customerPhone" value="${customer.phone}">
            </div>
            
            <div class="form-group">
                <label class="form-label">Loyalty Points</label>
                <input type="number" class="form-control" id="customerPoints" value="${customer.points}" min="0">
            </div>
        `, [
            { text: 'Cancel', class: 'btn-secondary', onclick: 'App.closeModal()' },
            { text: 'Update Customer', class: 'btn-primary', onclick: 'Customers.updateCustomer()' }
        ]);
    },

    showCustomerDetails(customerId) {
        const customer = DataManager.getCustomerById(customerId);
        const transactions = DataManager.getTransactions().filter(t => t.customerId === customerId);
        const settings = DataManager.getSettings();

        if (!customer) return;

        App.showModal(`Customer: ${customer.name}`, `
            <div class="grid grid-2 mb-2">
                <div class="stat-card">
                    <div class="stat-icon" style="background: var(--primary-gradient);">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="stat-value">${customer.points}</div>
                    <div class="stat-label">Loyalty Points</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon" style="background: var(--accent-gradient);">
                        <i class="fas fa-dollar-sign"></i>
                    </div>
                    <div class="stat-value">${settings.currencySymbol}${customer.totalSpent.toFixed(2)}</div>
                    <div class="stat-label">Total Spent</div>
                </div>
            </div>
            
            <div class="mb-2">
                <h4 style="margin-bottom: var(--spacing-sm);">Contact Information</h4>
                <p><i class="fas fa-envelope"></i> ${customer.email}</p>
                <p><i class="fas fa-phone"></i> ${customer.phone}</p>
                <p><i class="fas fa-calendar"></i> Member since ${new Date(customer.joinDate).toLocaleDateString()}</p>
                ${customer.lastPurchase ? `<p><i class="fas fa-shopping-cart"></i> Last purchase: ${new Date(customer.lastPurchase).toLocaleDateString()}</p>` : ''}
            </div>
            
            <div>
                <h4 style="margin-bottom: var(--spacing-sm);">Purchase History (${transactions.length} transactions)</h4>
                ${transactions.length > 0 ? `
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${transactions.slice(-5).reverse().map(t => `
                                    <tr>
                                        <td>${new Date(t.date).toLocaleDateString()}</td>
                                        <td>${t.items.length} item(s)</td>
                                        <td style="font-weight: 600; color: var(--accent-color);">
                                            ${settings.currencySymbol}${t.total.toFixed(2)}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                ` : '<p class="text-muted">No purchases yet</p>'}
            </div>
        `, [
            { text: 'Close', class: 'btn-secondary', onclick: 'App.closeModal()' }
        ]);
    },

    saveCustomer() {
        const customer = {
            name: document.getElementById('customerName').value,
            email: document.getElementById('customerEmail').value,
            phone: document.getElementById('customerPhone').value
        };

        if (!customer.name || !customer.email || !customer.phone) {
            alert('Please fill in all required fields!');
            return;
        }

        DataManager.addCustomer(customer);
        App.closeModal();
        App.loadModule('customers');
    },

    updateCustomer() {
        const customerId = parseInt(document.getElementById('editCustomerId').value);

        const updatedCustomer = {
            name: document.getElementById('customerName').value,
            email: document.getElementById('customerEmail').value,
            phone: document.getElementById('customerPhone').value,
            points: parseInt(document.getElementById('customerPoints').value) || 0
        };

        if (!updatedCustomer.name || !updatedCustomer.email || !updatedCustomer.phone) {
            alert('Please fill in all required fields!');
            return;
        }

        DataManager.updateCustomer(customerId, updatedCustomer);
        App.closeModal();
        App.loadModule('customers');
    },

    deleteCustomer(customerId) {
        if (confirm('Are you sure you want to delete this customer?')) {
            DataManager.deleteCustomer(customerId);
            App.loadModule('customers');
        }
    }
};
