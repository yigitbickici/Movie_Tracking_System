package com.Movie_Management_System.spring.controller;

import com.Movie_Management_System.spring.entities.Role;
import com.Movie_Management_System.spring.entities.User;
import com.Movie_Management_System.spring.payload.request.LoginRequest;
import com.Movie_Management_System.spring.payload.request.RegisterRequest;
import com.Movie_Management_System.spring.payload.response.JwtResponse;
import com.Movie_Management_System.spring.security.jwt.JwtUtils;
import com.Movie_Management_System.spring.payload.response.MessageResponse;
import com.Movie_Management_System.spring.services.UserService;
import com.Movie_Management_System.spring.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.AuthenticationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    
    @Autowired
    public AuthController(UserService userService, 
                         AuthenticationManager authenticationManager,
                         JwtUtils jwtUtils) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
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

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("Login attempt for user: " + loginRequest.getEmail());
            
            // Önce kullanıcının var olup olmadığını kontrol et
            if (!userService.existsByEmail(loginRequest.getEmail())) {
                return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Error: User not found with email: " + loginRequest.getEmail()));
            }

            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            
            String jwt = jwtUtils.generateJwtToken(authentication);
            
            return ResponseEntity.ok(new JwtResponse(
                jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                userDetails.getRole().toString()
            ));
        } catch (AuthenticationException e) {
            System.err.println("Authentication failed: " + e.getMessage());
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(new MessageResponse("Error: Invalid password for email: " + loginRequest.getEmail()));
        } catch (Exception e) {
            System.err.println("Unexpected error during login: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageResponse("Error: An unexpected error occurred during login"));
        }
    }
} 