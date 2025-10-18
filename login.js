// Local Storage Manager for ARQON Study Login
class ARQONStorage {
    constructor() {
        this.storageKey = 'arqon_study_data';
        this.initStorage();
    }

    initStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify({
                users: [],
                sessions: [],
                settings: {
                    theme: 'dark',
                    rememberMe: false
                }
            }));
        }
    }

    getData() {
        return JSON.parse(localStorage.getItem(this.storageKey));
    }

    saveData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    addUser(username, password, email = '') {
        const data = this.getData();
        const user = {
            id: Date.now(),
            username,
            password: this.hashPassword(password),
            email,
            createdAt: new Date().toISOString(),
            lastLogin: null
        };
        data.users.push(user);
        this.saveData(data);
        return user;
    }

    authenticateUser(username, password) {
        const data = this.getData();
        const user = data.users.find(u => u.username === username);
        if (user && user.password === this.hashPassword(password)) {
            user.lastLogin = new Date().toISOString();
            this.saveData(data);
            return user;
        }
        return null;
    }

    hashPassword(password) {
        // Simple hash for demo - in production use proper hashing
        return btoa(password + 'arqon_salt');
    }

    saveSession(user) {
        const data = this.getData();
        const session = {
            id: Date.now(),
            userId: user.id,
            username: user.username,
            loginTime: new Date().toISOString(),
            isActive: true
        };
        data.sessions.push(session);
        this.saveData(data);
        return session;
    }

    getActiveSession() {
        const data = this.getData();
        return data.sessions.find(s => s.isActive);
    }

    logout() {
        const data = this.getData();
        const activeSession = data.sessions.find(s => s.isActive);
        if (activeSession) {
            activeSession.isActive = false;
            activeSession.logoutTime = new Date().toISOString();
        }
        this.saveData(data);
    }
}

// Login Form Handler
class ARQONLogin {
    constructor() {
        this.storage = new ARQONStorage();
        this.form = document.getElementById('loginForm');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.confirmPasswordInput = document.getElementById('confirmPassword');
        this.emailInput = document.getElementById('email');
        this.rememberCheckbox = document.getElementById('remember');
        this.submitBtn = document.getElementById('submitBtn');
        this.isCreateMode = false;
        
        this.initEventListeners();
        this.loadSavedCredentials();
    }

    initEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add focus effects
        [this.usernameInput, this.passwordInput, this.confirmPasswordInput, this.emailInput].forEach(input => {
            if (input) {
                input.addEventListener('focus', () => this.addFocusEffect(input));
                input.addEventListener('blur', () => this.removeFocusEffect(input));
                input.addEventListener('input', () => this.handleTyping(input));
            }
        });
    }

    addFocusEffect(input) {
        input.parentElement.classList.add('focused');
    }

    removeFocusEffect(input) {
        input.parentElement.classList.remove('focused');
    }

    handleTyping(input) {
        // Add subtle typing animation
        input.style.transform = 'scale(1.02)';
        setTimeout(() => {
            input.style.transform = 'scale(1)';
        }, 100);
    }

    loadSavedCredentials() {
        const data = this.storage.getData();
        if (data.settings.rememberMe) {
            const lastUser = data.users[data.users.length - 1];
            if (lastUser) {
                this.usernameInput.value = lastUser.username;
                this.rememberCheckbox.checked = true;
            }
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        if (this.isCreateMode) {
            this.handleCreateAccount();
        } else {
            this.handleLogin();
        }
    }

    handleLogin() {
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value;
        const rememberMe = this.rememberCheckbox.checked;

        if (!username || !password) {
            this.showError('Please fill in all fields');
            return;
        }

        // Check if user exists
        const user = this.storage.authenticateUser(username, password);
        
        if (!user) {
            this.showError('Invalid username or password');
            return;
        }

        this.showSuccess('Welcome back!');
        this.completeLogin(user, rememberMe);
    }

    handleCreateAccount() {
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;
        const email = this.emailInput.value.trim();
        const rememberMe = this.rememberCheckbox.checked;

        if (!username || !password || !confirmPassword) {
            this.showError('Please fill in all required fields');
            return;
        }

        if (password !== confirmPassword) {
            this.showError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            this.showError('Password must be at least 6 characters');
            return;
        }

        // Check if user already exists
        const existingUser = this.storage.authenticateUser(username, password);
        if (existingUser) {
            this.showError('Username already exists');
            return;
        }

        // Create new user
        const user = this.storage.addUser(username, password, email);
        this.showSuccess('Account created successfully!');
        this.completeLogin(user, rememberMe);
    }

    completeLogin(user, rememberMe) {
        // Save session
        const session = this.storage.saveSession(user);
        
        // Save remember me preference
        const data = this.storage.getData();
        data.settings.rememberMe = rememberMe;
        this.storage.saveData(data);

        // Store current user in sessionStorage for immediate access
        sessionStorage.setItem('arqon_current_user', JSON.stringify(user));
        sessionStorage.setItem('arqon_current_session', JSON.stringify(session));

        // Redirect to study dashboard
        setTimeout(() => {
            this.redirectToStudy();
        }, 1500);
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type) {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 10px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            animation: slideInRight 0.5s ease-out;
            ${type === 'error' ? 
                'background: linear-gradient(45deg, #ff6b35, #ff4757);' : 
                'background: linear-gradient(45deg, #00ffff, #00d4aa);'
            }
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
        `;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-out';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    redirectToStudy() {
        // Redirect to dashboard page
        window.location.href = 'dashboard.html';
    }
}

// Navigation functions
function goBack() {
    window.location.href = 'index.html';
}

function toggleCreateAccount() {
    const login = window.arqonLogin;
    login.isCreateMode = !login.isCreateMode;
    
    const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
    const emailGroup = document.getElementById('emailGroup');
    const submitBtn = document.getElementById('submitBtn');
    const loginTitle = document.querySelector('.login-title');
    const loginSubtitle = document.querySelector('.login-subtitle');
    
    if (login.isCreateMode) {
        // Show create account fields
        confirmPasswordGroup.style.display = 'block';
        emailGroup.style.display = 'block';
        submitBtn.querySelector('.btn-text').textContent = 'CREATE ACCOUNT';
        loginTitle.textContent = 'CREATE ACCOUNT';
        loginSubtitle.textContent = 'Join the ARQON study community';
        
        // Add animation
        confirmPasswordGroup.style.animation = 'slideInDown 0.5s ease-out';
        emailGroup.style.animation = 'slideInDown 0.5s ease-out 0.1s both';
    } else {
        // Hide create account fields
        confirmPasswordGroup.style.display = 'none';
        emailGroup.style.display = 'none';
        submitBtn.querySelector('.btn-text').textContent = 'LOGIN';
        loginTitle.textContent = 'STUDY LOGIN';
        loginSubtitle.textContent = 'Enter your study credentials';
    }
}

// Initialize login when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.arqonLogin = new ARQONLogin();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes slideInDown {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .input-group.focused .login-input {
            border-color: #00ffff;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.4);
        }
    `;
    document.head.appendChild(style);
});
