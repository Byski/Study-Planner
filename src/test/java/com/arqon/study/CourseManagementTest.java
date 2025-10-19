package com.arqon.study;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;
import java.util.List;
import java.util.Optional;

/**
 * TDD Test Suite for Course Management Features
 * 
 * User Stories:
 * 1. As a user, I want to delete a course I own so that I can remove outdated courses
 * 2. As a user, I want to create a course so that I can track my academic progress
 * 3. As a user, I want validation for required fields so that data integrity is maintained
 * 
 * TDD Cycle: RED -> GREEN -> REFACTOR
 */
public class CourseManagementTest {
    
    private CourseRepository courseRepository;
    private CourseManagementService courseService;
    
    @BeforeEach
    void setUp() {
        courseRepository = new CourseRepository();
        courseService = new CourseManagementService(courseRepository);
    }
    
    @Test
    @DisplayName("When I delete a course I own, then it is removed and success message shows")
    void testDeleteOwnedCourse() {
        // Given - User creates and owns a course
        CourseCreationResult creationResult = courseService.createCourse(
            "Introduction to Computer Science",
            "CS101",
            "Dr. Smith",
            "Basic programming concepts",
            "2024-01-15",
            "2024-05-15"
        );
        assertTrue(creationResult.isSuccess());
        assertNotNull(creationResult.getCourse());
        Long courseId = creationResult.getCourse().getId();
        
        // When - User deletes the course
        CourseDeletionResult deletionResult = courseService.deleteCourse(courseId);
        
        // Then - Course is removed and success message is shown
        assertTrue(deletionResult.isSuccess());
        assertEquals("Course deleted successfully", deletionResult.getMessage());
        
        // Verify course no longer exists
        Optional<Course> deletedCourse = courseRepository.findById(courseId);
        assertTrue(deletedCourse.isEmpty());
        
        // Verify course list is empty
        List<Course> allCourses = courseRepository.findAll();
        assertTrue(allCourses.isEmpty());
    }
    
    @Test
    @DisplayName("When I submit a course name, then the course is created")
    void testCreateCourseWithValidName() {
        // Given - Valid course data
        String courseName = "Data Structures and Algorithms";
        String courseCode = "CS201";
        String instructor = "Prof. Johnson";
        String description = "Advanced data structures";
        String startDate = "2024-02-01";
        String endDate = "2024-06-01";
        
        // When - User creates a course
        CourseCreationResult result = courseService.createCourse(
            courseName, courseCode, instructor, description, startDate, endDate
        );
        
        // Then - Course is created successfully
        assertTrue(result.isSuccess());
        assertNotNull(result.getCourse());
        assertEquals(courseName, result.getCourse().getName());
        assertEquals(courseCode, result.getCourse().getCode());
        assertEquals(instructor, result.getCourse().getInstructor());
        assertEquals(description, result.getCourse().getDescription());
        assertEquals(startDate, result.getCourse().getStartDate());
        assertEquals(endDate, result.getCourse().getEndDate());
        
        // Verify course exists in repository
        Optional<Course> savedCourse = courseRepository.findById(result.getCourse().getId());
        assertTrue(savedCourse.isPresent());
        assertEquals(courseName, savedCourse.get().getName());
    }
    
    @Test
    @DisplayName("Name is required; blank name shows inline error and preserves entered fields")
    void testCreateCourseWithBlankName() {
        // Given - Course data with blank name
        String courseName = "";  // Blank name
        String courseCode = "CS301";
        String instructor = "Dr. Brown";
        String description = "Software Engineering";
        String startDate = "2024-03-01";
        String endDate = "2024-07-01";
        
        // When - User attempts to create course with blank name
        CourseCreationResult result = courseService.createCourse(
            courseName, courseCode, instructor, description, startDate, endDate
        );
        
        // Then - Creation fails with inline error
        assertFalse(result.isSuccess());
        assertTrue(result.getErrorMessage().contains("Course name is required"));
        assertNull(result.getCourse());
        
        // Verify no course was created
        List<Course> allCourses = courseRepository.findAll();
        assertTrue(allCourses.isEmpty());
        
        // Verify error message is specific and helpful
        assertTrue(result.getErrorMessage().contains("name"));
        assertTrue(result.getErrorMessage().contains("required"));
    }
    
