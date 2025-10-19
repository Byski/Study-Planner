package com.arqon.study;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

/**
 * TDD Test Suite for User Authentication Features
 * 
 * User Stories:
 * 1. As a user, I want to log out so that I can keep my account secure on shared devices
 * 2. As a user, I want to log in so that I can access my dashboard
 * 3. As a visitor, I want to register with email & password so that my data is private
 * 
 * Pair Programming Exercise: TDD Cycle Implementation
 */
public class UserAuthenticationTest {
    
    private UserAuthenticationService authService;
    private UserRepository userRepository;
    private SessionManager sessionManager;
    
    @BeforeEach
    void setUp() {
        userRepository = new UserRepository();
        sessionManager = new SessionManager();
        authService = new UserAuthenticationService(userRepository, sessionManager);
    }
    
    // ========================================
    // RED PHASE: Failing Tests
    // ========================================
    
    @Test
    @DisplayName("RED: User should be able to register with email and password")
    void testUserRegistration() {
        // Given
        String email = "user@example.com";
        String password = "securePassword123";
        
        // When
        UserRegistrationResult result = authService.registerUser(email, password);
        
        // Then
        assertTrue(result.isSuccess());
        assertNotNull(result.getUser());
        assertEquals(email, result.getUser().getEmail());
        assertNotEquals(password, result.getUser().getPassword()); // Password should be hashed
    }
    
    @Test
    @DisplayName("RED: User should be able to login with valid credentials")
    void testUserLogin() {
        // Given
        String email = "user@example.com";
        String password = "securePassword123";
        authService.registerUser(email, password);
        
        // When
        LoginResult result = authService.loginUser(email, password);
        
        // Then
        assertTrue(result.isSuccess());
        assertNotNull(result.getSession());
        assertTrue(sessionManager.isValidSession(result.getSession().getSessionId()));
    }
    
    @Test
    @DisplayName("RED: User should be able to logout and invalidate session")
    void testUserLogout() {
        // Given
        String email = "user@example.com";
        String password = "securePassword123";
        authService.registerUser(email, password);
        LoginResult loginResult = authService.loginUser(email, password);
        String sessionId = loginResult.getSession().getSessionId();
        
        // When
        LogoutResult result = authService.logoutUser(sessionId);
        
        // Then
        assertTrue(result.isSuccess());
        assertFalse(sessionManager.isValidSession(sessionId));
    }
    
    @Test
    @DisplayName("RED: Login should fail with invalid credentials")
    void testLoginWithInvalidCredentials() {
        // Given
        String email = "user@example.com";
        String password = "securePassword123";
        authService.registerUser(email, password);
        
        // When
        LoginResult result = authService.loginUser(email, "wrongPassword");
        
        // Then
        assertFalse(result.isSuccess());
        assertEquals("Invalid credentials", result.getErrorMessage());
    }
    
    @Test
    @DisplayName("RED: Registration should fail with duplicate email")
    void testRegistrationWithDuplicateEmail() {
        // Given
        String email = "user@example.com";
        String password = "securePassword123";
        authService.registerUser(email, password);
        
        // When
        UserRegistrationResult result = authService.registerUser(email, "anotherPassword");
        
        // Then
        assertFalse(result.isSuccess());
        assertEquals("Email already exists", result.getErrorMessage());
    }
    
    @Test
    @DisplayName("RED: Session should expire after logout")
    void testSessionExpirationAfterLogout() {
        // Given
        String email = "user@example.com";
        String password = "securePassword123";
        authService.registerUser(email, password);
        LoginResult loginResult = authService.loginUser(email, password);
        String sessionId = loginResult.getSession().getSessionId();
        
        // When
        authService.logoutUser(sessionId);
        
        // Then
        assertFalse(sessionManager.isValidSession(sessionId));
        assertNull(sessionManager.getSession(sessionId));
    }
    
    @Test
    @DisplayName("RED: Password should be hashed for security")
    void testPasswordHashing() {
        // Given
        String email = "user@example.com";
        String password = "securePassword123";
        
        // When
        UserRegistrationResult result = authService.registerUser(email, password);
        
        // Then
        assertTrue(result.isSuccess());
        String storedPassword = result.getUser().getPassword();
        assertNotEquals(password, storedPassword);
        assertTrue(storedPassword.length() > 32); // Hash should be longer than original
    }
    
    @Test
    @DisplayName("RED: User should be able to access dashboard when logged in")
    void testDashboardAccess() {
        // Given
        String email = "user@example.com";
        String password = "securePassword123";
        authService.registerUser(email, password);
        LoginResult loginResult = authService.loginUser(email, password);
        String sessionId = loginResult.getSession().getSessionId();
        
        // When
        DashboardAccessResult result = authService.accessDashboard(sessionId);
        
        // Then
        assertTrue(result.isSuccess());
        assertNotNull(result.getDashboard());
    }
    
    @Test
    @DisplayName("RED: Dashboard access should fail when not logged in")
    void testDashboardAccessWithoutLogin() {
        // Given
        String invalidSessionId = "invalid-session-id";
        
        // When
        DashboardAccessResult result = authService.accessDashboard(invalidSessionId);
        
        // Then
        assertFalse(result.isSuccess());
        assertEquals("Invalid session", result.getErrorMessage());
    }
}
