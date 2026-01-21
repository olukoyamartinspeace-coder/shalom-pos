// =============================================
// AUTHENTICATION MODULE
// =============================================

const Auth = {
    // Initialize
    init() {
        // Ensure we have at least one admin
        if (DataManager.getUsers().length === 0) {
            DataManager.addUser({
                username: 'admin',
                password: 'shalom123',
                email: 'admin@shalompos.com',
                role: 'Creator' // Creator has highest privileges
            });
        }
    },

    // Get current session
    getSession() {
        const session = sessionStorage.getItem('shalom_pos_session');
        return session ? JSON.parse(session) : null;
    },

    // Set session
    setSession(user) {
        const sessionData = {
            id: user.id,
            username: user.username,
            role: user.role,
            timestamp: new Date().toISOString()
        };
        sessionStorage.setItem('shalom_pos_session', JSON.stringify(sessionData));
    },

    // Clear session
    clearSession() {
        sessionStorage.removeItem('shalom_pos_session');
    },

    // Check if user is logged in
    isAuthenticated() {
        const session = this.getSession();
        if (!session) return false;

        // Check if session is still valid (24 hours)
        const sessionTime = new Date(session.timestamp);
        const now = new Date();
        const hoursDiff = (now - sessionTime) / (1000 * 60 * 60);

        if (hoursDiff > 24) {
            this.clearSession();
            return false;
        }

        return true;
    },

    // Get current user details
    getCurrentUser() {
        const session = this.getSession();
        if (!session) return null;
        return DataManager.getUserById(session.id);
    },

    // Login
    login(username, password) {
        const user = DataManager.getUserByUsername(username);

        if (user && user.password === password) {
            this.setSession(user);
            return { success: true, user: user };
        }

        return { success: false, error: 'Invalid username or password' };
    },

    // Register
    register(userData) {
        // Check if username exists
        if (DataManager.getUserByUsername(userData.username)) {
            return { success: false, error: 'Username already exists' };
        }

        // Add user
        const newUser = DataManager.addUser({
            username: userData.username,
            password: userData.password,
            email: userData.email,
            storeName: userData.storeName,
            companyName: userData.companyName,
            address: userData.address,
            phone: userData.phone,
            role: userData.role || 'User', // Default to User
            created: new Date().toISOString()
        });

        return { success: true, user: newUser };
    },

    // Logout
    logout() {
        this.clearSession();
        window.location.href = 'login.html';
    },

    // Update password
    updatePassword(userId, newPassword) {
        const user = DataManager.getUserById(userId);
        if (user) {
            DataManager.updateUser(userId, { password: newPassword });
            return true;
        }
        return false;
    },

    // Update recovery email
    updateRecoveryEmail(userId, email) {
        const user = DataManager.getUserById(userId);
        if (user) {
            DataManager.updateUser(userId, { recoveryEmail: email });
            return true;
        }
        return false;
    },

    // Verify recovery email for password reset
    verifyRecoveryEmail(username, email) {
        const user = DataManager.getUserByUsername(username);
        return user && user.recoveryEmail === email;
    },

    // Generate temporary reset code
    generateResetCode(username) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        sessionStorage.setItem('shalom_pos_reset_code', code);
        sessionStorage.setItem('shalom_pos_reset_user', username);
        sessionStorage.setItem('shalom_pos_reset_timestamp', new Date().toISOString());
        return code;
    },

    // Verify reset code
    verifyResetCode(code) {
        const storedCode = sessionStorage.getItem('shalom_pos_reset_code');
        const timestamp = sessionStorage.getItem('shalom_pos_reset_timestamp');

        if (!storedCode || !timestamp) return false;

        // Check if code expired (15 minutes)
        const resetTime = new Date(timestamp);
        const now = new Date();
        const minutesDiff = (now - resetTime) / (1000 * 60);

        if (minutesDiff > 15) {
            sessionStorage.removeItem('shalom_pos_reset_code');
            sessionStorage.removeItem('shalom_pos_reset_timestamp');
            sessionStorage.removeItem('shalom_pos_reset_user');
            return false;
        }

        return storedCode === code;
    },

    // Reset password
    resetPassword(newPassword) {
        const username = sessionStorage.getItem('shalom_pos_reset_user');
        if (!username) return false;

        const user = DataManager.getUserByUsername(username);
        if (user) {
            this.updatePassword(user.id, newPassword);
            sessionStorage.removeItem('shalom_pos_reset_code');
            sessionStorage.removeItem('shalom_pos_reset_timestamp');
            sessionStorage.removeItem('shalom_pos_reset_user');
            return true;
        }
        return false;
    }
};

// Initialize on load
Auth.init();