    @Test
    @DisplayName("Null name shows inline error and preserves entered fields")
    void testCreateCourseWithNullName() {
        // Given - Course data with null name
        String courseName = null;
        String courseCode = "CS401";
        String instructor = "Dr. Wilson";
        String description = "Machine Learning";
        String startDate = "2024-04-01";
        String endDate = "2024-08-01";
        
        // When - User attempts to create course with null name
        CourseCreationResult result = courseService.createCourse(
            courseName, courseCode, instructor, description, startDate, endDate
        );
        
        // Then - Creation fails with inline error
        assertFalse(result.isSuccess());
        assertTrue(result.getErrorMessage().contains("Course name is required"));
        assertNull(result.getCourse());
        
        // Verify no course was created
        List<Course> allCourses = courseRepository.findAll();
        assertTrue(allCourses.isEmpty());
    }
    
    @Test
    @DisplayName("Whitespace-only name shows inline error and preserves entered fields")
    void testCreateCourseWithWhitespaceOnlyName() {
        // Given - Course data with whitespace-only name
        String courseName = "   ";  // Only whitespace
        String courseCode = "CS501";
        String instructor = "Dr. Davis";
        String description = "Artificial Intelligence";
        String startDate = "2024-05-01";
        String endDate = "2024-09-01";
        
        // When - User attempts to create course with whitespace-only name
        CourseCreationResult result = courseService.createCourse(
            courseName, courseCode, instructor, description, startDate, endDate
        );
        
        // Then - Creation fails with inline error
        assertFalse(result.isSuccess());
        assertTrue(result.getErrorMessage().contains("Course name is required"));
        assertNull(result.getCourse());
        
        // Verify no course was created
        List<Course> allCourses = courseRepository.findAll();
        assertTrue(allCourses.isEmpty());
    }
    
    @Test
    @DisplayName("Cannot delete course that does not exist")
    void testDeleteNonExistentCourse() {
        // Given - Non-existent course ID
        Long nonExistentId = 999L;
        
        // When - User attempts to delete non-existent course
        CourseDeletionResult result = courseService.deleteCourse(nonExistentId);
        
        // Then - Deletion fails with appropriate error
        assertFalse(result.isSuccess());
        assertTrue(result.getErrorMessage().contains("Course not found"));
        
        // Verify no courses exist
        List<Course> allCourses = courseRepository.findAll();
        assertTrue(allCourses.isEmpty());
    }
    
    @Test
    @DisplayName("Course creation with all required fields succeeds")
    void testCreateCourseWithAllRequiredFields() {
        // Given - Complete course data
        String courseName = "Web Development";
        String courseCode = "CS601";
        String instructor = "Dr. Taylor";
        String description = "Modern web technologies";
        String startDate = "2024-06-01";
        String endDate = "2024-10-01";
        
        // When - User creates course with all required fields
        CourseCreationResult result = courseService.createCourse(
            courseName, courseCode, instructor, description, startDate, endDate
        );
        
        // Then - Course is created successfully
        assertTrue(result.isSuccess());
        assertNotNull(result.getCourse());
        assertEquals(courseName, result.getCourse().getName());
        assertEquals(courseCode, result.getCourse().getCode());
        assertEquals(instructor, result.getCourse().getInstructor());
        assertEquals(description, result.getCourse().getDescription());
        assertEquals(startDate, result.getCourse().getStartDate());
        assertEquals(endDate, result.getCourse().getEndDate());
        
        // Verify course has valid ID and timestamps
        assertNotNull(result.getCourse().getId());
        assertNotNull(result.getCourse().getCreatedAt());
    }
}
