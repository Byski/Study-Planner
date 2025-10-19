package com.arqon.study;

import java.util.Optional;

/**
 * Service for managing course operations
 * Handles business logic for course creation, deletion, and validation
 */
public class CourseManagementService {
    private final CourseRepository courseRepository;
    
    public CourseManagementService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }
    
    /**
     * Create a new course with validation
     * @param name course name (required)
     * @param code course code
     * @param instructor instructor name
     * @param description course description
     * @param startDate start date
     * @param endDate end date
     * @return CourseCreationResult with success status and course or error message
     */
    public CourseCreationResult createCourse(String name, String code, String instructor, 
                                           String description, String startDate, String endDate) {
        // Validate required fields
        if (name == null || name.trim().isEmpty()) {
            return new CourseCreationResult(false, null, "Course name is required");
        }
        
        // Create course entity
        Course course = new Course(name.trim(), code, instructor, description, startDate, endDate);
        
        // Save to repository
        Course savedCourse = courseRepository.save(course);
        
        return new CourseCreationResult(true, savedCourse, "Course created successfully");
    }
    
    /**
     * Delete a course by ID
     * @param courseId the ID of the course to delete
     * @return CourseDeletionResult with success status and message
     */
    public CourseDeletionResult deleteCourse(Long courseId) {
        if (courseId == null) {
            return new CourseDeletionResult(false, "Course ID is required");
        }
        
        if (!courseRepository.existsById(courseId)) {
            return new CourseDeletionResult(false, "Course not found");
        }
        
        boolean deleted = courseRepository.deleteById(courseId);
        
        if (deleted) {
            return new CourseDeletionResult(true, "Course deleted successfully");
        } else {
            return new CourseDeletionResult(false, "Failed to delete course");
        }
    }
    
    /**
     * Get all courses
     * @return list of all courses
     */
    public java.util.List<Course> getAllCourses() {
        return courseRepository.findAll();
    }
    
    /**
     * Get a course by ID
     * @param courseId the course ID
     * @return Optional containing the course if found
     */
    public Optional<Course> getCourseById(Long courseId) {
        return courseRepository.findById(courseId);
    }
}
