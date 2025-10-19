package com.arqon.study;

import java.time.LocalDateTime;
import java.util.Objects;

public class Assignment {
    private Long id;
    private String title;
    private String description;
    private String course;
    private LocalDateTime dueDate;
    private String status;
    private String priority;
    private Integer estimatedHours;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Assignment(Long id, String title, String description, String course, LocalDateTime dueDate, 
                     String status, String priority, Integer estimatedHours) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.course = course;
        this.dueDate = dueDate;
        this.status = status;
        this.priority = priority;
        this.estimatedHours = estimatedHours;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getCourse() { return course; }
    public LocalDateTime getDueDate() { return dueDate; }
    public String getStatus() { return status; }
    public String getPriority() { return priority; }
    public Integer getEstimatedHours() { return estimatedHours; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setCourse(String course) { this.course = course; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }
    public void setStatus(String status) { 
        this.status = status; 
        this.updatedAt = LocalDateTime.now();
    }
    public void setPriority(String priority) { this.priority = priority; }
    public void setEstimatedHours(Integer estimatedHours) { this.estimatedHours = estimatedHours; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Assignment that = (Assignment) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Assignment{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", course='" + course + '\'' +
                ", dueDate=" + dueDate +
                ", status='" + status + '\'' +
                ", priority='" + priority + '\'' +
                ", estimatedHours=" + estimatedHours +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
