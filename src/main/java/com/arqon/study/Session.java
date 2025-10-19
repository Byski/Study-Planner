package com.arqon.study;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Session entity representing an active user session
 */
public class Session {
    private String sessionId;
    private String userId;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private boolean active;
    
    public Session() {}
    
    public Session(String userId) {
        this.sessionId = UUID.randomUUID().toString();
        this.userId = userId;
        this.createdAt = LocalDateTime.now();
        this.expiresAt = LocalDateTime.now().plusHours(24); // 24 hour session
        this.active = true;
    }
    
    // Getters and Setters
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
    
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }
}
