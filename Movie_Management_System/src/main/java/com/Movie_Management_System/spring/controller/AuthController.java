package com.Movie_Management_System.spring.controller;

import com.Movie_Management_System.spring.entities.Role;
import com.Movie_Management_System.spring.entities.User;
import com.Movie_Management_System.spring.payload.request.LoginRequest;
import com.Movie_Management_System.spring.payload.request.RegisterRequest;
import com.Movie_Management_System.spring.payload.response.JwtResponse;
import com.Movie_Management_System.spring.security.jwt.JwtUtils;
import com.Movie_Management_System.spring.payload.response.MessageResponse;
import com.Movie_Management_System.spring.services.PasswordResetService;
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

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final PasswordResetService passwordResetService;
    
    @Autowired
    public AuthController(UserService userService, 
                         AuthenticationManager authenticationManager,
                         JwtUtils jwtUtils,
                         PasswordResetService passwordResetService) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.passwordResetService = passwordResetService;
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

            // Ban kontrolü
            User user = userService.findByEmail(loginRequest.getEmail());
            if (user.isBanned()) {
                return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("Error: This account has been banned. Reason: " + user.getBanReason()));
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

    @GetMapping("/check-token")
    public ResponseEntity<?> checkToken() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && !authentication.getName().equals("anonymousUser")) {
                return ResponseEntity.ok(Map.of("valid", true));
            }
            return ResponseEntity.ok(Map.of("valid", false));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("valid", false));
        }
    }

    @PostMapping("/forgot-password/request")
    public ResponseEntity<?> requestPasswordReset(@RequestParam String email) {
        try {
            if (!userService.existsByEmail(email)) {
                return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("Error: User not found with email: " + email));
            }

            passwordResetService.sendResetCode(email);
            return ResponseEntity.ok(new MessageResponse("Reset code has been sent to your email"));
        } catch (Exception e) {
            System.err.println("Error in password reset request: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageResponse("Error: Failed to send reset code. Please try again later."));
        }
    }

    @PostMapping("/forgot-password/verify")
    public ResponseEntity<?> verifyResetCode(@RequestParam String email, @RequestParam String code) {
        try {
            if (!userService.existsByEmail(email)) {
                return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("Error: User not found with email: " + email));
            }

            if (!passwordResetService.validateResetCode(email, code)) {
                return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Error: Invalid or expired reset code"));
            }

            return ResponseEntity.ok(new MessageResponse("Reset code is valid"));
        } catch (Exception e) {
            System.err.println("Error in verify reset code: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageResponse("Error: Failed to verify reset code. Please try again later."));
        }
    }

    @PostMapping("/forgot-password/reset")
    public ResponseEntity<?> resetPassword(@RequestParam String email, @RequestParam String code, @RequestParam String newPassword) {
        try {
            if (!userService.existsByEmail(email)) {
                return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("Error: User not found with email: " + email));
            }

            if (!passwordResetService.validateResetCode(email, code)) {
                return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Error: Invalid or expired reset code"));
            }

            User user = userService.findByEmail(email);
            if (user == null) {
                return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("Error: User not found"));
            }

            user.setPassword(newPassword);
            userService.save(user);
            passwordResetService.removeResetCode(email);
            
            return ResponseEntity.ok(new MessageResponse("Password has been reset successfully"));
        } catch (Exception e) {
            System.err.println("Error in reset password: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageResponse("Error: Failed to reset password. Please try again later."));
        }
    }

    @GetMapping("/check-ban")
    public ResponseEntity<?> checkBanStatus(@RequestParam String email) {
        try {
            if (!userService.existsByEmail(email)) {
                return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("Error: User not found with email: " + email));
            }

            User user = userService.findByEmail(email);
            if (user.isBanned()) {
                return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("Error: This account has been banned. Reason: " + user.getBanReason()));
            }

            return ResponseEntity.ok(new MessageResponse("User is not banned"));
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageResponse("Error checking ban status: " + e.getMessage()));
        }
    }
} 