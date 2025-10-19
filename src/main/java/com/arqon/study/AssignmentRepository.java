package com.arqon.study;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

public class AssignmentRepository {
    private final Map<Long, Assignment> assignments = new ConcurrentHashMap<>();
    private final AtomicLong nextId = new AtomicLong(1);

    public Assignment save(Assignment assignment) {
        if (assignment.getId() == null) {
            assignment.setId(nextId.getAndIncrement());
        }
        assignment.setUpdatedAt(LocalDateTime.now());
        assignments.put(assignment.getId(), assignment);
        return assignment;
    }

    public Optional<Assignment> findAssignmentById(Long id) {
        return Optional.ofNullable(assignments.get(id));
    }

    public List<Assignment> findAllAssignments() {
        return new ArrayList<>(assignments.values());
    }

    public List<Assignment> findAssignmentsByCourse(String course) {
        return assignments.values().stream()
                .filter(assignment -> assignment.getCourse().equals(course))
                .collect(Collectors.toList());
    }

    public List<Assignment> findAssignmentsByStatus(String status) {
        return assignments.values().stream()
                .filter(assignment -> assignment.getStatus().equals(status))
                .collect(Collectors.toList());
    }

    public List<Assignment> findAssignmentsByDueDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return assignments.values().stream()
                .filter(assignment -> {
                    LocalDateTime dueDate = assignment.getDueDate();
                    if (dueDate == null) return false;
                    return !dueDate.isBefore(startDate) && !dueDate.isAfter(endDate);
                })
                .collect(Collectors.toList());
    }

    public List<Assignment> findOverdueAssignments() {
        LocalDateTime now = LocalDateTime.now();
        return assignments.values().stream()
                .filter(assignment -> {
                    LocalDateTime dueDate = assignment.getDueDate();
                    return dueDate != null && dueDate.isBefore(now) && 
                           !assignment.getStatus().equals("completed");
                })
                .collect(Collectors.toList());
    }

    public List<Assignment> findAllAssignmentsSortedByDueDate() {
        return assignments.values().stream()
                .sorted(Comparator.comparing(Assignment::getDueDate, 
                        Comparator.nullsLast(Comparator.naturalOrder())))
                .collect(Collectors.toList());
    }

    public List<Assignment> findAssignmentsWithFilters(String course, String status, 
                                                       LocalDateTime startDate, LocalDateTime endDate) {
        return assignments.values().stream()
                .filter(assignment -> {
                    if (course != null && !course.isEmpty() && !assignment.getCourse().equals(course)) {
                        return false;
                    }
                    if (status != null && !status.isEmpty() && !assignment.getStatus().equals(status)) {
                        return false;
                    }
                    if (startDate != null && assignment.getDueDate() != null && 
                        assignment.getDueDate().isBefore(startDate)) {
                        return false;
                    }
                    if (endDate != null && assignment.getDueDate() != null && 
                        assignment.getDueDate().isAfter(endDate)) {
                        return false;
                    }
                    return true;
                })
                .sorted(Comparator.comparing(Assignment::getDueDate, 
                        Comparator.nullsLast(Comparator.naturalOrder())))
                .collect(Collectors.toList());
    }

    public Optional<Assignment> updateAssignment(Assignment updatedAssignment) {
        if (assignments.containsKey(updatedAssignment.getId())) {
            updatedAssignment.setUpdatedAt(LocalDateTime.now());
            assignments.put(updatedAssignment.getId(), updatedAssignment);
            return Optional.of(updatedAssignment);
        }
        return Optional.empty();
    }

    public boolean deleteAssignment(Long id) {
        return assignments.remove(id) != null;
    }

    public void clear() {
        assignments.clear();
        nextId.set(1);
    }

    public long count() {
        return assignments.size();
    }
}
