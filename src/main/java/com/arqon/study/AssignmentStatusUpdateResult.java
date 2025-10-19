package com.arqon.study;

public class AssignmentStatusUpdateResult {
    private final boolean success;
    private final String message;
    private final String errorMessage;

    private AssignmentStatusUpdateResult(boolean success, String message, String errorMessage) {
        this.success = success;
        this.message = message;
        this.errorMessage = errorMessage;
    }

    public static AssignmentStatusUpdateResult success(String message) {
        return new AssignmentStatusUpdateResult(true, message, null);
    }

    public static AssignmentStatusUpdateResult failure(String errorMessage) {
        return new AssignmentStatusUpdateResult(false, null, errorMessage);
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
}
