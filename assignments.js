// Assignments Management System
class AssignmentsManager {
    constructor() {
        this.assignments = [];
        this.filteredAssignments = [];
        this.sortColumn = null;
        this.sortDirection = 'asc';
        
        this.init();
    }
    
    init() {
        this.loadSampleData();
        this.loadCoursesFromStorage();
        this.setupEventListeners();
        this.renderTable();
        this.updateSummary();
        this.populateCourseDropdowns();
    }
    
    loadSampleData() {
        // Load from localStorage only
        const savedAssignments = JSON.parse(localStorage.getItem('arqon_assignments') || '[]');
        this.assignments = savedAssignments;
        this.filteredAssignments = [...this.assignments];
    }
    
    setupEventListeners() {
        // Filter event listeners
        document.getElementById('courseFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('statusFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('dueRangeFilter').addEventListener('change', () => this.applyFilters());
        
        // Sort event listeners
        document.querySelectorAll('.sortable').forEach(header => {
            header.addEventListener('click', (e) => {
                const column = e.currentTarget.getAttribute('data-column');
                this.sortTable(column);
            });
        });
        
        // Add assignment form
        document.getElementById('addAssignmentForm').addEventListener('submit', (e) => this.handleAddAssignment(e));
    }
    
    applyFilters() {
        const courseFilter = document.getElementById('courseFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;
        const dueRangeFilter = document.getElementById('dueRangeFilter').value;
        
        this.filteredAssignments = this.assignments.filter(assignment => {
            // Course filter
            if (courseFilter && assignment.course !== courseFilter) {
                return false;
            }
            
            // Status filter
            if (statusFilter && assignment.status !== statusFilter) {
                return false;
            }
            
            // Due date range filter
            if (dueRangeFilter) {
                const today = new Date();
                const dueDate = new Date(assignment.dueDate);
                
                switch (dueRangeFilter) {
                    case 'today':
                        if (dueDate.toDateString() !== today.toDateString()) {
                            return false;
                        }
                        break;
                    case 'week':
                        const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                        if (dueDate > weekFromNow) {
                            return false;
                        }
                        break;
                    case 'month':
                        const monthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
                        if (dueDate > monthFromNow) {
                            return false;
                        }
                        break;
                    case 'overdue':
                        if (dueDate >= today) {
                            return false;
                        }
                        break;
                }
            }
            
            return true;
        });
        
        this.renderTable();
        this.updateSummary();
    }
    
    sortTable(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
        
        this.filteredAssignments.sort((a, b) => {
            let aValue = a[column];
            let bValue = b[column];
            
            // Handle date sorting
            if (column === 'dueDate') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }
            
            // Handle numeric sorting
            if (column === 'hours') {
                aValue = Number(aValue);
                bValue = Number(bValue);
            }
            
            // Handle priority sorting
            if (column === 'priority') {
                const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
                aValue = priorityOrder[aValue] || 0;
                bValue = priorityOrder[bValue] || 0;
            }
            
            if (aValue < bValue) {
                return this.sortDirection === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return this.sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });
        
        this.updateSortIndicators();
        this.renderTable();
    }
    
    updateSortIndicators() {
        document.querySelectorAll('.sortable').forEach(header => {
            header.classList.remove('sort-asc', 'sort-desc');
            const column = header.getAttribute('data-column');
            if (column === this.sortColumn) {
                header.classList.add(this.sortDirection === 'asc' ? 'sort-asc' : 'sort-desc');
            }
        });
    }
    
    renderTable() {
        const tbody = document.getElementById('assignmentsTableBody');
        tbody.innerHTML = '';
        
        this.filteredAssignments.forEach(assignment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${assignment.title}</td>
                <td>${assignment.courseName}</td>
                <td><span class="status-chip status-${assignment.status}">${assignment.status.replace('-', ' ')}</span></td>
                <td>${this.formatDate(assignment.dueDate)}</td>
                <td><span class="priority-chip priority-${assignment.priority}">${assignment.priority}</span></td>
                <td>${assignment.hours}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editAssignment(${assignment.id})">Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteAssignment(${assignment.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    updateSummary() {
        const totalAssignments = this.filteredAssignments.length;
        const totalHours = this.filteredAssignments.reduce((sum, assignment) => sum + assignment.hours, 0);
        const pendingCount = this.filteredAssignments.filter(a => a.status === 'pending').length;
        const overdueCount = this.filteredAssignments.filter(a => {
            const dueDate = new Date(a.dueDate);
            const today = new Date();
            return dueDate < today && a.status !== 'completed';
        }).length;
        
        document.getElementById('totalAssignments').textContent = totalAssignments;
        document.getElementById('totalHours').textContent = totalHours;
        document.getElementById('pendingCount').textContent = pendingCount;
        document.getElementById('overdueCount').textContent = overdueCount;
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const diffTime = date.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
            return `${date.toLocaleDateString()} (Overdue)`;
        } else if (diffDays === 0) {
            return `${date.toLocaleDateString()} (Today)`;
        } else if (diffDays === 1) {
            return `${date.toLocaleDateString()} (Tomorrow)`;
        } else if (diffDays <= 7) {
            return `${date.toLocaleDateString()} (${diffDays} days)`;
        } else {
            return date.toLocaleDateString();
        }
    }
    
    clearFilters() {
        document.getElementById('courseFilter').value = '';
        document.getElementById('statusFilter').value = '';
        document.getElementById('dueRangeFilter').value = '';
        this.filteredAssignments = [...this.assignments];
        this.renderTable();
        this.updateSummary();
    }
    
    loadCoursesFromStorage() {
        // Load courses from localStorage (from dashboard)
        const courses = JSON.parse(localStorage.getItem('arqon_courses') || '[]');
        this.courses = courses;
    }
    
    populateCourseDropdowns() {
        const courseFilter = document.getElementById('courseFilter');
        const assignmentCourse = document.getElementById('assignmentCourse');
        
        // Clear existing options (except first)
        courseFilter.innerHTML = '<option value="">All Courses</option>';
        assignmentCourse.innerHTML = '<option value="">Select Course</option>';
        
        // Add courses to both dropdowns
        this.courses.forEach(course => {
            const option1 = document.createElement('option');
            option1.value = course.code;
            option1.textContent = `${course.code} - ${course.name}`;
            courseFilter.appendChild(option1);
            
            const option2 = document.createElement('option');
            option2.value = course.code;
            option2.textContent = `${course.code} - ${course.name}`;
            assignmentCourse.appendChild(option2);
        });
    }
    
    handleAddAssignment(e) {
        e.preventDefault();
        
        const title = document.getElementById('assignmentTitle').value.trim();
        const courseCode = document.getElementById('assignmentCourse').value;
        const description = document.getElementById('assignmentDescription').value.trim();
        const dueDate = document.getElementById('assignmentDueDate').value;
        const priority = document.getElementById('assignmentPriority').value;
        const hours = parseInt(document.getElementById('assignmentHours').value);
        
        if (!title || !courseCode || !dueDate) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Find course details
        const course = this.courses.find(c => c.code === courseCode);
        if (!course) {
            alert('Selected course not found');
            return;
        }
        
        // Create new assignment
        const newAssignment = {
            id: Date.now(),
            title: title,
            course: courseCode,
            courseName: course.name,
            status: 'pending',
            dueDate: dueDate,
            priority: priority,
            hours: hours,
            description: description
        };
        
        // Add to assignments array
        this.assignments.push(newAssignment);
        this.filteredAssignments = [...this.assignments];
        
        // Save to localStorage
        localStorage.setItem('arqon_assignments', JSON.stringify(this.assignments));
        
        // Update display
        this.renderTable();
        this.updateSummary();
        
        // Close modal and reset form
        this.closeAddAssignmentModal();
        
        // Show success message
        this.showNotification('Assignment added successfully!', 'success');
    }
    
    closeAddAssignmentModal() {
        document.getElementById('addAssignmentModal').style.display = 'none';
        document.getElementById('addAssignmentForm').reset();
    }
    
    showNotification(message, type = 'info') {
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
}

// Global functions
function goBack() {
    window.location.href = 'study-dashboard.html';
}

function goToCourses() {
    window.location.href = 'study-dashboard.html';
}

function goToCalendar() {
    // Placeholder for calendar page
    alert('Calendar functionality will be implemented here');
}

function goToAnalytics() {
    // Placeholder for analytics page
    alert('Analytics functionality will be implemented here');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.clear();
        localStorage.removeItem('arqon_remember_me');
        window.location.href = 'index.html';
    }
}

function addAssignment() {
    document.getElementById('addAssignmentModal').style.display = 'flex';
}

function closeAddAssignmentModal() {
    assignmentsManager.closeAddAssignmentModal();
}

function editAssignment(id) {
    // Placeholder for edit assignment functionality
    alert(`Edit Assignment ${id} functionality will be implemented here`);
}

function deleteAssignment(id) {
    if (confirm('Are you sure you want to delete this assignment?')) {
        assignmentsManager.assignments = assignmentsManager.assignments.filter(a => a.id !== id);
        assignmentsManager.applyFilters();
    }
}

function clearFilters() {
    assignmentsManager.clearFilters();
}

// Initialize the assignments manager when the page loads
let assignmentsManager;
document.addEventListener('DOMContentLoaded', () => {
    assignmentsManager = new AssignmentsManager();
});
