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
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/spoiler-requests")
@CrossOrigin(origins = "http://moviary.com")
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

            if (Boolean.TRUE.equals(post.getSpoilerReviewed())) {
                return ResponseEntity.badRequest().body("Bu postun spoiler durumu editör tarafından belirlenmiştir.");
            }

            Optional<SpoilerRequest> existingRequest = spoilerRequestRepository
                    .findByPostAndRequestedByUserAndStatus(post, user, "PENDING");

            if (existingRequest.isPresent()) {
                SpoilerRequest request = existingRequest.get();
                if (!request.getRequestedByUser().getId().equals(user.getId())) {
                    return ResponseEntity.status(403).body("Bu spoiler isteğini kaldırma yetkiniz yok.");
                }
                spoilerRequestRepository.delete(request);

                // İsteği kaldırınca spoiler işareti ve pending durumu kaldırılıyor
                post.setIsSpoiler(false);
                post.setSpoilerPending(false);
                postsRepository.save(post);

                return ResponseEntity.ok(Map.of("message", "Spoiler isteğiniz kaldırıldı"));
            }

            SpoilerRequest request = new SpoilerRequest();
            request.setUser(user);
            request.setPost(post);
            request.setStatus("PENDING");
            request.setRequestedByUser(user);
            request.setType(SpoilerRequestType.POST);
            request.setCreatedAt(LocalDateTime.now());

            spoilerRequestRepository.save(request);

            // İstek gönderildiğinde flag’leri güncelle
            post.setIsSpoiler(true);
            post.setSpoilerPending(true);
            postsRepository.save(post);

            return ResponseEntity.ok(Map.of("message", "Spoiler isteğiniz gönderildi"));

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

            if (Boolean.TRUE.equals(comment.getSpoilerReviewed())) {
                return ResponseEntity.badRequest().body("Bu yorumun spoiler durumu editör tarafından belirlenmiştir.");
            }

            Optional<SpoilerRequest> existingRequest = spoilerRequestRepository
                    .findByCommentAndRequestedByUserAndStatus(comment, user, "PENDING");

            if (existingRequest.isPresent()) {
                SpoilerRequest request = existingRequest.get();
                if (!request.getRequestedByUser().getId().equals(user.getId())) {
                    return ResponseEntity.status(403).body("Bu spoiler isteğini kaldırma yetkiniz yok.");
                }
                spoilerRequestRepository.delete(request);
                comment.setIsSpoiler(false);
                comment.setSpoilerPending(false);
                commentRepository.save(comment);
                return ResponseEntity.ok(Map.of("message", "Spoiler isteğiniz kaldırıldı"));
            }

            SpoilerRequest request = new SpoilerRequest();
            request.setUser(user);
            request.setComment(comment);
            request.setPost(comment.getPost());
            request.setStatus("PENDING");
            request.setRequestedByUser(user);
            request.setType(SpoilerRequestType.COMMENT);
            request.setCreatedAt(LocalDateTime.now());

            comment.setIsSpoiler(true);
            comment.setSpoilerPending(true);
            commentRepository.save(comment);

            spoilerRequestRepository.save(request);

            return ResponseEntity.ok(Map.of("message", "Spoiler isteğiniz gönderildi"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PostMapping("/{requestId}/approve")
    public ResponseEntity<?> approveSpoilerRequest(@PathVariable Long requestId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

            if (user.getRole() != Role.EDITOR) {
                return ResponseEntity.status(403).body("Bu işlem için editor yetkisine sahip olmanız gerekiyor");
            }

            SpoilerRequest request = spoilerRequestRepository.findById(requestId)
                    .orElseThrow(() -> new RuntimeException("Spoiler isteği bulunamadı"));

            request.setStatus("APPROVED");
            request.setResolvedByUser(user);
            request.setResolvedAt(LocalDateTime.now());

            if (request.getType() == SpoilerRequestType.POST && request.getPost() != null) {
                Posts post = request.getPost();
                post.setIsSpoiler(true);
                post.setSpoilerPending(false);
                post.setSpoilerReviewed(true);
                postsRepository.save(post);
            } else if (request.getType() == SpoilerRequestType.COMMENT && request.getComment() != null) {
                Comment comment = request.getComment();
                comment.setIsSpoiler(true);
                comment.setSpoilerPending(false);
                comment.setSpoilerReviewed(true);
                commentRepository.save(comment);
            }

            return ResponseEntity.ok(spoilerRequestRepository.save(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{requestId}/reject")
    public ResponseEntity<?> rejectSpoilerRequest(@PathVariable Long requestId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

            if (user.getRole() != Role.EDITOR) {
                return ResponseEntity.status(403).body("Bu işlem için editor yetkisine sahip olmanız gerekiyor");
            }

            SpoilerRequest request = spoilerRequestRepository.findById(requestId)
                    .orElseThrow(() -> new RuntimeException("Spoiler isteği bulunamadı"));

            request.setStatus("REJECTED");
            request.setResolvedByUser(user);
            request.setResolvedAt(LocalDateTime.now());

            if (request.getType() == SpoilerRequestType.POST && request.getPost() != null) {
                Posts post = request.getPost();
                post.setIsSpoiler(false);
                post.setSpoilerPending(false);
                post.setSpoilerReviewed(true);
                postsRepository.save(post);
            } else if (request.getType() == SpoilerRequestType.COMMENT && request.getComment() != null) {
                Comment comment = request.getComment();
                comment.setIsSpoiler(false);
                comment.setSpoilerPending(false);
                comment.setSpoilerReviewed(true);
                commentRepository.save(comment);
            }

            return ResponseEntity.ok(spoilerRequestRepository.save(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllSpoilerRequests() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

            if (user.getRole() != Role.EDITOR) {
                return ResponseEntity.status(403).body("Bu sayfayı görüntülemek için editor yetkisine sahip olmanız gerekiyor");
            }

            List<SpoilerRequest> all = spoilerRequestRepository.findAll();

            for (SpoilerRequest req : all) {
                if (req.getPost() != null && req.getPost().getMovie() != null) {
                    req.getPost().getMovie().getTitle();
                    req.getPost().getMovie().getPosterPath();
                }
            }

            return ResponseEntity.ok(all);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
