package com.arqon.study;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public class AssignmentManagementTest {

    private AssignmentRepository assignmentRepository;
    private AssignmentManagementService assignmentManagementService;

    @BeforeEach
    void setUp() {
        assignmentRepository = new AssignmentRepository();
        assignmentManagementService = new AssignmentManagementService(assignmentRepository);
    }

    // RED PHASE: Assignment Creation Tests
    @Test
    @DisplayName("RED: Should create assignment successfully with valid details")
    void testCreateAssignmentSuccess() {
        // Given
        String title = "Complete Java Assignment";
        String description = "Implement a calculator application";
        String course = "CS101";
        LocalDateTime dueDate = LocalDateTime.now().plusDays(7);
        String priority = "high";
        Integer estimatedHours = 10;

        // When
        AssignmentCreationResult result = assignmentManagementService.createAssignment(
                title, description, course, dueDate, priority, estimatedHours);

        // Then
        assertTrue(result.isSuccess());
        assertNotNull(result.getAssignment());
        assertEquals("Complete Java Assignment", result.getAssignment().getTitle());
        assertEquals("todo", result.getAssignment().getStatus());
        assertEquals(1, assignmentRepository.count());
    }

    @Test
    @DisplayName("RED: Should not create assignment with blank title")
    void testCreateAssignmentBlankTitle() {
        // Given
        String title = "   ";
        String description = "Some description";
        String course = "CS101";
        LocalDateTime dueDate = LocalDateTime.now().plusDays(7);
        String priority = "medium";
        Integer estimatedHours = 5;

        // When
        AssignmentCreationResult result = assignmentManagementService.createAssignment(
                title, description, course, dueDate, priority, estimatedHours);

        // Then
        assertFalse(result.isSuccess());
        assertEquals("Assignment title is required.", result.getErrorMessage());
        assertEquals(0, assignmentRepository.count());
    }

    @Test
    @DisplayName("RED: Should not create assignment with null title")
    void testCreateAssignmentNullTitle() {
        // Given
        String title = null;
        String description = "Some description";
        String course = "CS101";
        LocalDateTime dueDate = LocalDateTime.now().plusDays(7);
        String priority = "medium";
        Integer estimatedHours = 5;

        // When
        AssignmentCreationResult result = assignmentManagementService.createAssignment(
                title, description, course, dueDate, priority, estimatedHours);

        // Then
        assertFalse(result.isSuccess());
        assertEquals("Assignment title is required.", result.getErrorMessage());
        assertEquals(0, assignmentRepository.count());
    }

    @Test
    @DisplayName("RED: Should not create assignment with null due date")
    void testCreateAssignmentNullDueDate() {
        // Given
        String title = "Valid Title";
        String description = "Some description";
        String course = "CS101";
        LocalDateTime dueDate = null;
        String priority = "medium";
        Integer estimatedHours = 5;

        // When
        AssignmentCreationResult result = assignmentManagementService.createAssignment(
                title, description, course, dueDate, priority, estimatedHours);

        // Then
        assertFalse(result.isSuccess());
        assertEquals("Due date is required.", result.getErrorMessage());
        assertEquals(0, assignmentRepository.count());
    }

    // GREEN PHASE: Assignment Listing and Sorting Tests
    @Test
    @DisplayName("GREEN: Should list assignments ordered by due date with nulls last")
    void testListAssignmentsSortedByDueDate() {
        // Given
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime dueDate1 = now.plusDays(3);
        LocalDateTime dueDate2 = now.plusDays(1);
        LocalDateTime dueDate3 = now.plusDays(5);

        assignmentManagementService.createAssignment("Assignment 1", "Desc 1", "CS101", dueDate1, "high", 5);
        assignmentManagementService.createAssignment("Assignment 2", "Desc 2", "CS102", dueDate2, "medium", 3);
        assignmentManagementService.createAssignment("Assignment 3", "Desc 3", "CS103", dueDate3, "low", 8);

        // When
        List<Assignment> assignments = assignmentManagementService.getAllAssignments();

        // Then
        assertEquals(3, assignments.size());
        assertEquals("Assignment 2", assignments.get(0).getTitle()); // Due in 1 day
        assertEquals("Assignment 1", assignments.get(1).getTitle()); // Due in 3 days
        assertEquals("Assignment 3", assignments.get(2).getTitle()); // Due in 5 days
    }

    @Test
    @DisplayName("GREEN: Should show assignment details including title, course, and due date")
    void testAssignmentDetails() {
        // Given
        String title = "Database Design Project";
        String description = "Design a normalized database schema";
        String course = "CS301";
        LocalDateTime dueDate = LocalDateTime.now().plusDays(14);
        String priority = "high";
        Integer estimatedHours = 15;

        // When
        AssignmentCreationResult result = assignmentManagementService.createAssignment(
                title, description, course, dueDate, priority, estimatedHours);

        // Then
        assertTrue(result.isSuccess());
        Assignment assignment = result.getAssignment();
        assertEquals(title, assignment.getTitle());
        assertEquals(description, assignment.getDescription());
        assertEquals(course, assignment.getCourse());
        assertEquals(dueDate, assignment.getDueDate());
        assertEquals(priority, assignment.getPriority());
        assertEquals(estimatedHours, assignment.getEstimatedHours());
        assertEquals("todo", assignment.getStatus());
    }

    // REFACTOR PHASE: Assignment Filtering Tests
    @Test
    @DisplayName("REFACTOR: Should filter assignments by course")
    void testFilterAssignmentsByCourse() {
        // Given
        LocalDateTime now = LocalDateTime.now();
        assignmentManagementService.createAssignment("Java Assignment", "Java basics", "CS101", now.plusDays(1), "high", 5);
        assignmentManagementService.createAssignment("Python Assignment", "Python basics", "CS102", now.plusDays(2), "medium", 3);
        assignmentManagementService.createAssignment("Database Assignment", "DB design", "CS101", now.plusDays(3), "low", 8);

        // When
        List<Assignment> cs101Assignments = assignmentManagementService.getAssignmentsWithFilters("CS101", null, null, null);

        // Then
        assertEquals(2, cs101Assignments.size());
        assertTrue(cs101Assignments.stream().allMatch(a -> a.getCourse().equals("CS101")));
    }

    @Test
    @DisplayName("REFACTOR: Should filter assignments by status")
    void testFilterAssignmentsByStatus() {
        // Given
        LocalDateTime now = LocalDateTime.now();
        assignmentManagementService.createAssignment("Assignment 1", "Desc 1", "CS101", now.plusDays(1), "high", 5);
        assignmentManagementService.createAssignment("Assignment 2", "Desc 2", "CS102", now.plusDays(2), "medium", 3);
        
        // Update one assignment status
        List<Assignment> allAssignments = assignmentManagementService.getAllAssignments();
        Assignment assignment1 = allAssignments.get(0);
        assignmentManagementService.updateAssignmentStatus(assignment1.getId(), "in-progress");

        // When
        List<Assignment> inProgressAssignments = assignmentManagementService.getAssignmentsWithFilters(null, "in-progress", null, null);

        // Then
        assertEquals(1, inProgressAssignments.size());
        assertEquals("in-progress", inProgressAssignments.get(0).getStatus());
    }

    @Test
    @DisplayName("REFACTOR: Should filter assignments by due date range")
    void testFilterAssignmentsByDueDateRange() {
        // Given
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startRange = now.plusDays(1);
        LocalDateTime endRange = now.plusDays(3);
        
        assignmentManagementService.createAssignment("Assignment 1", "Desc 1", "CS101", now.plusDays(1), "high", 5);
        assignmentManagementService.createAssignment("Assignment 2", "Desc 2", "CS102", now.plusDays(2), "medium", 3);
        assignmentManagementService.createAssignment("Assignment 3", "Desc 3", "CS103", now.plusDays(5), "low", 8);

        // When
        List<Assignment> filteredAssignments = assignmentManagementService.getAssignmentsWithFilters(
                null, null, startRange, endRange);

        // Then
        assertEquals(2, filteredAssignments.size());
        assertTrue(filteredAssignments.stream().allMatch(a -> 
                a.getDueDate().isAfter(startRange.minusDays(1)) && 
                a.getDueDate().isBefore(endRange.plusDays(1))));
    }

    // REFACTOR PHASE: Assignment Status Update Tests
    @Test
    @DisplayName("REFACTOR: Should update assignment status successfully")
    void testUpdateAssignmentStatus() {
        // Given
        LocalDateTime now = LocalDateTime.now();
        AssignmentCreationResult createResult = assignmentManagementService.createAssignment(
                "Test Assignment", "Test Description", "CS101", now.plusDays(7), "high", 5);
        assertTrue(createResult.isSuccess());
        Assignment assignment = createResult.getAssignment();

        // When
        AssignmentStatusUpdateResult updateResult = assignmentManagementService.updateAssignmentStatus(
                assignment.getId(), "in-progress");

        // Then
        assertTrue(updateResult.isSuccess());
        assertEquals("Assignment status updated successfully.", updateResult.getMessage());
        
        Optional<Assignment> updatedAssignment = assignmentManagementService.getAssignmentById(assignment.getId());
        assertTrue(updatedAssignment.isPresent());
        assertEquals("in-progress", updatedAssignment.get().getStatus());
    }

    @Test
    @DisplayName("REFACTOR: Should not update status for non-existent assignment")
    void testUpdateStatusNonExistentAssignment() {
        // When
        AssignmentStatusUpdateResult result = assignmentManagementService.updateAssignmentStatus(999L, "in-progress");

        // Then
        assertFalse(result.isSuccess());
        assertEquals("Assignment not found.", result.getErrorMessage());
    }

    @Test
    @DisplayName("REFACTOR: Should not update status with empty status")
    void testUpdateStatusWithEmptyStatus() {
        // Given
        LocalDateTime now = LocalDateTime.now();
        AssignmentCreationResult createResult = assignmentManagementService.createAssignment(
                "Test Assignment", "Test Description", "CS101", now.plusDays(7), "high", 5);
        assertTrue(createResult.isSuccess());
        Assignment assignment = createResult.getAssignment();

        // When
        AssignmentStatusUpdateResult updateResult = assignmentManagementService.updateAssignmentStatus(
                assignment.getId(), "   ");

        // Then
        assertFalse(updateResult.isSuccess());
        assertEquals("Status cannot be empty.", updateResult.getErrorMessage());
    }

    @Test
    @DisplayName("REFACTOR: Should get overdue assignments")
    void testGetOverdueAssignments() {
        // Given
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime pastDate = now.minusDays(2);
        LocalDateTime futureDate = now.plusDays(2);
        
        assignmentManagementService.createAssignment("Overdue Assignment", "Desc 1", "CS101", pastDate, "high", 5);
        assignmentManagementService.createAssignment("Future Assignment", "Desc 2", "CS102", futureDate, "medium", 3);

        // When
        List<Assignment> overdueAssignments = assignmentManagementService.getOverdueAssignments();

        // Then
        assertEquals(1, overdueAssignments.size());
        assertEquals("Overdue Assignment", overdueAssignments.get(0).getTitle());
    }

    @Test
    @DisplayName("REFACTOR: Should count assignments by status")
    void testCountAssignmentsByStatus() {
        // Given
        LocalDateTime now = LocalDateTime.now();
        assignmentManagementService.createAssignment("Assignment 1", "Desc 1", "CS101", now.plusDays(1), "high", 5);
        assignmentManagementService.createAssignment("Assignment 2", "Desc 2", "CS102", now.plusDays(2), "medium", 3);
        
        // Update one assignment status
        List<Assignment> allAssignments = assignmentManagementService.getAllAssignments();
        Assignment assignment1 = allAssignments.get(0);
        assignmentManagementService.updateAssignmentStatus(assignment1.getId(), "completed");

        // When & Then
        assertEquals(1, assignmentManagementService.getAssignmentsCountByStatus("todo"));
        assertEquals(1, assignmentManagementService.getAssignmentsCountByStatus("completed"));
        assertEquals(0, assignmentManagementService.getAssignmentsCountByStatus("in-progress"));
    }
}
