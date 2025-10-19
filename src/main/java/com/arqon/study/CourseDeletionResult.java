package com.arqon.study;

/**
 * Result of course deletion operation
 */
public class CourseDeletionResult {
    private final boolean success;
    private final String message;
    private final String errorMessage;
    
    public CourseDeletionResult(boolean success, String message) {
        this.success = success;
        this.message = message;
        this.errorMessage = success ? null : message;
    }
    
    public boolean isSuccess() {
        return success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public String getErrorMessage() {
        return errorMessage;
    }
    
    @Override
    public String toString() {
        return "CourseDeletionResult{" +
                "success=" + success +
                ", message='" + message + '\'' +
                '}';
    }
}
