package com.Movie_Management_System.spring.controller;

import com.Movie_Management_System.spring.payload.response.ProfileResponse;
import com.Movie_Management_System.spring.security.services.UserDetailsImpl;
import com.Movie_Management_System.spring.services.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://moviary.com")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        ProfileResponse profile = profileService.getUserProfile(userDetails.getId());
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/{username}")
    public ResponseEntity<?> getUserProfile(@PathVariable String username) {
        ProfileResponse profile = profileService.getUserProfileByUsername(username);
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/follow/{userId}")
    public ResponseEntity<?> followUser(@PathVariable Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        profileService.followUser(userDetails.getId(), userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/unfollow/{userId}")
    public ResponseEntity<?> unfollowUser(@PathVariable Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        profileService.unfollowUser(userDetails.getId(), userId);
        return ResponseEntity.ok().build();
    }
} 