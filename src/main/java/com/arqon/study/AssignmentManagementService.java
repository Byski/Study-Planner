package com.arqon.study;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public class AssignmentManagementService {
    private final AssignmentRepository assignmentRepository;

    public AssignmentManagementService(AssignmentRepository assignmentRepository) {
        this.assignmentRepository = assignmentRepository;
    }

    public AssignmentCreationResult createAssignment(String title, String description, String course, 
                                                   LocalDateTime dueDate, String priority, Integer estimatedHours) {
        if (title == null || title.trim().isEmpty()) {
            return AssignmentCreationResult.failure("Assignment title is required.");
        }
        
        if (dueDate == null) {
            return AssignmentCreationResult.failure("Due date is required.");
        }

        Assignment newAssignment = new Assignment(null, title.trim(), description, course, dueDate, 
                                                "todo", priority, estimatedHours);
        assignmentRepository.save(newAssignment);
        return AssignmentCreationResult.success(newAssignment);
    }

    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAllAssignmentsSortedByDueDate();
    }

    public List<Assignment> getAssignmentsWithFilters(String course, String status, 
                                                     LocalDateTime startDate, LocalDateTime endDate) {
        return assignmentRepository.findAssignmentsWithFilters(course, status, startDate, endDate);
    }

    public AssignmentStatusUpdateResult updateAssignmentStatus(Long assignmentId, String newStatus) {
        if (assignmentId == null) {
            return AssignmentStatusUpdateResult.failure("Assignment ID cannot be null.");
        }
        
        if (newStatus == null || newStatus.trim().isEmpty()) {
            return AssignmentStatusUpdateResult.failure("Status cannot be empty.");
        }

        Optional<Assignment> assignmentOpt = assignmentRepository.findAssignmentById(assignmentId);
        if (assignmentOpt.isEmpty()) {
            return AssignmentStatusUpdateResult.failure("Assignment not found.");
        }

        Assignment assignment = assignmentOpt.get();
        assignment.setStatus(newStatus.trim());
        assignmentRepository.updateAssignment(assignment);
        
        return AssignmentStatusUpdateResult.success("Assignment status updated successfully.");
    }

    public Optional<Assignment> getAssignmentById(Long id) {
        return assignmentRepository.findAssignmentById(id);
    }

    public List<Assignment> getOverdueAssignments() {
        return assignmentRepository.findOverdueAssignments();
    }

    public long getTotalAssignmentsCount() {
        return assignmentRepository.count();
    }

    public long getAssignmentsCountByStatus(String status) {
        return assignmentRepository.findAssignmentsByStatus(status).size();
    }
}
