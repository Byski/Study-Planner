package com.arqon.study;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Repository for managing user data
 */
public class UserRepository {
    private Map<String, User> usersByEmail = new HashMap<>();
    private Map<String, User> usersById = new HashMap<>();
    
    public void save(User user) {
        usersByEmail.put(user.getEmail(), user);
        usersById.put(user.getId(), user);
    }
    
    public Optional<User> findByEmail(String email) {
        return Optional.ofNullable(usersByEmail.get(email));
    }
    
    public Optional<User> findById(String id) {
        return Optional.ofNullable(usersById.get(id));
    }
    
    public boolean existsByEmail(String email) {
        return usersByEmail.containsKey(email);
    }
}
