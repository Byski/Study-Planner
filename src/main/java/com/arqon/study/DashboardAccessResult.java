package com.arqon.study;

/**
 * Result of dashboard access operation
 */
public class DashboardAccessResult {
    private boolean success;
    private String errorMessage;
    private Dashboard dashboard;
    
    public DashboardAccessResult(boolean success, String errorMessage, Dashboard dashboard) {
        this.success = success;
        this.errorMessage = errorMessage;
        this.dashboard = dashboard;
    }
    
    public boolean isSuccess() { return success; }
    public String getErrorMessage() { return errorMessage; }
    public Dashboard getDashboard() { return dashboard; }
}
