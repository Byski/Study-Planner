package com.arqon.study;

/**
 * Dashboard entity representing user dashboard
 */
public class Dashboard {
    private String userEmail;
    private String welcomeMessage;
    
    public Dashboard(String userEmail, String welcomeMessage) {
        this.userEmail = userEmail;
        this.welcomeMessage = welcomeMessage;
    }
    
    public String getUserEmail() { return userEmail; }
    public String getWelcomeMessage() { return welcomeMessage; }
}
