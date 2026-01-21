// =============================================
// INVENTORY MODULE
// =============================================

const Inventory = {
    render() {
        const products = DataManager.getProducts();
        const categories = DataManager.getCategories();
        const settings = DataManager.getSettings();

        return `
            <div class="flex-between mb-2">
                <div class="search-bar" style="flex: 1; max-width: 400px;">
                    <i class="fas fa-search"></i>
                    <input type="text" 
                        class="form-control" 
                        id="inventorySearch" 
                        placeholder="Search products...">
                </div>
                <button class="btn btn-primary" onclick="Inventory.showAddProduct()">
                    <i class="fas fa-plus"></i> Add Product
                </button>
            </div>

            <div class="card">
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>SKU</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="inventoryTable">
                                ${this.renderProductRows(products, settings)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    renderProductRows(products, settings) {
        if (products.length === 0) {
            return '<tr><td colspan="8" class="text-center text-muted">No products found</td></tr>';
        }

        return products.map(product => `
            <tr>
                <td>
                    <img src="${product.image}" 
                        style="width: 48px; height: 48px; object-fit: cover; border-radius: 8px;" 
                        alt="${product.name}">
                </td>
                <td style="font-weight: 600;">${product.name}</td>
                <td><span class="badge badge-secondary">${product.sku}</span></td>
                <td>${product.category}</td>
                <td style="font-weight: 600; color: var(--accent-color);">
                    ${settings.currencySymbol}${product.price.toFixed(2)}
                </td>
                <td style="font-weight: 600; ${product.stock <= product.minStock ? 'color: var(--danger-color);' : ''}">
                    ${product.stock}
                </td>
                <td>
                    ${product.stock <= product.minStock
                ? '<span class="badge badge-danger">Low Stock</span>'
                : '<span class="badge badge-success">In Stock</span>'}
                </td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="Inventory.showEditProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="Inventory.deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    },

    init() {
        setTimeout(() => {
            const searchInput = document.getElementById('inventorySearch');
            if (searchInput) {
                searchInput.addEventListener('input', () => this.filterProducts());
            }
        }, 100);
    },

    filterProducts() {
        const searchTerm = document.getElementById('inventorySearch')?.value.toLowerCase() || '';
        let products = DataManager.getProducts();

        if (searchTerm) {
            products = products.filter(p =>
                p.name.toLowerCase().includes(searchTerm) ||
                p.sku.toLowerCase().includes(searchTerm) ||
                p.category.toLowerCase().includes(searchTerm)
            );
        }

        const settings = DataManager.getSettings();
        document.getElementById('inventoryTable').innerHTML = this.renderProductRows(products, settings);
    },

    showAddProduct() {
        const categories = DataManager.getCategories();

        App.showModal('Add New Product', `
            <div class="form-group">
                <label class="form-label">Product Name *</label>
                <input type="text" class="form-control" id="productName" placeholder="Enter product name">
            </div>
            
            <div class="grid grid-2">
                <div class="form-group">
                    <label class="form-label">SKU *</label>
                    <input type="text" class="form-control" id="productSKU" placeholder="Product SKU">
                </div>
                <div class="form-group">
                    <label class="form-label">Barcode</label>
                    <input type="text" class="form-control" id="productBarcode" placeholder="Barcode">
                </div>
            </div>
            
            <div class="grid grid-2">
                <div class="form-group">
                    <label class="form-label">Price *</label>
                    <input type="number" class="form-control" id="productPrice" placeholder="0.00" step="0.01" min="0">
                </div>
                <div class="form-group">
                    <label class="form-label">Stock Quantity *</label>
                    <input type="number" class="form-control" id="productStock" placeholder="0" min="0">
                </div>
            </div>
            
            <div class="grid grid-2">
                <div class="form-group">
                    <label class="form-label">Category *</label>
                    <select class="form-control" id="productCategory">
                        ${categories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Min Stock Alert</label>
                    <input type="number" class="form-control" id="productMinStock" placeholder="5" min="0">
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Image URL</label>
                <input type="text" class="form-control" id="productImage" placeholder="https://...">
            </div>
        `, [
            { text: 'Cancel', class: 'btn-secondary', onclick: 'App.closeModal()' },
            { text: 'Add Product', class: 'btn-primary', onclick: 'Inventory.saveProduct()' }
        ]);
    },

    showEditProduct(productId) {
        const product = DataManager.getProductById(productId);
        const categories = DataManager.getCategories();

        if (!product) return;

        App.showModal('Edit Product', `
            <input type="hidden" id="editProductId" value="${product.id}">
            
            <div class="form-group">
                <label class="form-label">Product Name *</label>
                <input type="text" class="form-control" id="productName" value="${product.name}">
            </div>
            
            <div class="grid grid-2">
                <div class="form-group">
                    <label class="form-label">SKU *</label>
                    <input type="text" class="form-control" id="productSKU" value="${product.sku}">
                </div>
                <div class="form-group">
                    <label class="form-label">Barcode</label>
                    <input type="text" class="form-control" id="productBarcode" value="${product.barcode}">
                </div>
            </div>
            
            <div class="grid grid-2">
                <div class="form-group">
                    <label class="form-label">Price *</label>
                    <input type="number" class="form-control" id="productPrice" value="${product.price}" step="0.01" min="0">
                </div>
                <div class="form-group">
                    <label class="form-label">Stock Quantity *</label>
                    <input type="number" class="form-control" id="productStock" value="${product.stock}" min="0">
                </div>
            </div>
            
            <div class="grid grid-2">
                <div class="form-group">
                    <label class="form-label">Category *</label>
                    <select class="form-control" id="productCategory">
                        ${categories.map(cat => `
                            <option value="${cat.name}" ${cat.name === product.category ? 'selected' : ''}>
                                ${cat.name}
                            </option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Min Stock Alert</label>
                    <input type="number" class="form-control" id="productMinStock" value="${product.minStock}" min="0">
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Image URL</label>
                <input type="text" class="form-control" id="productImage" value="${product.image}">
            </div>
        `, [
            { text: 'Cancel', class: 'btn-secondary', onclick: 'App.closeModal()' },
            { text: 'Update Product', class: 'btn-primary', onclick: 'Inventory.updateProduct()' }
        ]);
    },

    saveProduct() {
        const product = {
            name: document.getElementById('productName').value,
            sku: document.getElementById('productSKU').value,
            barcode: document.getElementById('productBarcode').value || '',
            price: parseFloat(document.getElementById('productPrice').value) || 0,
            stock: parseInt(document.getElementById('productStock').value) || 0,
            category: document.getElementById('productCategory').value,
            minStock: parseInt(document.getElementById('productMinStock').value) || 5,
            image: document.getElementById('productImage').value || 'https://via.placeholder.com/400'
        };

        if (!product.name || !product.sku || product.price <= 0) {
            alert('Please fill in all required fields!');
            return;
        }

        DataManager.addProduct(product);
        App.closeModal();
        App.loadModule('inventory');
    },

    updateProduct() {
        const productId = parseInt(document.getElementById('editProductId').value);

        const updatedProduct = {
            name: document.getElementById('productName').value,
            sku: document.getElementById('productSKU').value,
            barcode: document.getElementById('productBarcode').value || '',
            price: parseFloat(document.getElementById('productPrice').value) || 0,
            stock: parseInt(document.getElementById('productStock').value) || 0,
            category: document.getElementById('productCategory').value,
            minStock: parseInt(document.getElementById('productMinStock').value) || 5,
            image: document.getElementById('productImage').value || 'https://via.placeholder.com/400'
        };

        if (!updatedProduct.name || !updatedProduct.sku || updatedProduct.price <= 0) {
            alert('Please fill in all required fields!');
            return;
        }

        DataManager.updateProduct(productId, updatedProduct);
        App.closeModal();
        App.loadModule('inventory');
    },

    deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            DataManager.deleteProduct(productId);
            App.loadModule('inventory');
        }
    }
};
