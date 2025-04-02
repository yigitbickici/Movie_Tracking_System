package com.Movie_Management_System.spring.controller;

import com.Movie_Management_System.spring.entities.Posts;
import com.Movie_Management_System.spring.entities.Movie;
import com.Movie_Management_System.spring.entities.User;
import com.Movie_Management_System.spring.entities.Comment;
import com.Movie_Management_System.spring.services.PostService;
import com.Movie_Management_System.spring.services.MovieService;
import com.Movie_Management_System.spring.services.UserService;
import com.Movie_Management_System.spring.payload.request.PostRequest;
import com.Movie_Management_System.spring.payload.request.CommentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class PostController {

    private static final Logger logger = LoggerFactory.getLogger(PostController.class);

    @Autowired
    private PostService postService;

    @Autowired
    private MovieService movieService;

    @Autowired
    private UserService userService;

    @GetMapping("/movie/{tmdbId}")
    public ResponseEntity<List<Posts>> getPostsByMovie(@PathVariable Long tmdbId) {
        logger.info("Fetching posts for movie with TMDB ID: {}", tmdbId);
        try {
            // First check if movie exists
            Movie movie = movieService.getMovieByTmdbId(tmdbId)
                    .orElseThrow(() -> new RuntimeException("Movie not found with TMDB ID: " + tmdbId));
            logger.info("Found movie: {} (ID: {})", movie.getTitle(), movie.getId());
            
            // Get posts for the movie
            List<Posts> posts = postService.getPostsByMovie(movie);
            logger.info("Found {} posts for movie with TMDB ID: {}", posts.size(), tmdbId);
            
            // Log each post for debugging
            posts.forEach(post -> {
                logger.info("Post ID: {}, User: {}, Content: {}, Comments: {}", 
                    post.getId(), 
                    post.getUser().getUsername(),
                    post.getContent().substring(0, Math.min(50, post.getContent().length())),
                    post.getComments().size());
            });

            return ResponseEntity.ok(posts);
        } catch (RuntimeException e) {
            logger.error("Error fetching posts for movie with TMDB ID {}: {}", tmdbId, e.getMessage());
            logger.error("Stack trace:", e);
            if (e.getMessage().contains("Movie not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createPost(@RequestBody PostRequest request) {
        logger.info("Creating new post for movie with TMDB ID: {}", request.getMovieId());
        logger.info("Post content: {}", request.getContent());
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        logger.info("Authentication object: {}", auth);
        
        if (auth == null || !auth.isAuthenticated()) {
            logger.error("User not authenticated. Auth object: {}", auth);
            return ResponseEntity.status(401).body("User not authenticated");
        }

        String username = auth.getName();
        logger.info("Authenticated username: {}", username);
        
        User user = userService.getUserByUsername(username);
        if (user == null) {
            logger.error("User not found: {}", username);
            return ResponseEntity.status(401).body("User not found");
        }

        try {
            Movie movie = movieService.getMovieByTmdbId(request.getMovieId())
                    .orElseThrow(() -> new RuntimeException("Movie not found with TMDB ID: " + request.getMovieId()));
            
            if (request.getContent() == null || request.getContent().trim().isEmpty()) {
                logger.error("Post content is empty");
                return ResponseEntity.badRequest().body("Post content cannot be empty");
            }

            Posts post = postService.createPost(request.getContent(), user.getId(), movie);
            logger.info("Post created successfully with ID: {}", post.getId());
            return ResponseEntity.ok(post);
        } catch (RuntimeException e) {
            logger.error("Error creating post: {}", e.getMessage());
            if (e.getMessage().contains("Movie not found")) {
                return ResponseEntity.status(404).body(e.getMessage());
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error creating post: {}", e.getMessage());
            e.printStackTrace(); // Stack trace'i logla
            return ResponseEntity.internalServerError().body("An unexpected error occurred");
        }
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<Void> likePost(@PathVariable Long postId) {
        logger.info("Liking post ID: {}", postId);
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            logger.error("User not authenticated");
            return ResponseEntity.status(401).build();
        }

        String username = auth.getName();
        User user = userService.getUserByUsername(username);
        if (user == null) {
            logger.error("User not found: {}", username);
            return ResponseEntity.status(401).build();
        }

        postService.likePost(postId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<Comment> createComment(@PathVariable Long postId, @RequestBody CommentRequest request) {
        logger.info("Creating comment for post ID: {}", postId);
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            logger.error("User not authenticated");
            return ResponseEntity.status(401).build();
        }

        String username = auth.getName();
        User user = userService.getUserByUsername(username);
        if (user == null) {
            logger.error("User not found: {}", username);
            return ResponseEntity.status(401).build();
        }

        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            logger.error("Comment content is empty");
            return ResponseEntity.status(400).build();
        }

        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setUser(user);
        comment.setRating(0.0);
        
        Comment createdComment = postService.createComment(postId, comment);
        
        logger.info("Comment created successfully with ID: {}", createdComment.getId());
        return ResponseEntity.ok(createdComment);
    }
} 