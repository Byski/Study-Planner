package com.arqon.study;

/**
 * Result of user registration operation
 */
public class UserRegistrationResult {
    private boolean success;
    private String errorMessage;
    private User user;
    
    public UserRegistrationResult(boolean success, String errorMessage, User user) {
        this.success = success;
        this.errorMessage = errorMessage;
        this.user = user;
    }
    
    public boolean isSuccess() { return success; }
    public String getErrorMessage() { return errorMessage; }
    public User getUser() { return user; }
}
