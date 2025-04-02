package com.Movie_Management_System.spring.controller;

import com.Movie_Management_System.spring.entities.Comment;
import com.Movie_Management_System.spring.entities.Posts;
import com.Movie_Management_System.spring.entities.User;
import com.Movie_Management_System.spring.exceptions.ResourceNotFoundException;
import com.Movie_Management_System.spring.services.CommentService;
import com.Movie_Management_System.spring.services.PostService;
import com.Movie_Management_System.spring.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostController {

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
            @RequestBody Map<String, String> commentRequest) {
        try {
            String content = commentRequest.get("content");
            if (content == null || content.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            Posts post = postService.getPostById(postId)
                    .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

            User currentUser = userService.getCurrentUser();
            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Comment comment = new Comment();
            comment.setContent(content);
            comment.setUser(currentUser);
            comment.setPost(post);
            comment.setSpoiler(false);

            Comment savedComment = commentService.saveComment(comment);
            
            // Update post comment count
            post.setCommentNum(post.getCommentNum() + 1);
            postService.savePost(post);

            return ResponseEntity.ok(savedComment);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
} 