package com.Movie_Management_System.spring.controller;

import com.Movie_Management_System.spring.dto.UserAdminDTO;
import com.Movie_Management_System.spring.entities.Role;
import com.Movie_Management_System.spring.entities.User;
import com.Movie_Management_System.spring.entities.UserBan;
import com.Movie_Management_System.spring.repository.UserRepository;
import com.Movie_Management_System.spring.services.AdminService;
import com.Movie_Management_System.spring.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/editor")
@CrossOrigin(origins = "http://localhost:3000")
public class EditorController {

    @Autowired
    private AdminService adminService;
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/ban/{userId}")
    @PreAuthorize("hasRole('EDITOR')")
    public ResponseEntity<?> banUser(@PathVariable Long userId, @RequestBody Map<String, String> body) {
        String reason = body.get("reason");
        adminService.banUser(userId, reason);
        return ResponseEntity.ok(Map.of("message", "Kullanıcı editör tarafından banlandı."));
    }

    @PutMapping("/unban/{userId}")
    @PreAuthorize("hasRole('EDITOR')")
    public ResponseEntity<?> unbanUser(@PathVariable Long userId) {
        adminService.unbanUser(userId);
        return ResponseEntity.ok(Map.of("message", "Editör tarafından kullanıcının banı kaldırıldı."));
    }

    @GetMapping("/banned-users")
    @PreAuthorize("hasRole('EDITOR')")
    public ResponseEntity<List<UserBan>> getBannedUsers() {
        return ResponseEntity.ok(adminService.getBannedUsers());
    }

    @GetMapping("/all-users")
    @PreAuthorize("hasRole('EDITOR')")
    public ResponseEntity<List<UserAdminDTO>> getAllUsers() {
        List<UserAdminDTO> allUsers = adminService.getAllUsersWithBanInfo();

        // Sadece rolü CUSTOMER olanları filtrele
        List<UserAdminDTO> customerUsers = allUsers.stream()
                .filter(user -> "CUSTOMER".equals(user.getRole()))
                .toList();

        return ResponseEntity.ok(customerUsers);
    }

}
