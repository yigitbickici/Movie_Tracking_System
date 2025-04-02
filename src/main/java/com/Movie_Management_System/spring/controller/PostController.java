package com.Movie_Management_System.spring.controller;

import com.Movie_Management_System.spring.entities.Comment;
import com.Movie_Management_System.spring.entities.Posts;
import com.Movie_Management_System.spring.entities.User;
import com.Movie_Management_System.spring.exceptions.ResourceNotFoundException;
import com.Movie_Management_System.spring.services.CommentService;
import com.Movie_Management_System.spring.services.PostService;
import com.Movie_Management_System.spring.services.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {
    private static final Logger logger = LoggerFactory.getLogger(PostController.class);

    @Autowired
    private PostService postService;

    @Autowired
    private UserService userService;

    @Autowired
    private CommentService commentService;

    @PostMapping("/{postId}/comments")
    @PreAuthorize("isAuthenticated()")
    @Transactional
    public ResponseEntity<Comment> createComment(
            @PathVariable Long postId,
            @RequestBody Comment commentRequest) {
        try {
            logger.info("Creating comment for post ID: {}", postId);
            logger.debug("Comment request: {}", commentRequest);

            if (commentRequest.getContent() == null || commentRequest.getContent().trim().isEmpty()) {
                logger.warn("Empty comment content received");
                return ResponseEntity.badRequest().build();
            }

            Posts post = postService.getPostById(postId)
                    .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));
            logger.debug("Found post: {}", post);

            User currentUser = userService.getCurrentUser();
            if (currentUser == null) {
                logger.error("No authenticated user found");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            logger.debug("Current user: {}", currentUser.getUsername());

            Comment comment = new Comment();
            comment.setContent(commentRequest.getContent());
            comment.setUser(currentUser);
            comment.setPost(post);
            comment.setSpoiler(commentRequest.isSpoiler());

            Comment savedComment = commentService.saveComment(comment);
            logger.info("Comment saved successfully with ID: {}", savedComment.getId());
            
            // Update post comment count
            post.setCommentNum(post.getCommentNum() + 1);
            postService.savePost(post);
            logger.debug("Updated post comment count to: {}", post.getCommentNum());

            return ResponseEntity.ok(savedComment);
        } catch (ResourceNotFoundException e) {
            logger.error("Resource not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error creating comment: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
} 