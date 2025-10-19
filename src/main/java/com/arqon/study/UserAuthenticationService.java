package com.arqon.study;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Service for handling user authentication
 */
public class UserAuthenticationService {
    private UserRepository userRepository;
    private SessionManager sessionManager;
    
    public UserAuthenticationService(UserRepository userRepository, SessionManager sessionManager) {
        this.userRepository = userRepository;
        this.sessionManager = sessionManager;
    }
    
    public UserRegistrationResult registerUser(String email, String password) {
        // Check if user already exists
        if (userRepository.existsByEmail(email)) {
            return new UserRegistrationResult(false, "Email already exists", null);
        }
        
        // Create new user
        String userId = UUID.randomUUID().toString();
        String hashedPassword = hashPassword(password);
        User user = new User(userId, email, hashedPassword);
        
        // Save user
        userRepository.save(user);
        
        return new UserRegistrationResult(true, null, user);
    }
    
    public LoginResult loginUser(String email, String password) {
        // Find user by email
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return new LoginResult(false, "Invalid credentials", null);
        }
        
        // Verify password
        String hashedPassword = hashPassword(password);
        if (!user.getPassword().equals(hashedPassword)) {
            return new LoginResult(false, "Invalid credentials", null);
        }
        
        // Create session
        Session session = sessionManager.createSession(user.getId());
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);
        
        return new LoginResult(true, null, session);
    }
    
    public LogoutResult logoutUser(String sessionId) {
        if (!sessionManager.isValidSession(sessionId)) {
            return new LogoutResult(false, "Invalid session");
        }
        
        sessionManager.invalidateSession(sessionId);
        return new LogoutResult(true, null);
    }
    
    public DashboardAccessResult accessDashboard(String sessionId) {
        if (!sessionManager.isValidSession(sessionId)) {
            return new DashboardAccessResult(false, "Invalid session", null);
        }
        
        Session session = sessionManager.getSession(sessionId).get();
        User user = userRepository.findById(session.getUserId()).get();
        
        Dashboard dashboard = new Dashboard(user.getEmail(), "Welcome to ARQON Study Dashboard");
        return new DashboardAccessResult(true, null, dashboard);
    }
    
    private String hashPassword(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(password.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Password hashing failed", e);
        }
    }
}
