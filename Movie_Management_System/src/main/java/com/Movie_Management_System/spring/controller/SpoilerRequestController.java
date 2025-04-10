package com.Movie_Management_System.spring.controller;

import com.Movie_Management_System.spring.entities.*;
import com.Movie_Management_System.spring.repository.CommentRepository;
import com.Movie_Management_System.spring.repository.PostsRepository;
import com.Movie_Management_System.spring.repository.SpoilerRequestRepository;
import com.Movie_Management_System.spring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/spoiler-requests")
@CrossOrigin(origins = "http://localhost:3000")
public class SpoilerRequestController {

    @Autowired
    private SpoilerRequestRepository spoilerRequestRepository;

    @Autowired
    private PostsRepository postsRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/post/{postId}")
    public ResponseEntity<?> reportPostAsSpoiler(@PathVariable Long postId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

            Posts post = postsRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post bulunamadı"));

            SpoilerRequest request = new SpoilerRequest();
            request.setUser(user);
            request.setPost(post);
            request.setStatus("PENDING");
            request.setRequestedByUser(user);
            request.setType(SpoilerRequestType.POST);
            request.setCreatedAt(LocalDateTime.now());

            SpoilerRequest savedRequest = spoilerRequestRepository.save(request);
            post.setIsSpoiler(true);
            postsRepository.save(post);

            return ResponseEntity.ok(savedRequest);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/comment/{commentId}")
    public ResponseEntity<?> reportCommentAsSpoiler(@PathVariable Long commentId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

            Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Yorum bulunamadı"));

            SpoilerRequest request = new SpoilerRequest();
            request.setUser(user);
            request.setComment(comment);
            request.setStatus("PENDING");
            request.setRequestedByUser(user);
            request.setType(SpoilerRequestType.COMMENT);
            request.setCreatedAt(LocalDateTime.now());

            SpoilerRequest savedRequest = spoilerRequestRepository.save(request);
            comment.setIsSpoiler(true);
            commentRepository.save(comment);

            return ResponseEntity.ok(savedRequest);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 