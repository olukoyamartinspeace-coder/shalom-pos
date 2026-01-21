// =============================================
// SALES / POS MODULE
// =============================================

const Sales = {
    cart: [],
    selectedCustomer: null,
    discount: 0,

    render() {
        const products = DataManager.getProducts();
        const settings = DataManager.getSettings();

        return `
            <div class="grid grid-3" style="height: calc(100vh - 200px);">
                <!-- Products Section -->
                <div style="grid-column: span 2;">
                    <div class="card" style="height: 100%; display: flex; flex-direction: column;">
                        <div class="card-header">
                            <h3 class="card-title"><i class="fas fa-shopping-bag"></i> Products</h3>
                        </div>
                        <div class="card-body" style="padding-bottom: 0;">
                            <div class="search-bar mb-1">
                                <i class="fas fa-search"></i>
                                <input type="text" 
                                    class="form-control" 
                                    id="productSearch" 
                                    placeholder="Search by name, SKU, or barcode...">
                            </div>
                            <div id="categoryFilter" class="mb-1" style="display: flex; gap: 8px; flex-wrap: wrap;">
                                <button class="btn btn-sm btn-primary category-filter-btn active" data-category="all">
                                    All Products
                                </button>
                                ${DataManager.getCategories().map(cat => `
                                    <button class="btn btn-sm btn-secondary category-filter-btn" data-category="${cat.name}">
                                        ${cat.name}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                        <div style="flex: 1; overflow-y: auto; padding: 0 var(--spacing-md) var(--spacing-md);">
                            <div class="product-grid" id="productGrid">
                                ${this.renderProducts(products)}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Cart Section -->
                <div>
                    <div class="card" style="height: 100%; display: flex; flex-direction: column;">
                        <div class="card-header">
                            <h3 class="card-title"><i class="fas fa-shopping-cart"></i> Cart</h3>
                            <button class="btn btn-sm btn-danger" onclick="Sales.clearCart()">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        <div style="flex: 1; overflow-y: auto; padding: var(--spacing-md);">
                            <div id="cartItems">
                                ${this.renderCart()}
                            </div>
                        </div>
                        <div style="padding: var(--spacing-md); border-top: 1px solid var(--border-color);">
                            <!-- Customer Selection -->
                            <div class="form-group">
                                <label class="form-label">Customer (Optional)</label>
                                <select class="form-control" id="customerSelect" onchange="Sales.selectCustomer()">
                                    <option value="">Walk-in Customer</option>
                                    ${DataManager.getCustomers().map(c => `
                                        <option value="${c.id}">${c.name} - ${c.points} pts</option>
                                    `).join('')}
                                </select>
                            </div>

                            <!-- Discount -->
                            <div class="form-group">
                                <label class="form-label">Discount</label>
                                <div class="flex gap-1">
                                    <input type="number" 
                                        class="form-control" 
                                        id="discountInput" 
                                        value="${this.discount}" 
                                        min="0"
                                        placeholder="0.00"
                                        onchange="Sales.setDiscount()">
                                    <select class="form-control" id="discountType" style="max-width: 100px;" onchange="Sales.setDiscount()">
                                        <option value="fixed">${settings.currencySymbol}</option>
                                        <option value="percent">%</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Totals -->
                            <div id="cartTotals">
                                ${this.renderTotals()}
                            </div>

                            <!-- Checkout Button -->
                            <button class="btn btn-accent btn-block btn-lg" onclick="Sales.showCheckout()" ${this.cart.length === 0 ? 'disabled' : ''}>
                                <i class="fas fa-cash-register"></i> Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderProducts(products) {
        if (products.length === 0) {
            return '<p class="text-muted text-center" style="grid-column: 1/-1; padding: 2rem;">No products found</p>';
        }

        return products.map(product => `
            <div class="product-item" onclick="Sales.addToCart(${product.id})">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-name">${product.name}</div>
                <div class="product-price">${DataManager.getSettings().currencySymbol}${product.price.toFixed(2)}</div>
                <div class="product-stock ${product.stock <= product.minStock ? 'text-danger' : ''}">
                    ${product.stock} in stock
                </div>
            </div>
        `).join('');
    },

    renderCart() {
        if (this.cart.length === 0) {
            return '<p class="text-muted text-center">Cart is empty</p>';
        }

        const settings = DataManager.getSettings();
        return this.cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${settings.currencySymbol}${item.price.toFixed(2)} each</div>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="Sales.decreaseQuantity(${index})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="Sales.increaseQuantity(${index})">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="qty-btn" onclick="Sales.removeFromCart(${index})" style="margin-left: 8px;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `).join('');
    },

    renderTotals() {
        const settings = DataManager.getSettings();
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        let discountAmount = 0;
        const discountType = document.getElementById('discountType')?.value || 'fixed';
        if (discountType === 'percent') {
            discountAmount = subtotal * (this.discount / 100);
        } else {
            discountAmount = this.discount;
        }

        const afterDiscount = Math.max(0, subtotal - discountAmount);
        const tax = afterDiscount * (settings.taxRate / 100);
        const total = afterDiscount + tax;

        return `
            <div style="background: var(--bg-tertiary); padding: var(--spacing-md); border-radius: var(--border-radius-sm); margin-bottom: var(--spacing-md);">
                <div class="flex-between mb-1">
                    <span>Subtotal:</span>
                    <span style="font-weight: 600;">${settings.currencySymbol}${subtotal.toFixed(2)}</span>
                </div>
                ${discountAmount > 0 ? `
                    <div class="flex-between mb-1" style="color: var(--danger-color);">
                        <span>Discount:</span>
                        <span style="font-weight: 600;">-${settings.currencySymbol}${discountAmount.toFixed(2)}</span>
                    </div>
                ` : ''}
                <div class="flex-between mb-1">
                    <span>Tax (${settings.taxRate}%):</span>
                    <span style="font-weight: 600;">${settings.currencySymbol}${tax.toFixed(2)}</span>
                </div>
                <div style="border-top: 2px solid var(--border-color); margin: var(--spacing-sm) 0; padding-top: var(--spacing-sm);"></div>
                <div class="flex-between">
                    <span style="font-size: var(--font-size-lg); font-weight: 700;">Total:</span>
                    <span style="font-size: var(--font-size-xl); font-weight: 700; color: var(--accent-color);">
                        ${settings.currencySymbol}${total.toFixed(2)}
                    </span>
                </div>
            </div>
        `;
    },

    init() {
        this.setupEventListeners();
    },

    setupEventListeners() {
        setTimeout(() => {
            const searchInput = document.getElementById('productSearch');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => this.filterProducts());
            }

            const categoryBtns = document.querySelectorAll('.category-filter-btn');
            categoryBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    categoryBtns.forEach(b => b.classList.remove('active', 'btn-primary'));
                    categoryBtns.forEach(b => b.classList.add('btn-secondary'));
                    e.target.classList.remove('btn-secondary');
                    e.target.classList.add('active', 'btn-primary');
                    this.filterProducts();
                });
            });
        }, 100);
    },

    filterProducts() {
        const searchTerm = document.getElementById('productSearch')?.value.toLowerCase() || '';
        const activeCategory = document.querySelector('.category-filter-btn.active')?.dataset.category || 'all';

        let products = DataManager.getProducts();

        if (searchTerm) {
            products = products.filter(p =>
                p.name.toLowerCase().includes(searchTerm) ||
                p.sku.toLowerCase().includes(searchTerm) ||
                p.barcode.includes(searchTerm)
            );
        }

        if (activeCategory !== 'all') {
            products = products.filter(p => p.category === activeCategory);
        }

        document.getElementById('productGrid').innerHTML = this.renderProducts(products);
    },

    addToCart(productId) {
        const product = DataManager.getProductById(productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);

        if (existingItem) {
            if (existingItem.quantity < product.stock) {
                existingItem.quantity++;
            } else {
                alert('Not enough stock available!');
                return;
            }
        } else {
            if (product.stock > 0) {
                this.cart.push({
                    id: product.id,
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1
                });
            } else {
                alert('Product out of stock!');
                return;
            }
        }

        this.updateCartDisplay();
    },

    removeFromCart(index) {
        this.cart.splice(index, 1);
        this.updateCartDisplay();
    },

    increaseQuantity(index) {
        const item = this.cart[index];
        const product = DataManager.getProductById(item.productId);

        if (item.quantity < product.stock) {
            item.quantity++;
            this.updateCartDisplay();
        } else {
            alert('Not enough stock available!');
        }
    },

    decreaseQuantity(index) {
        if (this.cart[index].quantity > 1) {
            this.cart[index].quantity--;
            this.updateCartDisplay();
        } else {
            this.removeFromCart(index);
        }
    },

    updateCartDisplay() {
        document.getElementById('cartItems').innerHTML = this.renderCart();
        document.getElementById('cartTotals').innerHTML = this.renderTotals();
    },

    selectCustomer() {
        const customerId = document.getElementById('customerSelect')?.value;
        this.selectedCustomer = customerId ? parseInt(customerId) : null;
    },

    setDiscount() {
        const discountValue = parseFloat(document.getElementById('discountInput')?.value || 0);
        this.discount = Math.max(0, discountValue);
        this.updateCartDisplay();
    },

    clearCart() {
        if (confirm('Are you sure you want to clear the cart?')) {
            this.cart = [];
            this.discount = 0;
            this.selectedCustomer = null;
            if (document.getElementById('customerSelect')) {
                document.getElementById('customerSelect').value = '';
            }
            if (document.getElementById('discountInput')) {
                document.getElementById('discountInput').value = '0';
            }
            this.updateCartDisplay();
        }
    },

    showCheckout() {
        const settings = DataManager.getSettings();
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        let discountAmount = 0;
        const discountType = document.getElementById('discountType')?.value || 'fixed';
        if (discountType === 'percent') {
            discountAmount = subtotal * (this.discount / 100);
        } else {
            discountAmount = this.discount;
        }

        const afterDiscount = Math.max(0, subtotal - discountAmount);
        const tax = afterDiscount * (settings.taxRate / 100);
        const total = afterDiscount + tax;

        App.showModal('Complete Payment', `
            <div class="mb-2">
                <h3 style="font-size: var(--font-size-xl); margin-bottom: var(--spacing-md);">
                    Total Amount: <span style="color: var(--accent-color);">${settings.currencySymbol}${total.toFixed(2)}</span>
                </h3>
            </div>
            
            <div class="form-group">
                <label class="form-label">Payment Method</label>
                <select class="form-control" id="paymentMethod">
                    <option value="Cash">Cash</option>
                    <option value="Transfer">Bank Transfer</option>
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label">Notes (Optional)</label>
                <textarea class="form-control" id="orderNotes" placeholder="Add any notes for this transaction..."></textarea>
            </div>
        `, [
            { text: 'Cancel', class: 'btn-secondary', onclick: 'App.closeModal()' },
            { text: 'Complete Sale', class: 'btn-accent', onclick: 'Sales.completeSale()' }
        ]);
    },

    completeSale() {
        const settings = DataManager.getSettings();
        const paymentMethod = document.getElementById('paymentMethod')?.value || 'Cash';

        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        let discountAmount = 0;
        const discountType = document.getElementById('discountType')?.value || 'fixed';
        if (discountType === 'percent') {
            discountAmount = subtotal * (this.discount / 100);
        } else {
            discountAmount = this.discount;
        }

        const afterDiscount = Math.max(0, subtotal - discountAmount);
        const tax = afterDiscount * (settings.taxRate / 100);
        const total = afterDiscount + tax;

        const transaction = {
            customerId: this.selectedCustomer,
            items: this.cart.map(item => ({ ...item })),
            subtotal: subtotal,
            discount: discountAmount,
            tax: tax,
            total: total,
            paymentMethod: paymentMethod,
            date: new Date().toISOString()
        };

        const savedTransaction = DataManager.addTransaction(transaction);

        // Show success message
        App.closeModal();
        App.showModal('Sale Completed! 🎉', `
            <div style="text-align: center; padding: var(--spacing-lg);">
                <div style="font-size: 4rem; margin-bottom: var(--spacing-md);">
                    <i class="fas fa-check-circle" style="color: var(--accent-color);"></i>
                </div>
                <h3 style="margin-bottom: var(--spacing-md);">Transaction #${savedTransaction.id}</h3>
                <p style="font-size: var(--font-size-xl); color: var(--accent-color); font-weight: 700; margin-bottom: var(--spacing-md);">
                    ${settings.currencySymbol}${total.toFixed(2)}
                </p>
                <p class="text-muted">Payment via ${paymentMethod}</p>
            </div>
        `, [
            { text: 'New Sale', class: 'btn-primary', onclick: 'Sales.newSale()' },
            { text: 'Print Receipt', class: 'btn-secondary', onclick: 'Sales.printReceipt(' + savedTransaction.id + ')' }
        ]);
    },

    newSale() {
        this.clearCart();
        App.closeModal();
    },

    printReceipt(transactionId) {
        const transaction = DataManager.getTransactions().find(t => t.id === transactionId);
        const settings = DataManager.getSettings();

        if (!transaction) return;

        const receiptContent = `
            <html>
            <head>
                <title>Receipt #${transaction.id}</title>
                <style>
                    body { font-family: 'Courier New', monospace; padding: 20px; max-width: 300px; margin: 0 auto; background: #fff; color: #000; }
                    .header { text-align: center; margin-bottom: 20px; }
                    .business-name { font-size: 1.2rem; font-weight: bold; margin-bottom: 5px; }
                    .divider { border-top: 1px dashed #000; margin: 10px 0; }
                    .item { display: flex; justify-content: space-between; margin: 5px 0; font-size: 0.9rem; }
                    .total { font-size: 1.1rem; font-weight: bold; margin-top: 10px; }
                    .footer { text-align: center; margin-top: 20px; font-size: 0.8rem; }
                    @media print {
                        body { width: 100%; max-width: none; padding: 0; }
                        @page { margin: 0; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="business-name">${settings.businessName}</div>
                    <div>${settings.receiptHeader}</div>
                </div>
                <div class="divider"></div>
                <div class="item"><span>Date:</span><span>${new Date(transaction.date).toLocaleString()}</span></div>
                <div class="item"><span>Receipt #:</span><span>${transaction.id}</span></div>
                <div class="item"><span>Payment:</span><span>${transaction.paymentMethod}</span></div>
                <div class="divider"></div>
                ${transaction.items.map(item => `
                    <div class="item">
                        <span>${item.name} x${item.quantity}</span>
                        <span>${settings.currencySymbol}${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
                <div class="divider"></div>
                <div class="item"><span>Subtotal:</span><span>${settings.currencySymbol}${transaction.subtotal.toFixed(2)}</span></div>
                ${transaction.discount > 0 ? `<div class="item"><span>Discount:</span><span>-${settings.currencySymbol}${transaction.discount.toFixed(2)}</span></div>` : ''}
                <div class="item"><span>Tax (${settings.taxRate}%):</span><span>${settings.currencySymbol}${transaction.tax.toFixed(2)}</span></div>
                <div class="divider"></div>
                <div class="item total"><span>TOTAL:</span><span>${settings.currencySymbol}${transaction.total.toFixed(2)}</span></div>
                <div class="divider"></div>
                <div class="footer">${settings.receiptFooter}</div>
                <script>
                    window.onload = function() { window.print(); window.onafterprint = function() { window.close(); } };
                </script>
            </body>
            </html>
        `;

        const receiptWindow = window.open('', '_blank', 'width=400,height=600');
        if (receiptWindow) {
            receiptWindow.document.write(receiptContent);
            receiptWindow.document.close();
        } else {
            alert('Popup blocked! Please allow popups to print receipts.');
        }
    }
};
