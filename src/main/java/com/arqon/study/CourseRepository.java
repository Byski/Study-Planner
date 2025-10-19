package com.arqon.study;

import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

/**
 * In-memory repository for Course entities
 * Simulates database operations for testing purposes
 */
public class CourseRepository {
    private final Map<Long, Course> courses = new HashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);
    
    /**
     * Save a course to the repository
     * @param course the course to save
     * @return the saved course with generated ID
     */
    public Course save(Course course) {
        if (course.getId() == null) {
            course.setId(idGenerator.getAndIncrement());
        }
        courses.put(course.getId(), course);
        return course;
    }
    
    /**
     * Find a course by ID
     * @param id the course ID
     * @return Optional containing the course if found
     */
    public Optional<Course> findById(Long id) {
        return Optional.ofNullable(courses.get(id));
    }
    
    /**
     * Find all courses
     * @return list of all courses
     */
    public List<Course> findAll() {
        return new ArrayList<>(courses.values());
    }
    
    /**
     * Delete a course by ID
     * @param id the course ID to delete
     * @return true if course was deleted, false if not found
     */
    public boolean deleteById(Long id) {
        return courses.remove(id) != null;
    }
    
    /**
     * Check if a course exists by ID
     * @param id the course ID
     * @return true if course exists
     */
    public boolean existsById(Long id) {
        return courses.containsKey(id);
    }
    
    /**
     * Clear all courses (useful for testing)
     */
    public void clear() {
        courses.clear();
        idGenerator.set(1);
    }
    
    /**
     * Get the number of courses
     * @return count of courses
     */
    public int count() {
        return courses.size();
    }
}
