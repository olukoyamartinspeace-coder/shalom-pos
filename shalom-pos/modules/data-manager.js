// =============================================
// DATA MANAGER - LocalStorage Persistence
// =============================================

const DataManager = {
    // Initialize data store
    init() {
        if (!localStorage.getItem('shalom_pos_initialized')) {
            this.initializeSampleData();
            localStorage.setItem('shalom_pos_initialized', 'true');
        }
    },

    // Initialize sample data
    initializeSampleData() {
        const sampleData = {
            products: [
                { id: 1, name: 'Laptop Pro 15"', sku: 'LAP-001', barcode: '1234567890123', price: 1299.99, stock: 15, category: 'Electronics', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', minStock: 5 },
                { id: 2, name: 'Wireless Mouse', sku: 'MOU-001', barcode: '1234567890124', price: 29.99, stock: 50, category: 'Electronics', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400', minStock: 10 },
                { id: 3, name: 'Mechanical Keyboard', sku: 'KEY-001', barcode: '1234567890125', price: 89.99, stock: 30, category: 'Electronics', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400', minStock: 10 },
                { id: 4, name: 'USB-C Hub', sku: 'HUB-001', barcode: '1234567890126', price: 49.99, stock: 25, category: 'Electronics', image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400', minStock: 8 },
                { id: 5, name: 'Wireless Headphones', sku: 'HED-001', barcode: '1234567890127', price: 159.99, stock: 20, category: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', minStock: 10 },
                { id: 6, name: 'Office Chair', sku: 'CHA-001', barcode: '1234567890128', price: 249.99, stock: 12, category: 'Furniture', image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400', minStock: 5 },
                { id: 7, name: 'Standing Desk', sku: 'DSK-001', barcode: '1234567890129', price: 399.99, stock: 8, category: 'Furniture', image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=400', minStock: 3 },
                { id: 8, name: 'Monitor 27"', sku: 'MON-001', barcode: '1234567890130', price: 349.99, stock: 18, category: 'Electronics', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400', minStock: 5 },
                { id: 9, name: 'Webcam HD', sku: 'WEB-001', barcode: '1234567890131', price: 79.99, stock: 22, category: 'Electronics', image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400', minStock: 8 },
                { id: 10, name: 'Desk Lamp', sku: 'LAM-001', barcode: '1234567890132', price: 39.99, stock: 35, category: 'Furniture', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400', minStock: 10 },
                { id: 11, name: 'Notebook Set', sku: 'NOT-001', barcode: '1234567890133', price: 14.99, stock: 100, category: 'Stationery', image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400', minStock: 20 },
                { id: 12, name: 'Pen Set Premium', sku: 'PEN-001', barcode: '1234567890134', price: 24.99, stock: 75, category: 'Stationery', image: 'https://images.unsplash.com/photo-1586943759066-39cd0e3d2e15?w=400', minStock: 15 },
            ],
            customers: [
                { id: 1, name: 'John Smith', email: 'john@example.com', phone: '+1234567890', points: 450, totalSpent: 2500.50, joinDate: '2024-01-15', lastPurchase: '2024-11-20' },
                { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1234567891', points: 320, totalSpent: 1800.00, joinDate: '2024-02-10', lastPurchase: '2024-11-18' },
                { id: 3, name: 'Michael Brown', email: 'michael@example.com', phone: '+1234567892', points: 580, totalSpent: 3200.75, joinDate: '2024-01-20', lastPurchase: '2024-11-22' },
                { id: 4, name: 'Emily Davis', email: 'emily@example.com', phone: '+1234567893', points: 210, totalSpent: 1200.00, joinDate: '2024-03-05', lastPurchase: '2024-11-15' },
                { id: 5, name: 'David Wilson', email: 'david@example.com', phone: '+1234567894', points: 890, totalSpent: 5400.25, joinDate: '2023-12-01', lastPurchase: '2024-11-21' },
            ],
            transactions: [
                { id: 1, date: '2024-11-22T10:30:00', customerId: 3, items: [{ productId: 1, name: 'Laptop Pro 15"', quantity: 1, price: 1299.99 }], subtotal: 1299.99, discount: 0, tax: 104.00, total: 1403.99, paymentMethod: 'Card' },
                { id: 2, date: '2024-11-22T11:15:00', customerId: 1, items: [{ productId: 5, name: 'Wireless Headphones', quantity: 1, price: 159.99 }], subtotal: 159.99, discount: 10, tax: 12.00, total: 161.99, paymentMethod: 'Cash' },
                { id: 3, date: '2024-11-22T12:00:00', customerId: null, items: [{ productId: 11, name: 'Notebook Set', quantity: 3, price: 14.99 }, { productId: 12, name: 'Pen Set Premium', quantity: 2, price: 24.99 }], subtotal: 94.95, discount: 0, tax: 7.60, total: 102.55, paymentMethod: 'Card' },
                { id: 4, date: '2024-11-21T14:20:00', customerId: 5, items: [{ productId: 7, name: 'Standing Desk', quantity: 1, price: 399.99 }, { productId: 6, name: 'Office Chair', quantity: 1, price: 249.99 }], subtotal: 649.98, discount: 50, tax: 48.00, total: 647.98, paymentMethod: 'Card' },
                { id: 5, date: '2024-11-21T16:45:00', customerId: 2, items: [{ productId: 8, name: 'Monitor 27"', quantity: 1, price: 349.99 }], subtotal: 349.99, discount: 0, tax: 28.00, total: 377.99, paymentMethod: 'Mobile' },
            ],
            categories: [
                { id: 1, name: 'Electronics', description: 'Electronic devices and accessories' },
                { id: 2, name: 'Furniture', description: 'Office and home furniture' },
                { id: 3, name: 'Stationery', description: 'Office supplies and stationery' },
            ],
            users: [
                { id: 1, username: 'admin', role: 'Administrator', permissions: ['all'] },
                { id: 2, username: 'cashier1', role: 'Cashier', permissions: ['sales', 'customers'] },
            ],
            settings: {
                businessName: 'Shalom Store',
                taxRate: 8,
                currency: 'USD',
                currencySymbol: '$',
                receiptHeader: 'Thank you for shopping with us!',
                receiptFooter: 'Visit again soon - Where Community and Commerce Meet',
            }
        };

        Object.keys(sampleData).forEach(key => {
            this.saveData(key, sampleData[key]);
        });
    },

    // Generic CRUD operations
    saveData(key, data) {
        localStorage.setItem(`shalom_pos_${key}`, JSON.stringify(data));
    },

    getData(key) {
        const data = localStorage.getItem(`shalom_pos_${key}`);
        return data ? JSON.parse(data) : null;
    },

    // Products
    getProducts() {
        return this.getData('products') || [];
    },

    saveProducts(products) {
        this.saveData('products', products);
    },

    addProduct(product) {
        const products = this.getProducts();
        product.id = Math.max(0, ...products.map(p => p.id)) + 1;
        products.push(product);
        this.saveProducts(products);
        return product;
    },

    updateProduct(id, updatedProduct) {
        const products = this.getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updatedProduct };
            this.saveProducts(products);
            return products[index];
        }
        return null;
    },

    deleteProduct(id) {
        const products = this.getProducts().filter(p => p.id !== id);
        this.saveProducts(products);
    },

    getProductById(id) {
        return this.getProducts().find(p => p.id === id);
    },

    // Customers
    getCustomers() {
        return this.getData('customers') || [];
    },

    saveCustomers(customers) {
        this.saveData('customers', customers);
    },

    addCustomer(customer) {
        const customers = this.getCustomers();
        customer.id = Math.max(0, ...customers.map(c => c.id)) + 1;
        customer.points = 0;
        customer.totalSpent = 0;
        customer.joinDate = new Date().toISOString().split('T')[0];
        customer.lastPurchase = null;
        customers.push(customer);
        this.saveCustomers(customers);
        return customer;
    },

    updateCustomer(id, updatedCustomer) {
        const customers = this.getCustomers();
        const index = customers.findIndex(c => c.id === id);
        if (index !== -1) {
            customers[index] = { ...customers[index], ...updatedCustomer };
            this.saveCustomers(customers);
            return customers[index];
        }
        return null;
    },

    deleteCustomer(id) {
        const customers = this.getCustomers().filter(c => c.id !== id);
        this.saveCustomers(customers);
    },

    getCustomerById(id) {
        return this.getCustomers().find(c => c.id === id);
    },

    // Transactions
    getTransactions() {
        return this.getData('transactions') || [];
    },

    saveTransactions(transactions) {
        this.saveData('transactions', transactions);
    },

    addTransaction(transaction) {
        const transactions = this.getTransactions();
        transaction.id = Math.max(0, ...transactions.map(t => t.id)) + 1;
        transaction.date = new Date().toISOString();
        transactions.push(transaction);
        this.saveTransactions(transactions);

        // Update customer if applicable
        if (transaction.customerId) {
            const customer = this.getCustomerById(transaction.customerId);
            if (customer) {
                customer.totalSpent += transaction.total;
                customer.points += Math.floor(transaction.total / 10);
                customer.lastPurchase = new Date().toISOString().split('T')[0];
                this.updateCustomer(customer.id, customer);
            }
        }

        // Update product stock
        transaction.items.forEach(item => {
            const product = this.getProductById(item.productId);
            if (product) {
                product.stock -= item.quantity;
                this.updateProduct(product.id, product);
            }
        });

        return transaction;
    },

    // Categories
    getCategories() {
        return this.getData('categories') || [];
    },

    // Settings
    getSettings() {
        return this.getData('settings') || {};
    },

    saveSettings(settings) {
        this.saveData('settings', settings);
    },

    // Export data
    exportData() {
        return {
            products: this.getProducts(),
            customers: this.getCustomers(),
            transactions: this.getTransactions(),
            categories: this.getCategories(),
            settings: this.getSettings(),
        };
    },

    // Import data
    importData(data) {
        Object.keys(data).forEach(key => {
            this.saveData(key, data[key]);
        });
    },

    // Users
    getUsers() {
        return this.getData('users') || [];
    },

    saveUsers(users) {
        this.saveData('users', users);
    },

    addUser(user) {
        const users = this.getUsers();
        user.id = Math.max(0, ...users.map(u => u.id)) + 1;
        // Default role if not specified
        if (!user.role) user.role = 'User';
        users.push(user);
        this.saveUsers(users);
        return user;
    },

    updateUser(id, updatedUser) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
            users[index] = { ...users[index], ...updatedUser };
            this.saveUsers(users);
            return users[index];
        }
        return null;
    },

    deleteUser(id) {
        const users = this.getUsers().filter(u => u.id !== id);
        this.saveUsers(users);
    },

    getUserById(id) {
        return this.getUsers().find(u => u.id === id);
    },

    getUserByUsername(username) {
        return this.getUsers().find(u => u.username === username);
    },

    // Complaints
    getComplaints() {
        return this.getData('complaints') || [];
    },

    saveComplaints(complaints) {
        this.saveData('complaints', complaints);
    },

    addComplaint(complaint) {
        const complaints = this.getComplaints();
        complaint.id = Math.max(0, ...complaints.map(c => c.id)) + 1;
        complaint.date = new Date().toISOString();
        complaint.status = 'Pending';
        complaints.push(complaint);
        this.saveComplaints(complaints);
        return complaint;
    },

    resolveComplaint(id) {
        const complaints = this.getComplaints();
        const index = complaints.findIndex(c => c.id === id);
        if (index !== -1) {
            complaints[index].status = 'Resolved';
            this.saveComplaints(complaints);
            return true;
        }
        return false;
    },

    // Clear all data
    clearData() {
        const keys = ['products', 'customers', 'transactions', 'categories', 'users', 'complaints', 'settings'];
        keys.forEach(key => {
            localStorage.removeItem(`shalom_pos_${key}`);
        });
        localStorage.removeItem('shalom_pos_initialized');
    }
};
