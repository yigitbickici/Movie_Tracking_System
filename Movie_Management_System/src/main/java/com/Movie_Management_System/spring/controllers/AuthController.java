package com.Movie_Management_System.spring.controllers;

import com.Movie_Management_System.spring.entities.Role;
import com.Movie_Management_System.spring.entities.User;
import com.Movie_Management_System.spring.payload.request.RegisterRequest;
import com.Movie_Management_System.spring.payload.response.MessageResponse;
import com.Movie_Management_System.spring.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    private final UserService userService;
    
    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            System.out.println("Received registration request: " + registerRequest.toString());
            
            // Email kontrolü
            if (userService.existsByEmail(registerRequest.getEmail())) {
                return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
            }
            
            // Username kontrolü
            if (userService.existsByUsername(registerRequest.getUsername())) {
                return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
            }
            
            // Yeni kullanıcı oluştur
            User user = new User();
            user.setUsername(registerRequest.getUsername());
            user.setEmail(registerRequest.getEmail());
            user.setPassword(registerRequest.getPassword());
            user.setRole(Role.CUSTOMER); // Varsayılan rol
            
            userService.save(user);
            
            return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
        } catch (Exception e) {
            System.err.println("Error in registration: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity
                .internalServerError()
                .body(new MessageResponse("Error: Registration failed!"));
        }
    }
} 