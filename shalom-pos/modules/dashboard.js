// =============================================
// DASHBOARD MODULE
// =============================================

const Dashboard = {
    render() {
        const products = DataManager.getProducts();
        const customers = DataManager.getCustomers();
        const transactions = DataManager.getTransactions();
        const settings = DataManager.getSettings();

        // Calculate statistics
        const today = new Date().toISOString().split('T')[0];
        const todayTransactions = transactions.filter(t => t.date.startsWith(today));
        const todaySales = todayTransactions.reduce((sum, t) => sum + t.total, 0);
        const todayCount = todayTransactions.length;

        const lowStockProducts = products.filter(p => p.stock <= p.minStock);

        // Get top selling products
        const productSales = {};
        transactions.forEach(t => {
            t.items.forEach(item => {
                if (!productSales[item.productId]) {
                    productSales[item.productId] = { name: item.name, quantity: 0, revenue: 0 };
                }
                productSales[item.productId].quantity += item.quantity;
                productSales[item.productId].revenue += item.price * item.quantity;
            });
        });

        const topProducts = Object.values(productSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        // Get last 7 days sales
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayTransactions = transactions.filter(t => t.date.startsWith(dateStr));
            const daySales = dayTransactions.reduce((sum, t) => sum + t.total, 0);
            last7Days.push({ date: dateStr, sales: daySales });
        }

        const maxSales = Math.max(...last7Days.map(d => d.sales), 1);

        return `
            <div class="grid grid-4 mb-2">
                <!-- Today's Sales -->
                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
                        <i class="fas fa-dollar-sign"></i>
                    </div>
                    <div class="stat-value">${settings.currencySymbol}${todaySales.toFixed(2)}</div>
                    <div class="stat-label">Today's Sales</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i> ${todayCount} transactions
                    </div>
                </div>

                <!-- Total Products -->
                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #6366f1 0%, #3b82f6 100%);">
                        <i class="fas fa-boxes"></i>
                    </div>
                    <div class="stat-value">${products.length}</div>
                    <div class="stat-label">Total Products</div>
                    <div class="stat-change ${lowStockProducts.length > 0 ? 'negative' : 'positive'}">
                        <i class="fas fa-exclamation-triangle"></i> ${lowStockProducts.length} low stock
                    </div>
                </div>

                <!-- Total Customers -->
                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-value">${customers.length}</div>
                    <div class="stat-label">Total Customers</div>
                    <div class="stat-change positive">
                        <i class="fas fa-user-plus"></i> Active customers
                    </div>
                </div>

                <!-- Total Revenue -->
                <div class="stat-card">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="stat-value">${settings.currencySymbol}${transactions.reduce((sum, t) => sum + t.total, 0).toFixed(2)}</div>
                    <div class="stat-label">Total Revenue</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i> ${transactions.length} total sales
                    </div>
                </div>
            </div>

            <div class="grid grid-2 mb-2">
                <!-- Sales Chart -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title"><i class="fas fa-chart-area"></i> 7-Day Sales Trend</h3>
                    </div>
                    <div class="card-body">
                        <div style="display: flex; align-items: flex-end; gap: 8px; height: 200px;">
                            ${last7Days.map(day => `
                                <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end;">
                                    <div style="
                                        width: 100%;
                                        background: var(--primary-gradient);
                                        border-radius: 4px 4px 0 0;
                                        height: ${(day.sales / maxSales) * 180}px;
                                        min-height: 4px;
                                        transition: all 0.3s ease;
                                    " title="${settings.currencySymbol}${day.sales.toFixed(2)}"></div>
                                    <div style="font-size: 0.7rem; margin-top: 4px; color: var(--text-muted);">
                                        ${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Top Products -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title"><i class="fas fa-star"></i> Top Selling Products</h3>
                    </div>
                    <div class="card-body">
                        ${topProducts.length > 0 ? `
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                ${topProducts.map((product, index) => `
                                    <div style="display: flex; align-items: center; gap: 12px; padding: 8px; background: var(--bg-tertiary); border-radius: 8px;">
                                        <div style="
                                            width: 32px;
                                            height: 32px;
                                            border-radius: 50%;
                                            background: var(--primary-gradient);
                                            display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            font-weight: 700;
                                            color: white;
                                        ">${index + 1}</div>
                                        <div style="flex: 1;">
                                            <div style="font-weight: 600;">${product.name}</div>
                                            <div style="font-size: 0.875rem; color: var(--text-muted);">
                                                ${product.quantity} units sold
                                            </div>
                                        </div>
                                        <div style="font-weight: 700; color: var(--accent-color);">
                                            ${settings.currencySymbol}${product.revenue.toFixed(2)}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : '<p class="text-muted text-center">No sales data available</p>'}
                    </div>
                </div>
            </div>

            <div class="grid grid-2">
                <!-- Recent Transactions -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title"><i class="fas fa-receipt"></i> Recent Transactions</h3>
                    </div>
                    <div class="card-body">
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Date</th>
                                        <th>Items</th>
                                        <th>Total</th>
                                        <th>Payment</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${transactions.slice(-10).reverse().map(t => `
                                        <tr>
                                            <td>#${t.id}</td>
                                            <td>${new Date(t.date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}</td>
                                            <td>${t.items.length} item(s)</td>
                                            <td style="font-weight: 600; color: var(--accent-color);">
                                                ${settings.currencySymbol}${t.total.toFixed(2)}
                                            </td>
                                            <td>
                                                <span class="badge badge-secondary">${t.paymentMethod}</span>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Low Stock Alert -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title"><i class="fas fa-exclamation-triangle"></i> Low Stock Alerts</h3>
                    </div>
                    <div class="card-body">
                        ${lowStockProducts.length > 0 ? `
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                ${lowStockProducts.map(product => `
                                    <div class="alert alert-warning" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0;">
                                        <div>
                                            <strong>${product.name}</strong><br>
                                            <small>SKU: ${product.sku}</small>
                                        </div>
                                        <div>
                                            <span class="badge badge-warning">${product.stock} left</span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : `
                            <div class="alert alert-success">
                                <i class="fas fa-check-circle"></i> All products are well stocked!
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;
    }
};
