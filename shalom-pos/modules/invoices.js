// =============================================
// INVOICES / TRANSACTIONS MODULE
// =============================================

const Invoices = {
    render() {
        const transactions = DataManager.getTransactions().sort((a, b) => new Date(b.date) - new Date(a.date));
        const settings = DataManager.getSettings();

        return `
            <div class="card">
                <div class="card-header flex-between">
                    <h3 class="card-title"><i class="fas fa-file-invoice-dollar"></i> Invoices / Transactions</h3>
                    <div class="flex gap-1">
                        <input type="text" class="form-control" id="invoiceSearch" placeholder="Search invoices..." onkeyup="Invoices.filterInvoices()">
                        <button class="btn btn-secondary" onclick="Invoices.exportInvoices()">
                            <i class="fas fa-download"></i> Export
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table" id="invoicesTable">
                            <thead>
                                <tr>
                                    <th>Invoice #</th>
                                    <th>Date</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Payment</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${transactions.length > 0 ? transactions.map(t => {
            const customer = t.customerId ? DataManager.getCustomerById(t.customerId) : null;
            return `
                                        <tr>
                                            <td>#${t.id}</td>
                                            <td>${new Date(t.date).toLocaleString()}</td>
                                            <td>${customer ? customer.name : 'Walk-in'}</td>
                                            <td>${t.items.length} items</td>
                                            <td style="font-weight: bold;">${settings.currencySymbol}${t.total.toFixed(2)}</td>
                                            <td><span class="badge badge-secondary">${t.paymentMethod}</span></td>
                                            <td>
                                                <button class="btn btn-sm btn-primary" onclick="Sales.printReceipt(${t.id})">
                                                    <i class="fas fa-print"></i>
                                                </button>
                                                <button class="btn btn-sm btn-secondary" onclick="Invoices.viewDetails(${t.id})">
                                                    <i class="fas fa-eye"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    `;
        }).join('') : '<tr><td colspan="7" class="text-center">No invoices found</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    filterInvoices() {
        const input = document.getElementById('invoiceSearch');
        const filter = input.value.toUpperCase();
        const table = document.getElementById('invoicesTable');
        const tr = table.getElementsByTagName('tr');

        for (let i = 1; i < tr.length; i++) {
            let visible = false;
            const tds = tr[i].getElementsByTagName('td');
            for (let j = 0; j < tds.length - 1; j++) {
                if (tds[j]) {
                    const txtValue = tds[j].textContent || tds[j].innerText;
                    if (txtValue.toUpperCase().indexOf(filter) > -1) {
                        visible = true;
                        break;
                    }
                }
            }
            tr[i].style.display = visible ? '' : 'none';
        }
    },

    viewDetails(id) {
        const transaction = DataManager.getTransactions().find(t => t.id === id);
        if (!transaction) return;

        const settings = DataManager.getSettings();
        const customer = transaction.customerId ? DataManager.getCustomerById(transaction.customerId) : null;

        App.showModal(`Invoice #${transaction.id}`, `
            <div class="invoice-details">
                <div class="flex-between mb-2">
                    <div>
                        <strong>Date:</strong> ${new Date(transaction.date).toLocaleString()}<br>
                        <strong>Customer:</strong> ${customer ? customer.name : 'Walk-in Customer'}<br>
                        <strong>Payment Method:</strong> ${transaction.paymentMethod}
                    </div>
                    <div class="text-right">
                        <strong>Status:</strong> <span class="badge badge-success">Paid</span>
                    </div>
                </div>
                
                <table class="table mb-2">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${transaction.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.quantity}</td>
                                <td>${settings.currencySymbol}${item.price.toFixed(2)}</td>
                                <td>${settings.currencySymbol}${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" class="text-right"><strong>Subtotal:</strong></td>
                            <td>${settings.currencySymbol}${transaction.subtotal.toFixed(2)}</td>
                        </tr>
                        ${transaction.discount > 0 ? `
                        <tr>
                            <td colspan="3" class="text-right" style="color: var(--danger-color);"><strong>Discount:</strong></td>
                            <td style="color: var(--danger-color);">-${settings.currencySymbol}${transaction.discount.toFixed(2)}</td>
                        </tr>
                        ` : ''}
                        <tr>
                            <td colspan="3" class="text-right"><strong>Tax:</strong></td>
                            <td>${settings.currencySymbol}${transaction.tax.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="3" class="text-right" style="font-size: 1.2em;"><strong>Total:</strong></td>
                            <td style="font-size: 1.2em; font-weight: bold; color: var(--accent-color);">${settings.currencySymbol}${transaction.total.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `, [
            { text: 'Close', class: 'btn-secondary', onclick: 'App.closeModal()' },
            { text: 'Print', class: 'btn-primary', onclick: `Sales.printReceipt(${transaction.id})` }
        ]);
    },

    exportInvoices() {
        const transactions = DataManager.getTransactions();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(transactions));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "invoices_" + new Date().toISOString() + ".json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
};
