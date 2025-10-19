package com.arqon.study;

import java.time.LocalDateTime;

/**
 * User entity representing a registered user
 */
public class User {
    private String id;
    private String email;
    private String password; // Hashed password
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;
    
    public User() {}
    
    public User(String id, String email, String password) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(LocalDateTime lastLoginAt) { this.lastLoginAt = lastLoginAt; }
}
