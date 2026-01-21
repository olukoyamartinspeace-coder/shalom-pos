// =============================================
// SETTINGS MODULE
// =============================================

const Settings = {
    render() {
        const settings = DataManager.getSettings();
        const users = DataManager.getData('users') || [];

        const adminData = Auth.getAdminData();

        return `
            <div class="grid grid-2">
                <!-- Business Settings -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title"><i class="fas fa-store"></i> Business Settings</h3>
                    </div>
                    <div class="card-body">
                        <div class="form-group">
                            <label class="form-label">Business Name</label>
                            <input type="text" class="form-control" id="businessName" value="${settings.businessName}">
                        </div>
                        
                        <div class="grid grid-2">
                            <div class="form-group">
                                <label class="form-label">Currency</label>
                                <select class="form-control" id="currency">
                                    <option value="USD" ${settings.currency === 'USD' ? 'selected' : ''}>USD ($)</option>
                                    <option value="EUR" ${settings.currency === 'EUR' ? 'selected' : ''}>EUR (€)</option>
                                    <option value="GBP" ${settings.currency === 'GBP' ? 'selected' : ''}>GBP (£)</option>
                                    <option value="NGN" ${settings.currency === 'NGN' ? 'selected' : ''}>NGN (₦)</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Tax Rate (%)</label>
                                <input type="number" class="form-control" id="taxRate" value="${settings.taxRate}" min="0" max="100" step="0.1">
                            </div>
                        </div>
                        
                        <button class="btn btn-primary" onclick="Settings.saveBusinessSettings()">
                            <i class="fas fa-save"></i> Save Settings
                        </button>
                    </div>
                </div>

                <!-- Receipt Settings -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title"><i class="fas fa-receipt"></i> Receipt Settings</h3>
                    </div>
                    <div class="card-body">
                        <div class="form-group">
                            <label class="form-label">Receipt Header</label>
                            <input type="text" class="form-control" id="receiptHeader" value="${settings.receiptHeader}">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Receipt Footer</label>
                            <input type="text" class="form-control" id="receiptFooter" value="${settings.receiptFooter}">
                        </div>
                        
                        <button class="btn btn-primary" onclick="Settings.saveReceiptSettings()">
                            <i class="fas fa-save"></i> Save Receipt Settings
                        </button>
                    </div>
                </div>
            </div>

            <!-- Security Settings -->
            <div class="card mt-2">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-shield-alt"></i> Security & Account</h3>
                </div>
                <div class="card-body">
                    <div class="grid grid-2">
                        <div>
                            <h4 style="margin-bottom: var(--spacing-sm);"><i class="fas fa-key"></i> Change Password</h4>
                            <p class="text-muted" style="font-size: 0.875rem; margin-bottom: var(--spacing-sm);">
                                Update your admin password for security
                            </p>
                            <button class="btn btn-primary" onclick="Settings.showChangePassword()">
                                <i class="fas fa-lock"></i> Change Password
                            </button>
                        </div>
                        
                        <div>
                            <h4 style="margin-bottom: var(--spacing-sm);"><i class="fas fa-envelope"></i> Recovery Email</h4>
                            <p class="text-muted" style="font-size: 0.875rem; margin-bottom: var(--spacing-sm);">
                                ${adminData.recoveryEmail ? `Current: <strong>${adminData.recoveryEmail}</strong>` : 'Not set (required for password reset)'}
                            </p>
                            <button class="btn btn-secondary" onclick="Settings.showSetRecoveryEmail()">
                                <i class="fas fa-envelope"></i> ${adminData.recoveryEmail ? 'Update' : 'Setup'} Recovery Email
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card mt-2">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-database"></i> Data Management</h3>
                </div>
                <div class="card-body">
                    <div class="grid grid-3">
                        <div>
                            <h4 style="margin-bottom: var(--spacing-sm);">Backup Data</h4>
                            <p class="text-muted" style="font-size: 0.875rem; margin-bottom: var(--spacing-sm);">
                                Export all your data to a JSON file
                            </p>
                            <button class="btn btn-primary" onclick="Settings.exportData()">
                                <i class="fas fa-download"></i> Export Data
                            </button>
                        </div>
                        
                        <div>
                            <h4 style="margin-bottom: var(--spacing-sm);">Restore Data</h4>
                            <p class="text-muted" style="font-size: 0.875rem; margin-bottom: var(--spacing-sm);">
                                Import data from a backup file
                            </p>
                            <input type="file" id="importFile" accept=".json" style="display: none;" onchange="Settings.importData(event)">
                            <button class="btn btn-secondary" onclick="document.getElementById('importFile').click()">
                                <i class="fas fa-upload"></i> Import Data
                            </button>
                        </div>
                        
                        <div>
                            <h4 style="margin-bottom: var(--spacing-sm);">Clear All Data</h4>
                            <p class="text-muted" style="font-size: 0.875rem; margin-bottom: var(--spacing-sm);">
                                Reset the application to default
                            </p>
                            <button class="btn btn-danger" onclick="Settings.clearAllData()">
                                <i class="fas fa-trash"></i> Clear Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card mt-2">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-info-circle"></i> System Information</h3>
                </div>
                <div class="card-body">
                    <div class="grid grid-3">
                        <div class="stat-card">
                            <div class="stat-icon" style="background: var(--primary-gradient);">
                                <i class="fas fa-box"></i>
                            </div>
                            <div class="stat-value">${DataManager.getProducts().length}</div>
                            <div class="stat-label">Total Products</div>
                        </div>
                        
                        <div class="stat-card">
                            <div class="stat-icon" style="background: var(--accent-gradient);">
                                <i class="fas fa-users"></i>
                            </div>
                            <div class="stat-value">${DataManager.getCustomers().length}</div>
                            <div class="stat-label">Total Customers</div>
                        </div>
                        
                        <div class="stat-card">
                            <div class="stat-icon" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
                                <i class="fas fa-receipt"></i>
                            </div>
                            <div class="stat-value">${DataManager.getTransactions().length}</div>
                            <div class="stat-label">Total Transactions</div>
                        </div>
                    </div>
                    
                    <div style="margin-top: var(--spacing-md); padding: var(--spacing-md); background: var(--bg-tertiary); border-radius: var(--border-radius-sm);">
                        <p><strong>Version:</strong> 1.0.0</p>
                        <p><strong>Storage:</strong> LocalStorage (Browser-based)</p>
                        <p><strong>Last Updated:</strong> ${new Date().toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        `;
    },

    saveBusinessSettings() {
        const settings = DataManager.getSettings();

        const currencyMap = {
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'NGN': '₦'
        };

        const currency = document.getElementById('currency').value;

        settings.businessName = document.getElementById('businessName').value;
        settings.currency = currency;
        settings.currencySymbol = currencyMap[currency];
        settings.taxRate = parseFloat(document.getElementById('taxRate').value);

        DataManager.saveSettings(settings);

        alert('Business settings saved successfully!');
    },

    saveReceiptSettings() {
        const settings = DataManager.getSettings();

        settings.receiptHeader = document.getElementById('receiptHeader').value;
        settings.receiptFooter = document.getElementById('receiptFooter').value;

        DataManager.saveSettings(settings);

        alert('Receipt settings saved successfully!');
    },

    exportData() {
        const data = DataManager.exportData();
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `shalom_pos_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    },

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (confirm('This will replace all existing data. Are you sure?')) {
                    DataManager.importData(data);
                    alert('Data imported successfully!');
                    App.loadModule('settings');
                }
            } catch (error) {
                alert('Error importing data. Please check the file format.');
            }
        };
        reader.readAsText(file);
    },

    clearAllData() {
        if (confirm('WARNING: This will delete ALL data including products, customers, and transactions. This cannot be undone. Are you sure?')) {
            if (confirm('Are you ABSOLUTELY sure? This action is irreversible!')) {
                DataManager.clearData();
                DataManager.init();
                alert('All data has been cleared and reset to defaults.');
                location.reload();
            }
        }
    },

    showChangePassword() {
        App.showModal('Change Password', `
            <form onsubmit="Settings.changePassword(event)">
                <div class="form-group">
                    <label class="form-label">Current Password</label>
                    <input type="password" class="form-control" id="currentPassword" required>
                </div>
                <div class="form-group">
                    <label class="form-label">New Password</label>
                    <input type="password" class="form-control" id="newPassword" minlength="6" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Confirm New Password</label>
                    <input type="password" class="form-control" id="confirmNewPassword" minlength="6" required>
                </div>
                <div id="passwordError" class="alert alert-danger hidden"></div>
            </form>
        `, [
            { text: 'Cancel', class: 'btn-secondary', onclick: 'App.closeModal()' },
            { text: 'Change Password', class: 'btn-primary', onclick: 'Settings.changePassword(event)' }
        ]);
    },

    changePassword(event) {
        event.preventDefault();

        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmNewPassword').value;
        const errorDiv = document.getElementById('passwordError');

        // Verify current password
        const adminData = Auth.getAdminData();
        if (adminData.password !== currentPassword) {
            errorDiv.textContent = 'Current password is incorrect';
            errorDiv.classList.remove('hidden');
            return;
        }

        // Check if new passwords match
        if (newPassword !== confirmPassword) {
            errorDiv.textContent = 'New passwords do not match';
            errorDiv.classList.remove('hidden');
            return;
        }

        // Update password
        if (Auth.updatePassword(newPassword)) {
            alert('Password changed successfully! Please login again with your new password.');
            Auth.logout();
        } else {
            errorDiv.textContent = 'Failed to update password';
            errorDiv.classList.remove('hidden');
        }
    },

    showSetRecoveryEmail() {
        const adminData = Auth.getAdminData();

        App.showModal('Setup Recovery Email', `
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i> 
                This email will be used to reset your password if you forget it.
            </div>
            <form onsubmit="Settings.setRecoveryEmail(event)">
                <div class="form-group">
                    <label class="form-label">Recovery Email</label>
                    <input type="email" class="form-control" id="recoveryEmail" 
                        value="${adminData.recoveryEmail || ''}" 
                        placeholder="Enter your email address"
                        required>
                </div>
                <div id="emailError" class="alert alert-danger hidden"></div>
            </form>
        `, [
            { text: 'Cancel', class: 'btn-secondary', onclick: 'App.closeModal()' },
            { text: 'Save Email', class: 'btn-primary', onclick: 'Settings.setRecoveryEmail(event)' }
        ]);
    },

    setRecoveryEmail(event) {
        event.preventDefault();

        const email = document.getElementById('recoveryEmail').value;

        if (Auth.updateRecoveryEmail(email)) {
            alert('Recovery email saved successfully!');
            App.closeModal();
            App.loadModule('settings'); // Reload to show updated email
        } else {
            document.getElementById('emailError').textContent = 'Failed to save recovery email';
            document.getElementById('emailError').classList.remove('hidden');
        }
    }
};
