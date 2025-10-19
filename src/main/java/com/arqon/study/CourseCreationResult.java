package com.arqon.study;

/**
 * Result of course creation operation
 */
public class CourseCreationResult {
    private final boolean success;
    private final Course course;
    private final String message;
    private final String errorMessage;
    
    public CourseCreationResult(boolean success, Course course, String message) {
        this.success = success;
        this.course = course;
        this.message = message;
        this.errorMessage = success ? null : message;
    }
    
    public boolean isSuccess() {
        return success;
    }
    
    public Course getCourse() {
        return course;
    }
    
    public String getMessage() {
        return message;
    }
    
    public String getErrorMessage() {
        return errorMessage;
    }
    
    @Override
    public String toString() {
        return "CourseCreationResult{" +
                "success=" + success +
                ", course=" + course +
                ", message='" + message + '\'' +
                '}';
    }
}
