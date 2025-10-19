package com.arqon.study;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Manages user sessions
 */
public class SessionManager {
    private Map<String, Session> sessions = new HashMap<>();
    
    public Session createSession(String userId) {
        Session session = new Session(userId);
        sessions.put(session.getSessionId(), session);
        return session;
    }
    
    public Optional<Session> getSession(String sessionId) {
        return Optional.ofNullable(sessions.get(sessionId));
    }
    
    public boolean isValidSession(String sessionId) {
        Optional<Session> session = getSession(sessionId);
        return session.isPresent() && session.get().isActive() && !session.get().isExpired();
    }
    
    public void invalidateSession(String sessionId) {
        sessions.remove(sessionId);
    }
}
