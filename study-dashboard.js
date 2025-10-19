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

// Course Management Functions
function showCourseManagement() {
    const courseManagement = document.getElementById('courseManagement');
    if (courseManagement) {
        courseManagement.style.display = 'block';
        courseManagement.style.animation = 'slideInUp 0.5s ease-out';
        initCourseManagement();
    }
}

function hideCourseManagement() {
    const courseManagement = document.getElementById('courseManagement');
    if (courseManagement) {
        courseManagement.style.display = 'none';
    }
}

function initCourseManagement() {
    // Initialize management tabs
    const mgmtTabButtons = document.querySelectorAll('.mgmt-tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    mgmtTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and panels
            mgmtTabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding panel
            const targetPanel = document.getElementById(tabName + 'Panel');
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
    
    // Initialize forms
    initCourseForms();
    
    // Load existing courses
    loadCourses();
}

function initCourseForms() {
    // Create Course Form
    const createForm = document.getElementById('createCourseForm');
    if (createForm) {
        createForm.addEventListener('submit', handleCreateCourse);
    }
    
    // Edit Course Form
    const editForm = document.getElementById('editCourseForm');
    if (editForm) {
        editForm.addEventListener('submit', handleEditCourse);
    }
    
    // Delete Course Form
    const deleteForm = document.getElementById('deleteCourseForm');
    if (deleteForm) {
        deleteForm.addEventListener('submit', handleDeleteCourse);
    }
}

function handleCreateCourse(e) {
    e.preventDefault();
    
    const courseData = {
        id: Date.now(),
        name: document.getElementById('courseName').value,
        code: document.getElementById('courseCode').value,
        instructor: document.getElementById('instructor').value,
        description: document.getElementById('description').value,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        createdAt: new Date().toISOString()
    };
    
    // Save to localStorage
    const courses = JSON.parse(localStorage.getItem('arqon_courses') || '[]');
    courses.push(courseData);
    localStorage.setItem('arqon_courses', JSON.stringify(courses));
    
    // Show success message
    showNotification('Course created successfully!', 'success');
    
    // Reset form
    document.getElementById('createCourseForm').reset();
    
    // Reload courses
    loadCourses();
    updateCourseSelects();
}

function handleEditCourse(e) {
    e.preventDefault();
    
    const courseId = parseInt(document.getElementById('editCourseSelect').value);
    if (!courseId) {
        showNotification('Please select a course to edit', 'error');
        return;
    }
    
    const courses = JSON.parse(localStorage.getItem('arqon_courses') || '[]');
    const courseIndex = courses.findIndex(c => c.id === courseId);
    
    if (courseIndex !== -1) {
        courses[courseIndex] = {
            ...courses[courseIndex],
            name: document.getElementById('editCourseName').value,
            code: document.getElementById('editCourseCode').value,
            instructor: document.getElementById('editInstructor').value,
            description: document.getElementById('editDescription').value,
            startDate: document.getElementById('editStartDate').value,
            endDate: document.getElementById('editEndDate').value,
            updatedAt: new Date().toISOString()
        };
        
        localStorage.setItem('arqon_courses', JSON.stringify(courses));
        showNotification('Course updated successfully!', 'success');
        
        // Reset form
        document.getElementById('editCourseForm').reset();
        
        // Reload courses
        loadCourses();
        updateCourseSelects();
    }
}

function handleDeleteCourse(e) {
    e.preventDefault();
    
    const courseId = parseInt(document.getElementById('deleteCourseSelect').value);
    if (!courseId) {
        showNotification('Please select a course to delete', 'error');
        return;
    }
    
    if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
        const courses = JSON.parse(localStorage.getItem('arqon_courses') || '[]');
        const filteredCourses = courses.filter(c => c.id !== courseId);
        
        localStorage.setItem('arqon_courses', JSON.stringify(filteredCourses));
        showNotification('Course deleted successfully!', 'success');
        
        // Reset form
        document.getElementById('deleteCourseForm').reset();
        
        // Reload courses
        loadCourses();
        updateCourseSelects();
    }
}

function loadCourses() {
    const courses = JSON.parse(localStorage.getItem('arqon_courses') || '[]');
    const courseGrid = document.getElementById('courseGrid');
    
    if (courseGrid) {
        if (courses.length === 0) {
            courseGrid.innerHTML = '<p style="text-align: center; color: #999; grid-column: 1 / -1;">No courses found. Create your first course!</p>';
        } else {
            courseGrid.innerHTML = courses.map(course => `
                <div class="course-card">
                    <h4>${course.name}</h4>
                    <div class="course-code">${course.code}</div>
                    <div class="instructor">Instructor: ${course.instructor || 'Not specified'}</div>
                    <div class="dates">${course.startDate} - ${course.endDate}</div>
                    ${course.description ? `<p style="margin-top: 0.5rem; color: #ccc; font-size: 0.9rem;">${course.description}</p>` : ''}
                </div>
            `).join('');
        }
    }
}

function updateCourseSelects() {
    const courses = JSON.parse(localStorage.getItem('arqon_courses') || '[]');
    const editSelect = document.getElementById('editCourseSelect');
    const deleteSelect = document.getElementById('deleteCourseSelect');
    
    const options = courses.map(course => 
        `<option value="${course.id}">${course.name} (${course.code})</option>`
    ).join('');
    
    if (editSelect) {
        editSelect.innerHTML = '<option value="">Select Course to Edit</option>' + options;
    }
    
    if (deleteSelect) {
        deleteSelect.innerHTML = '<option value="">Select Course to Delete</option>' + options;
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? 'linear-gradient(45deg, #00ff00, #00cc00)' : 
                    type === 'error' ? 'linear-gradient(45deg, #ff0000, #cc0000)' : 
                    'linear-gradient(45deg, #0099ff, #0066cc)'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    new StudyDashboard();
    initTabs();
    // Initialize course management by default
    initCourseManagement();
    
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
