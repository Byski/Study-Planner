package com.arqon.study;

/**
 * Result of logout operation
 */
public class LogoutResult {
    private boolean success;
    private String errorMessage;
    
    public LogoutResult(boolean success, String errorMessage) {
        this.success = success;
        this.errorMessage = errorMessage;
    }
    
    public boolean isSuccess() { return success; }
    public String getErrorMessage() { return errorMessage; }
}
