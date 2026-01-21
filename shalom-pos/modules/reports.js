// =============================================
// REPORTS MODULE
// =============================================

const Reports = {
    render() {
        const transactions = DataManager.getTransactions();
        const settings = DataManager.getSettings();

        // Calculate totals
        const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
        const totalDiscounts = transactions.reduce((sum, t) => sum + t.discount, 0);
        const totalTax = transactions.reduce((sum, t) => sum + t.tax, 0);

        // Payment method breakdown
        const paymentMethods = {};
        transactions.forEach(t => {
            if (!paymentMethods[t.paymentMethod]) {
                paymentMethods[t.paymentMethod] = { count: 0, total: 0 };
            }
            paymentMethods[t.paymentMethod].count++;
            paymentMethods[t.paymentMethod].total += t.total;
        });

        // Best selling products
        const productSales = {};
        transactions.forEach(t => {
            t.items.forEach(item => {
                if (!productSales[item.productId]) {
                    productSales[item.productId] = {
                        name: item.name,
                        quantity: 0,
                        revenue: 0
                    };
                }
                productSales[item.productId].quantity += item.quantity;
                productSales[item.productId].revenue += item.price * item.quantity;
            });
        });

        const bestSelling = Object.values(productSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);

        // Top customers
        const customers = DataManager.getCustomers()
            .sort((a, b) => b.totalSpent - a.totalSpent)
            .slice(0, 10);

        return `
            <div class="grid grid-3 mb-2">
                <div class="stat-card">
                    <div class="stat-icon" style="background: var(--accent-gradient);">
                        <i class="fas fa-dollar-sign"></i>
                    </div>
                    <div class="stat-value">${settings.currencySymbol}${totalRevenue.toFixed(2)}</div>
                    <div class="stat-label">Total Revenue</div>
                    <div class="stat-change positive">
                        <i class="fas fa-chart-line"></i> ${transactions.length} transactions
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon" style="background: var(--primary-gradient);">
                        <i class="fas fa-receipt"></i>
                    </div>
                    <div class="stat-value">${settings.currencySymbol}${totalTax.toFixed(2)}</div>
                    <div class="stat-label">Total Tax Collected</div>
                    <div class="stat-change">
                        <i class="fas fa-percentage"></i> ${settings.taxRate}% tax rate
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
                        <i class="fas fa-tags"></i>
                    </div>
                    <div class="stat-value">${settings.currencySymbol}${totalDiscounts.toFixed(2)}</div>
                    <div class="stat-label">Total Discounts</div>
                    <div class="stat-change">
                        <i class="fas fa-percent"></i> Applied discounts
                    </div>
                </div>
            </div>

            <div class="grid grid-2 mb-2">
                <!-- Best Selling Products -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title"><i class="fas fa-trophy"></i> Best Selling Products</h3>
                    </div>
                    <div class="card-body">
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Product</th>
                                        <th>Sold</th>
                                        <th>Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${bestSelling.map((product, index) => `
                                        <tr>
                                            <td>${index + 1}</td>
                                            <td style="font-weight: 600;">${product.name}</td>
                                            <td>${product.quantity} units</td>
                                            <td style="font-weight: 600; color: var(--accent-color);">
                                                ${settings.currencySymbol}${product.revenue.toFixed(2)}
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Payment Methods -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title"><i class="fas fa-credit-card"></i> Payment Methods</h3>
                    </div>
                    <div class="card-body">
                        ${Object.keys(paymentMethods).length > 0 ? `
                            <div style="display: flex; flex-direction: column; gap: 16px;">
                                ${Object.entries(paymentMethods).map(([method, data]) => {
            const percentage = (data.total / totalRevenue * 100).toFixed(1);
            return `
                                        <div>
                                            <div class="flex-between mb-1">
                                                <span style="font-weight: 600;">
                                                    <i class="fas fa-${method === 'Cash' ? 'money-bill' : method === 'Card' ? 'credit-card' : 'mobile'}"></i>
                                                    ${method}
                                                </span>
                                                <span style="color: var(--accent-color); font-weight: 700;">
                                                    ${settings.currencySymbol}${data.total.toFixed(2)}
                                                </span>
                                            </div>
                                            <div style="background: var(--bg-tertiary); height: 8px; border-radius: 4px; overflow: hidden;">
                                                <div style="
                                                    width: ${percentage}%;
                                                    height: 100%;
                                                    background: var(--accent-gradient);
                                                    transition: width 0.3s ease;
                                                "></div>
                                            </div>
                                            <div style="font-size: 0.875rem; color: var(--text-muted); margin-top: 4px;">
                                                ${data.count} transactions (${percentage}%)
                                            </div>
                                        </div>
                                    `;
        }).join('')}
                            </div>
                        ` : '<p class="text-muted text-center">No payment data available</p>'}
                    </div>
                </div>
            </div>

            <!-- Top Customers -->
            <div class="card mb-2">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-users"></i> Top Customers</h3>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Points</th>
                                    <th>Total Spent</th>
                                    <th>Last Purchase</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${customers.map((customer, index) => `
                                    <tr>
                                        <td>${index + 1}</td>
                                        <td style="font-weight: 600;">${customer.name}</td>
                                        <td>${customer.email}</td>
                                        <td><span class="badge badge-primary">${customer.points} pts</span></td>
                                        <td style="font-weight: 600; color: var(--accent-color);">
                                            ${settings.currencySymbol}${customer.totalSpent.toFixed(2)}
                                        </td>
                                        <td>${customer.lastPurchase ? new Date(customer.lastPurchase).toLocaleDateString() : 'N/A'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- All Transactions -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-list"></i> All Transactions</h3>
                    <button class="btn btn-sm btn-primary" onclick="Reports.exportToCSV()">
                        <i class="fas fa-download"></i> Export CSV
                    </button>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Date</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Subtotal</th>
                                    <th>Discount</th>
                                    <th>Tax</th>
                                    <th>Total</th>
                                    <th>Payment</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${transactions.reverse().map(t => {
            const customer = t.customerId ? DataManager.getCustomerById(t.customerId) : null;
            return `
                                        <tr>
                                            <td>#${t.id}</td>
                                            <td>${new Date(t.date).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}</td>
                                            <td>${customer ? customer.name : 'Walk-in'}</td>
                                            <td>${t.items.length} item(s)</td>
                                            <td>${settings.currencySymbol}${t.subtotal.toFixed(2)}</td>
                                            <td style="color: var(--danger-color);">
                                                ${t.discount > 0 ? '-' + settings.currencySymbol + t.discount.toFixed(2) : '-'}
                                            </td>
                                            <td>${settings.currencySymbol}${t.tax.toFixed(2)}</td>
                                            <td style="font-weight: 600; color: var(--accent-color);">
                                                ${settings.currencySymbol}${t.total.toFixed(2)}
                                            </td>
                                            <td><span class="badge badge-secondary">${t.paymentMethod}</span></td>
                                        </tr>
                                    `;
        }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    exportToCSV() {
        const transactions = DataManager.getTransactions();
        const settings = DataManager.getSettings();

        let csv = 'Transaction ID,Date,Customer,Items,Subtotal,Discount,Tax,Total,Payment Method\n';

        transactions.forEach(t => {
            const customer = t.customerId ? DataManager.getCustomerById(t.customerId) : null;
            const customerName = customer ? customer.name : 'Walk-in';
            const itemsCount = t.items.length;

            csv += `#${t.id},`;
            csv += `${new Date(t.date).toLocaleString()},`;
            csv += `${customerName},`;
            csv += `${itemsCount},`;
            csv += `${settings.currencySymbol}${t.subtotal.toFixed(2)},`;
            csv += `${settings.currencySymbol}${t.discount.toFixed(2)},`;
            csv += `${settings.currencySymbol}${t.tax.toFixed(2)},`;
            csv += `${settings.currencySymbol}${t.total.toFixed(2)},`;
            csv += `${t.paymentMethod}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `shalom_pos_transactions_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
};
