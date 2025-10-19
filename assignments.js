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
        this.setupEventListeners();
        this.renderTable();
        this.updateSummary();
    }
    
    loadSampleData() {
        this.assignments = [
            {
                id: 1,
                title: "Data Structures Project",
                course: "CS201",
                courseName: "Data Structures and Algorithms",
                status: "in-progress",
                dueDate: "2024-10-25",
                priority: "high",
                hours: 8,
                description: "Implement binary search tree with operations"
            },
            {
                id: 2,
                title: "Web Development Assignment",
                course: "CS301",
                courseName: "Software Engineering",
                status: "pending",
                dueDate: "2024-10-28",
                priority: "medium",
                hours: 6,
                description: "Create responsive website using HTML/CSS/JS"
            },
            {
                id: 3,
                title: "Database Design Report",
                course: "CS101",
                courseName: "Introduction to Computer Science",
                status: "completed",
                dueDate: "2024-10-20",
                priority: "low",
                hours: 4,
                description: "Design ER diagram for library management system"
            },
            {
                id: 4,
                title: "Algorithm Analysis",
                course: "CS201",
                courseName: "Data Structures and Algorithms",
                status: "overdue",
                dueDate: "2024-10-15",
                priority: "high",
                hours: 5,
                description: "Analyze time complexity of sorting algorithms"
            },
            {
                id: 5,
                title: "Mobile App Prototype",
                course: "CS301",
                courseName: "Software Engineering",
                status: "pending",
                dueDate: "2024-11-02",
                priority: "medium",
                hours: 12,
                description: "Create wireframes and user flow for mobile app"
            }
        ];
        
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
}

// Global functions
function goBack() {
    window.location.href = 'study-dashboard.html';
}

function addAssignment() {
    // Placeholder for add assignment functionality
    alert('Add Assignment functionality will be implemented here');
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
