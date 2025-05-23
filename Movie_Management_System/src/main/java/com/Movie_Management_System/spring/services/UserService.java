package com.Movie_Management_System.spring.services;

import com.Movie_Management_System.spring.entities.User;
import com.Movie_Management_System.spring.entities.Role;
import com.Movie_Management_System.spring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AzureBlobService azureBlobService;
    
    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, AzureBlobService azureBlobService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.azureBlobService = azureBlobService;
    }
    
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
    
    public User save(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
    
    public User findByUsername(String username) {
        logger.info("Finding user by username: {}", username);
        return userRepository.findByUsername(username)
                .orElse(null);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElse(null);
    }

    public User getUserByUsername(String username) {
        logger.info("Fetching user with username: {}", username);
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            return user.get();
        }
        logger.error("User not found with username: {}", username);
        throw new RuntimeException("User not found");
    }

    public User saveUser(User user) {
        logger.info("Saving user: {}", user.getUsername());
        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }

    public List<User> searchUsers(String query, String currentUsername) {
        logger.info("Searching users with query: {}", query);
        return userRepository.findByUsernameContainingIgnoreCaseAndRoleEqualsAndUsernameNot(query, Role.CUSTOMER, currentUsername);
    }

    public void followUser(User currentUser, User targetUser) {
        logger.info("Following user: {} -> {}", currentUser.getUsername(), targetUser.getUsername());
        if (!currentUser.getFollowing().contains(targetUser)) {
            currentUser.followUser(targetUser);
            userRepository.save(currentUser);
            userRepository.save(targetUser);
        }
    }

    public void unfollowUser(User currentUser, User targetUser) {
        logger.info("Unfollowing user: {} -> {}", currentUser.getUsername(), targetUser.getUsername());
        if (currentUser.getFollowing().contains(targetUser)) {
            currentUser.unfollowUser(targetUser);
            userRepository.save(currentUser);
            userRepository.save(targetUser);
        }
    }

    public void updateUserAvatar(String username, String avatarUrl) {
        User user = findByUsername(username);
        if (user != null) {
            // Delete old avatar from Azure if exists
            if (user.getAvatar() != null && !user.getAvatar().isEmpty()) {
                azureBlobService.deleteFile(user.getAvatar());
            }
            user.setAvatar(avatarUrl);
            userRepository.save(user);
        }
    }
}