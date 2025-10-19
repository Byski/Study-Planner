package com.arqon.study;

public class AssignmentCreationResult {
    private final boolean success;
    private final String errorMessage;
    private final Assignment assignment;

    private AssignmentCreationResult(boolean success, String errorMessage, Assignment assignment) {
        this.success = success;
        this.errorMessage = errorMessage;
        this.assignment = assignment;
    }

    public static AssignmentCreationResult success(Assignment assignment) {
        return new AssignmentCreationResult(true, null, assignment);
    }

    public static AssignmentCreationResult failure(String errorMessage) {
        return new AssignmentCreationResult(false, errorMessage, null);
    }

    public boolean isSuccess() {
        return success;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public Assignment getAssignment() {
        return assignment;
    }
}
