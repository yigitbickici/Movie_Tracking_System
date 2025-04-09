package com.Movie_Management_System.spring.controller;

import com.Movie_Management_System.spring.dto.UserAdminDTO;
import com.Movie_Management_System.spring.entities.UserBan;
import com.Movie_Management_System.spring.services.AdminService;
import com.Movie_Management_System.spring.dto.CommentDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/ban/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> banUser(@PathVariable Long userId, @RequestBody Map<String, String> body) {
        String reason = body.get("reason");
        adminService.banUser(userId, reason);
        return ResponseEntity.ok(Map.of("message", "Kullanıcı banlandı."));
    }

    @PutMapping("/unban/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> unbanUser(@PathVariable Long userId) {
        adminService.unbanUser(userId);
        return ResponseEntity.ok(Map.of("message", "Kullanıcının banı kaldırıldı."));
    }

    @GetMapping("/banned-users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserBan>> getBannedUsers() {
        return ResponseEntity.ok(adminService.getBannedUsers());
    }

    @GetMapping("/all-users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserAdminDTO>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsersWithBanInfo());
    }

    @GetMapping("/recent-comments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CommentDTO>> getRecentComments() {
        return ResponseEntity.ok(adminService.getRecentComments());
    }

    @DeleteMapping("/delete-post/{postId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletePost(@PathVariable Long postId) {
        try {
            adminService.deletePost(postId);
            return ResponseEntity.ok(Map.of("message", "Yorum başarıyla silindi."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        try {
            Map<String, Object> stats = adminService.getDashboardStats();
            System.out.println("Returning stats: " + stats); // Debug log
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("Error in getDashboardStats: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
