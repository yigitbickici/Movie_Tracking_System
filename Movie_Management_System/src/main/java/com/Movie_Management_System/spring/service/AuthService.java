package com.Movie_Management_System.spring.service;

import com.Movie_Management_System.spring.dto.LoginRequest;
import com.Movie_Management_System.spring.dto.LoginResponse;
import com.Movie_Management_System.spring.entities.User;
import com.Movie_Management_System.spring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse login(LoginRequest loginRequest) {
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());
        
        if (userOptional.isEmpty()) {
            return new LoginResponse(false, "User not found with this email");
        }
        
        User user = userOptional.get();
        
        if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return new LoginResponse(
                true, 
                "Login successful", 
                user.getId(), 
                user.getUsername(), 
                user.getRole()
            );
        } else {
            return new LoginResponse(false, "Invalid password");
        }
    }
} 