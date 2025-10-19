// Study Dashboard Controller
class StudyDashboard {
    constructor() {
        this.loadUserData();
        this.initAnimations();
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
        } else {
            // Redirect to login if no user
            window.location.href = 'study-login.html';
        }
    }

    initAnimations() {
        // Add continuous animations
        this.addFloatingElements();
        this.addParticleEffects();
    }

    addFloatingElements() {
        // Removed floating elements for cleaner background
    }

    addParticleEffects() {
        // Create particle effects
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        document.body.appendChild(particleContainer);

        // Add particles periodically
        setInterval(() => {
            this.createParticle(particleContainer);
        }, 2000);
    }

    createParticle(container) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: #00ffff;
            border-radius: 50%;
            box-shadow: 0 0 10px #00ffff;
            animation: particleFloat 8s linear infinite;
            left: ${Math.random() * 100}%;
            top: 100%;
        `;
        container.appendChild(particle);

        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 8000);
    }
}

// Logout function
function logout() {
    // Clear session storage
    sessionStorage.removeItem('arqon_current_user');
    sessionStorage.removeItem('arqon_login_time');
    
    // Show logout animation
    document.body.style.animation = 'fadeOut 0.5s ease-out';
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

// Tab switching functionality
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
        });
    });
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    new StudyDashboard();
    initTabs();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { 
                transform: translateY(0px) rotate(0deg);
                opacity: 0.3;
            }
            50% { 
                transform: translateY(-100px) rotate(180deg);
                opacity: 0.8;
            }
        }
        
        @keyframes particleFloat {
            0% {
                transform: translateY(0) translateX(0);
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px);
                opacity: 0;
            }
        }
        
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});
