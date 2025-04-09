package com.Movie_Management_System.spring.controller;

import com.Movie_Management_System.spring.entities.Comment;
import com.Movie_Management_System.spring.entities.Movie;
import com.Movie_Management_System.spring.entities.User;
import com.Movie_Management_System.spring.services.MovieService;
import com.Movie_Management_System.spring.services.UserService;
import com.Movie_Management_System.spring.payload.response.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private MovieService movieService;

    private final String uploadDir = "uploads/avatars";

    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(@RequestParam String query) {
        try {
            String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            List<User> users = userService.searchUsers(query, currentUsername);
            
            List<Map<String, Object>> userList = users.stream()
                .map(user -> {
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("id", user.getId());
                    userMap.put("username", user.getUsername());
                    userMap.put("avatar", user.getAvatar());
                    return userMap;
                })
                .collect(Collectors.toList());

            return ResponseEntity.ok(userList);
        } catch (Exception e) {
            logger.error("Error searching users: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error searching users"));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userService.findByUsername(username);
            
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            Map<String, Object> response = new HashMap<>();
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("fullName", user.getFullName());
            response.put("avatar", user.getAvatar());
            response.put("bio", user.getBio());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching profile data");
        }
    }

    @PostMapping("/profile/avatar")
    public ResponseEntity<?> uploadAvatar(@RequestParam("file") MultipartFile file) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userService.findByUsername(username);
            
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            // Check file extension
            String fileExtension = getFileExtension(file.getOriginalFilename());
            if (!isValidImageExtension(fileExtension)) {
                return ResponseEntity.badRequest().body("Invalid file format. Only jpg, jpeg, png, and gif files are allowed.");
            }

            // Create upload directory if it doesn't exist
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Generate unique filename
            String fileName = UUID.randomUUID().toString() + fileExtension;

            // Delete old avatar if exists
            if (user.getAvatar() != null && !user.getAvatar().isEmpty()) {
                try {
                    String oldAvatarPath = user.getAvatar();
                    // URL'den path kısmını ayıkla
                    if (oldAvatarPath.contains("/avatars/")) {
                        oldAvatarPath = oldAvatarPath.substring(oldAvatarPath.indexOf("/avatars/"));
                    }
                    oldAvatarPath = "uploads" + oldAvatarPath;
                    Files.deleteIfExists(Paths.get(oldAvatarPath));
                } catch (IOException e) {
                    // Continue with new file upload even if old file deletion fails
                    logger.error("Error deleting old avatar: " + e.getMessage());
                }
            }

            // Save file
            Files.copy(file.getInputStream(), Paths.get(uploadDir, fileName));

            // Update user avatar in database
            String avatarPath = "/avatars/" + fileName;
            user.setAvatar(avatarPath);
            userService.saveUser(user);

            return ResponseEntity.ok(avatarPath);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading avatar");
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(@RequestBody Map<String, Object> updates) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userService.findByUsername(username);
            
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            if (updates.containsKey("fullName")) {
                user.setFullName((String) updates.get("fullName"));
            }
            if (updates.containsKey("email")) {
                user.setEmail((String) updates.get("email"));
            }
            if (updates.containsKey("avatar")) {
                user.setAvatar((String) updates.get("avatar"));
            }
            if (updates.containsKey("bio")) {
                user.setBio((String) updates.get("bio"));
            }

            userService.saveUser(user);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Profile updated successfully");
            response.put("user", user);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating profile");
        }
    }

    @GetMapping("/{username}")
    public ResponseEntity<?> getUserProfileByUsername(@PathVariable String username) {
        try {
            User user = userService.findByUsername(username);
            
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            Map<String, Object> response = new HashMap<>();
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("fullName", user.getFullName());
            response.put("avatar", user.getAvatar());
            response.put("bio", user.getBio());

            // Calculate movie time stats
            Map<String, Integer> movieTimeStats = movieService.calculateMovieTimeStats(user.getId());

            response.put("stats", Map.of(
                "following", user.getFollowingCount(),
                "followers", user.getFollowersCount(),
                "comments", user.getCommentsCount(),
                "moviesWatched", user.getMoviesWatchedCount(),
                "movieTime", movieTimeStats // Add movie time stats
            ));
            
            // Map comments to DTOs including movie info
            List<Map<String, Object>> commentsDTO = user.getComments().stream()
                .map(comment -> {
                    Map<String, Object> commentMap = new HashMap<>();
                    commentMap.put("id", comment.getId());
                    commentMap.put("comment", comment.getContent()); // Assuming comment text is in 'content'
                    commentMap.put("rating", comment.getRating());
                    commentMap.put("date", comment.getCreatedAt().toString()); // Format date as needed
                    
                    // Get movie info from the comment's post
                    if (comment.getPost() != null && comment.getPost().getMovie() != null) {
                        Movie movie = comment.getPost().getMovie();
                        commentMap.put("movieId", movie.getTmdbId()); // Use TMDB ID
                        commentMap.put("movieTitle", movie.getTitle());
                        commentMap.put("moviePoster", movie.getPosterPath());
                    }
                    return commentMap;
                })
                .collect(Collectors.toList());
            
            response.put("favorites", user.getFavoriteMovies());
            response.put("watched", user.getWatchedMovies());
            response.put("watchlist", user.getWatchlist());
            response.put("comments", commentsDTO); // Use the mapped comments
            response.put("followers", user.getFollowers().stream()
                .map(follower -> Map.of(
                    "id", follower.getId(),
                    "username", follower.getUsername(),
                    "avatar", follower.getAvatar()
                ))
                .collect(Collectors.toList()));
            response.put("following", user.getFollowing().stream()
                .map(following -> Map.of(
                    "id", following.getId(),
                    "username", following.getUsername(),
                    "avatar", following.getAvatar()
                ))
                .collect(Collectors.toList()));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching profile data for {}: {}", username, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching profile data");
        }
    }

    @GetMapping("/{username}/follow-status")
    public ResponseEntity<?> getFollowStatus(@PathVariable String username) {
        try {
            String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            User currentUser = userService.findByUsername(currentUsername);
            User targetUser = userService.findByUsername(username);
            
            if (targetUser == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            boolean isFollowing = currentUser.getFollowing().contains(targetUser);
            return ResponseEntity.ok(Map.of("isFollowing", isFollowing));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error checking follow status");
        }
    }

    @PostMapping("/{username}/follow")
    public ResponseEntity<?> followUser(@PathVariable String username) {
        try {
            String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            User currentUser = userService.findByUsername(currentUsername);
            User targetUser = userService.findByUsername(username);
            
            if (targetUser == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            if (currentUser.getFollowing().contains(targetUser)) {
                return ResponseEntity.badRequest().body("Already following this user");
            }

            currentUser.followUser(targetUser);
            userService.saveUser(currentUser);
            userService.saveUser(targetUser);

            return ResponseEntity.ok(new MessageResponse("Successfully followed user"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error following user");
        }
    }

    @PostMapping("/{username}/unfollow")
    public ResponseEntity<?> unfollowUser(@PathVariable String username) {
        try {
            String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            User currentUser = userService.findByUsername(currentUsername);
            User targetUser = userService.findByUsername(username);
            
            if (targetUser == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            if (!currentUser.getFollowing().contains(targetUser)) {
                return ResponseEntity.badRequest().body("Not following this user");
            }

            currentUser.unfollowUser(targetUser);
            userService.saveUser(currentUser);
            userService.saveUser(targetUser);

            return ResponseEntity.ok(new MessageResponse("Successfully unfollowed user"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error unfollowing user");
        }
    }

    private String getFileExtension(String fileName) {
        if (fileName == null) return "";
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex == -1) return "";
        return fileName.substring(lastDotIndex).toLowerCase();
    }

    private boolean isValidImageExtension(String extension) {
        return extension.equals(".jpg") || 
               extension.equals(".jpeg") || 
               extension.equals(".png") || 
               extension.equals(".gif");
    }
} 