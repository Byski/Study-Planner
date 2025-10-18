// Dashboard Animation Controller
class ARQONDashboard {
    constructor() {
        this.initAnimations();
        this.loadUserData();
        this.setupEventListeners();
    }

    initAnimations() {
        // Staggered animation for feature cards
        const cards = document.querySelectorAll('.feature-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate');
                this.addCardAnimation(card, index);
            }, index * 200);
        });
    }

    addCardAnimation(card, index) {
        const animation = card.getAttribute('data-animation');
        if (animation) {
            card.classList.add(animation);
        }
        
        // Add hover effects
        card.addEventListener('mouseenter', () => {
            this.addHoverEffect(card);
        });
        
        card.addEventListener('mouseleave', () => {
            this.removeHoverEffect(card);
        });
    }

    addHoverEffect(card) {
        card.style.transform = 'translateY(-10px) scale(1.02)';
        card.style.boxShadow = '0 20px 40px rgba(0, 255, 255, 0.3), 0 0 60px rgba(0, 255, 255, 0.2)';
        
        // Add ripple effect
        this.createRippleEffect(card);
    }

    removeHoverEffect(card) {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '';
    }

    createRippleEffect(card) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(0, 255, 255, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        card.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    loadUserData() {
        // Get current user from session storage
        const currentUser = sessionStorage.getItem('arqon_current_user');
        if (currentUser) {
            const user = JSON.parse(currentUser);
            const usernameElement = document.getElementById('username');
            if (usernameElement) {
                usernameElement.textContent = user.username;
            }
        }
    }

    setupEventListeners() {
        // Add click animations to cards
        const cards = document.querySelectorAll('.feature-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                this.handleCardClick(card);
            });
        });
    }

    handleCardClick(card) {
        // Add click animation
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
        
        // Show coming soon message
        const cardTitle = card.querySelector('h3').textContent;
        this.showNotification(`${cardTitle} feature coming soon!`, 'info');
    }

    showNotification(message, type) {
        // Remove existing notifications
        const existing = document.querySelector('.dashboard-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `dashboard-notification ${type}`;
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
            background: linear-gradient(45deg, #00ffff, #00d4aa);
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
            border: 2px solid rgba(0, 255, 255, 0.3);
        `;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-out';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
}

// Logout function
function logout() {
    // Clear session storage
    sessionStorage.removeItem('arqon_current_user');
    sessionStorage.removeItem('arqon_current_session');
    
    // Show logout animation
    document.body.style.animation = 'fadeOut 0.5s ease-out';
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ARQONDashboard();
    
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
        
        @keyframes ripple {
            from { width: 0; height: 0; opacity: 1; }
            to { width: 200px; height: 200px; opacity: 0; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        .feature-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .feature-card:hover {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
    `;
    document.head.appendChild(style);
});
