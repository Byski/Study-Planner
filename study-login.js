// Study Login Handler
class StudyLogin {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.rememberCheckbox = document.getElementById('remember');
        
        this.initEventListeners();
        this.loadSavedCredentials();
    }

    initEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleLogin(e));
        
        // Add focus effects
        [this.usernameInput, this.passwordInput].forEach(input => {
            input.addEventListener('focus', () => this.addFocusEffect(input));
            input.addEventListener('blur', () => this.removeFocusEffect(input));
            input.addEventListener('input', () => this.handleTyping(input));
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
        const rememberMe = localStorage.getItem('arqon_remember_me');
        if (rememberMe === 'true') {
            const savedUsername = localStorage.getItem('arqon_username');
            if (savedUsername) {
                this.usernameInput.value = savedUsername;
                this.rememberCheckbox.checked = true;
            }
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value;
        const rememberMe = this.rememberCheckbox.checked;

        if (!username || !password) {
            this.showError('Please fill in all fields');
            return;
        }

        // Simulate login process
        this.showSuccess('Login successful! Redirecting...');
        
        // Save credentials if remember me is checked
        if (rememberMe) {
            localStorage.setItem('arqon_username', username);
            localStorage.setItem('arqon_remember_me', 'true');
        } else {
            localStorage.removeItem('arqon_username');
            localStorage.removeItem('arqon_remember_me');
        }

        // Store session
        sessionStorage.setItem('arqon_current_user', username);
        sessionStorage.setItem('arqon_login_time', new Date().toISOString());

        // Redirect to dashboard after delay
        setTimeout(() => {
            window.location.href = 'study-dashboard.html';
        }, 2000);
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
}

// Navigation functions
function goBack() {
    window.location.href = 'index.html';
}

// Initialize login when page loads
document.addEventListener('DOMContentLoaded', () => {
    new StudyLogin();
    
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
        
        .input-group.focused .login-input {
            border-color: #00ffff;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.4);
        }
    `;
    document.head.appendChild(style);
});
