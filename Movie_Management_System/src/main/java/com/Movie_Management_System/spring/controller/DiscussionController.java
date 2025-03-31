package com.Movie_Management_System.spring.controller;

import com.Movie_Management_System.spring.entities.*;
import com.Movie_Management_System.spring.services.DiscussionService;
import com.Movie_Management_System.spring.repository.DiscussionRepository;
import com.Movie_Management_System.spring.repository.MovieRepository;
import com.Movie_Management_System.spring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/discussions")
@CrossOrigin(origins = "http://localhost:3000")
public class DiscussionController {

    @Autowired
    private DiscussionService discussionService;

    @Autowired
    private DiscussionRepository discussionRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private UserRepository userRepository;

    // Post işlemleri
    @PostMapping("/movies/{movieId}/posts")
    public ResponseEntity<?> createPost(@PathVariable Long movieId, @RequestBody Map<String, String> request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Long userId = ((User) auth.getPrincipal()).getId();

            if (!discussionService.hasUserWatchedMovie(userId, movieId)) {
                return ResponseEntity.badRequest().body("Bu filmi izlemeden post atamazsınız");
            }

            Posts post = discussionService.createPost(movieId, userId, request.get("content"));
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/movies/{movieId}/posts")
    public ResponseEntity<List<Posts>> getPosts(@PathVariable Long movieId) {
        return ResponseEntity.ok(discussionService.getPostsByMovie(movieId));
    }

    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable Long postId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Long userId = ((User) auth.getPrincipal()).getId();
            discussionService.deletePost(postId, userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Yorum işlemleri
    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<?> addComment(@PathVariable Long postId, @RequestBody Map<String, String> request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Long userId = ((User) auth.getPrincipal()).getId();
            Comment comment = discussionService.addComment(postId, userId, request.get("content"));
            return ResponseEntity.ok(comment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<List<Comment>> getComments(@PathVariable Long postId) {
        return ResponseEntity.ok(discussionService.getCommentsByPost(postId));
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Long userId = ((User) auth.getPrincipal()).getId();
            discussionService.deleteComment(commentId, userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Beğeni işlemleri
    @PostMapping("/posts/{postId}/like")
    public ResponseEntity<?> likePost(@PathVariable Long postId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Long userId = ((User) auth.getPrincipal()).getId();
            discussionService.likePost(postId, userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/comments/{commentId}/like")
    public ResponseEntity<?> likeComment(@PathVariable Long commentId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Long userId = ((User) auth.getPrincipal()).getId();
            discussionService.likeComment(commentId, userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Spoiler işlemleri
    @PostMapping("/posts/{postId}/report-spoiler")
    public ResponseEntity<?> reportPostSpoiler(@PathVariable Long postId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Long userId = ((User) auth.getPrincipal()).getId();
            discussionService.reportSpoiler(postId, userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/comments/{commentId}/report-spoiler")
    public ResponseEntity<?> reportCommentSpoiler(@PathVariable Long commentId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Long userId = ((User) auth.getPrincipal()).getId();
            discussionService.reportCommentSpoiler(commentId, userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // İzleme kontrolü
    @GetMapping("/movies/{movieId}/has-watched")
    public ResponseEntity<Boolean> hasUserWatchedMovie(@PathVariable Long movieId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Long userId = ((User) auth.getPrincipal()).getId();
            return ResponseEntity.ok(discussionService.hasUserWatchedMovie(userId, movieId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<?> getDiscussionByMovieId(@PathVariable Long movieId) {
        try {
            Movie movie = movieRepository.findByTmdbId(movieId)
                .orElseThrow(() -> new RuntimeException("Film bulunamadı"));

            Discussion discussion = discussionRepository.findByMovie(movie)
                .orElseGet(() -> {
                    Discussion newDiscussion = new Discussion();
                    newDiscussion.setMovie(movie);
                    return discussionRepository.save(newDiscussion);
                });

            return ResponseEntity.ok(discussion);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/movie/{movieId}/posts")
    public ResponseEntity<?> createPost(
            @PathVariable Long movieId,
            @RequestBody Posts post) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

            Movie movie = movieRepository.findByTmdbId(movieId)
                .orElseThrow(() -> new RuntimeException("Film bulunamadı"));

            Discussion discussion = discussionRepository.findByMovie(movie)
                .orElseGet(() -> {
                    Discussion newDiscussion = new Discussion();
                    newDiscussion.setMovie(movie);
                    return discussionRepository.save(newDiscussion);
                });

            post.setUser(user);
            post.setMovie(movie);
            post.setDiscussion(discussion);
            discussion.addPost(post);

            Discussion savedDiscussion = discussionRepository.save(discussion);
            Posts savedPost = savedDiscussion.getPosts().get(savedDiscussion.getPosts().size() - 1);

            return ResponseEntity.ok(savedPost);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 