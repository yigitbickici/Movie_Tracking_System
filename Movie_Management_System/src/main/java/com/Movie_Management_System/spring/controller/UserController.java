package com.Movie_Management_System.spring.controller;

import com.Movie_Management_System.spring.entities.Comment;
import com.Movie_Management_System.spring.entities.Movie;
import com.Movie_Management_System.spring.entities.User;
import com.Movie_Management_System.spring.services.MovieService;
import com.Movie_Management_System.spring.services.UserService;
import com.Movie_Management_System.spring.payload.response.MessageResponse;
import com.Movie_Management_System.spring.services.AzureBlobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://moviary.com")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private MovieService movieService;

    @Autowired
    private AzureBlobService azureBlobService;

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
    public ResponseEntity<?> uploadProfilePhoto(@RequestParam("file") MultipartFile file) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                return ResponseEntity.status(401).body("User not authenticated");
            }

            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body("Only image files are allowed");
            }

            // Upload to Azure Blob Storage
            String blobUrl = azureBlobService.uploadFile(file, "avatars");

            // Update user's avatar URL in database
            userService.updateUserAvatar(auth.getName(), blobUrl);

            return ResponseEntity.ok(blobUrl);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to upload profile photo");
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
                logger.error("User not found: {}", username);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            Map<String, Object> response = new HashMap<>();
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("fullName", user.getFullName());
            response.put("avatar", user.getAvatar());
            response.put("bio", user.getBio());

            try {
                // Calculate movie time stats
                Map<String, Integer> movieTimeStats = movieService.calculateMovieTimeStats(user.getId());
                response.put("stats", Map.of(
                    "following", user.getFollowingCount(),
                    "followers", user.getFollowersCount(),
                    "comments", user.getCommentsCount(),
                    "moviesWatched", user.getMoviesWatchedCount(),
                    "movieTime", movieTimeStats
                ));
            } catch (Exception e) {
                logger.error("Error calculating movie stats for user {}: {}", username, e.getMessage());
                response.put("stats", Map.of(
                    "following", user.getFollowingCount(),
                    "followers", user.getFollowersCount(),
                    "comments", user.getCommentsCount(),
                    "moviesWatched", user.getMoviesWatchedCount(),
                    "movieTime", Map.of()
                ));
            }
            
            try {
                // Map comments to DTOs including movie info
                List<Map<String, Object>> commentsDTO = user.getComments().stream()
                    .map(comment -> {
                        Map<String, Object> commentMap = new HashMap<>();
                        commentMap.put("id", comment.getId());
                        commentMap.put("comment", comment.getContent());
                        commentMap.put("rating", comment.getRating());
                        commentMap.put("date", comment.getCreatedAt().toString());
                        
                        if (comment.getPost() != null && comment.getPost().getMovie() != null) {
                            Movie movie = comment.getPost().getMovie();
                            commentMap.put("movieId", movie.getTmdbId());
                            commentMap.put("movieTitle", movie.getTitle());
                            commentMap.put("moviePoster", movie.getPosterPath());
                        }
                        return commentMap;
                    })
                    .collect(Collectors.toList());
                response.put("comments", commentsDTO);
            } catch (Exception e) {
                logger.error("Error mapping comments for user {}: {}", username, e.getMessage());
                response.put("comments", List.of());
            }

            try {
                response.put("favorites", user.getFavoriteMovies().stream()
                    .map(movie -> {
                        Map<String, Object> movieMap = new HashMap<>();
                        movieMap.put("id", movie.getId());
                        movieMap.put("tmdbId", movie.getTmdbId());
                        movieMap.put("title", movie.getTitle());
                        movieMap.put("posterPath", movie.getPosterPath());
                        movieMap.put("releaseDate", movie.getReleaseDate() != null ? movie.getReleaseDate() : "");
                        return movieMap;
                    })
                    .collect(Collectors.toList()));
                    
                response.put("watched", user.getWatchedMovies().stream()
                    .map(movie -> {
                        Map<String, Object> movieMap = new HashMap<>();
                        movieMap.put("id", movie.getId());
                        movieMap.put("tmdbId", movie.getTmdbId());
                        movieMap.put("title", movie.getTitle());
                        movieMap.put("posterPath", movie.getPosterPath());
                        movieMap.put("releaseDate", movie.getReleaseDate() != null ? movie.getReleaseDate() : "");
                        return movieMap;
                    })
                    .collect(Collectors.toList()));
                    
                response.put("watchlist", user.getWatchlist().stream()
                    .map(movie -> {
                        Map<String, Object> movieMap = new HashMap<>();
                        movieMap.put("id", movie.getId());
                        movieMap.put("tmdbId", movie.getTmdbId());
                        movieMap.put("title", movie.getTitle());
                        movieMap.put("posterPath", movie.getPosterPath());
                        movieMap.put("releaseDate", movie.getReleaseDate() != null ? movie.getReleaseDate() : "");
                        return movieMap;
                    })
                    .collect(Collectors.toList()));
            } catch (Exception e) {
                logger.error("Error mapping movie lists for user {}: {}", username, e.getMessage());
                response.put("favorites", List.of());
                response.put("watched", List.of());
                response.put("watchlist", List.of());
            }

            try {
                // Simplified followers/following mapping to prevent recursion
                response.put("followers", user.getFollowers().stream()
                    .map(follower -> {
                        Map<String, Object> followerMap = new HashMap<>();
                        followerMap.put("id", follower.getId());
                        followerMap.put("username", follower.getUsername());
                        followerMap.put("avatar", follower.getAvatar());
                        return followerMap;
                    })
                    .collect(Collectors.toList()));

                response.put("following", user.getFollowing().stream()
                    .map(following -> {
                        Map<String, Object> followingMap = new HashMap<>();
                        followingMap.put("id", following.getId());
                        followingMap.put("username", following.getUsername());
                        followingMap.put("avatar", following.getAvatar());
                        return followingMap;
                    })
                    .collect(Collectors.toList()));
            } catch (Exception e) {
                logger.error("Error mapping followers/following for user {}: {}", username, e.getMessage());
                response.put("followers", List.of());
                response.put("following", List.of());
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching profile data for {}: {}", username, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error fetching profile data: " + e.getMessage()));
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
            
            if (currentUser == null) {
                logger.error("Current user not found: {}", currentUsername);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Current user not found"));
            }
            
            if (targetUser == null) {
                logger.error("Target user not found: {}", username);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Target user not found"));
            }

            if (currentUser.getFollowing().contains(targetUser)) {
                logger.warn("User {} is already following {}", currentUsername, username);
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Already following this user"));
            }

            userService.followUser(currentUser, targetUser);
            logger.info("User {} successfully followed {}", currentUsername, username);
            
            return ResponseEntity.ok(Map.of(
                "message", "Successfully followed user",
                "isFollowing", true
            ));
        } catch (Exception e) {
            logger.error("Error following user: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error following user: " + e.getMessage()));
        }
    }

    @PostMapping("/{username}/unfollow")
    public ResponseEntity<?> unfollowUser(@PathVariable String username) {
        try {
            String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            User currentUser = userService.findByUsername(currentUsername);
            User targetUser = userService.findByUsername(username);
            
            if (currentUser == null) {
                logger.error("Current user not found: {}", currentUsername);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Current user not found"));
            }
            
            if (targetUser == null) {
                logger.error("Target user not found: {}", username);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Target user not found"));
            }

            if (!currentUser.getFollowing().contains(targetUser)) {
                logger.warn("User {} is not following {}", currentUsername, username);
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Not following this user"));
            }

            userService.unfollowUser(currentUser, targetUser);
            logger.info("User {} successfully unfollowed {}", currentUsername, username);
            
            return ResponseEntity.ok(Map.of(
                "message", "Successfully unfollowed user",
                "isFollowing", false
            ));
        } catch (Exception e) {
            logger.error("Error unfollowing user: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error unfollowing user: " + e.getMessage()));
        }
    }
} 