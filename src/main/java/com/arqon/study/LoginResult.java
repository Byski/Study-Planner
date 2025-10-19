package com.arqon.study;

/**
 * Result of login operation
 */
public class LoginResult {
    private boolean success;
    private String errorMessage;
    private Session session;
    
    public LoginResult(boolean success, String errorMessage, Session session) {
        this.success = success;
        this.errorMessage = errorMessage;
        this.session = session;
    }
    
    public boolean isSuccess() { return success; }
    public String getErrorMessage() { return errorMessage; }
    public Session getSession() { return session; }
}
