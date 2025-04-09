package com.Movie_Management_System.spring.services;

import com.Movie_Management_System.spring.dto.UserAdminDTO;
import com.Movie_Management_System.spring.entities.User;
import com.Movie_Management_System.spring.entities.UserBan;
import com.Movie_Management_System.spring.entities.Role;
import com.Movie_Management_System.spring.repository.UserRepository;
import com.Movie_Management_System.spring.repository.UserBanRepository;
import com.Movie_Management_System.spring.repository.MovieRepository;
import com.Movie_Management_System.spring.repository.PostsRepository;
import com.Movie_Management_System.spring.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.Movie_Management_System.spring.dto.CommentDTO;
import com.Movie_Management_System.spring.entities.Posts;
import com.Movie_Management_System.spring.services.VisitorService;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserBanRepository userBanRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private PostsRepository postsRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private VisitorService visitorService;

    public void banUser(Long userId, String reason) {
        // Önce kullanıcıyı bul
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        // Kullanıcının admin olup olmadığını kontrol et
        if (user.getRole() == Role.ADMIN) {
            throw new RuntimeException("Admin kullanıcılar banlanamaz!");
        }

        // Kendini banlama kontrolü
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = auth.getName();
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Oturum açmış kullanıcı bulunamadı"));

        if (currentUser.getId().equals(userId)) {
            throw new RuntimeException("Kendinizi banlayamazsınız!");
        }

        Optional<UserBan> existingBanOpt = userBanRepository.findByUserId(userId);
        if (existingBanOpt.isPresent()) {
            UserBan existingBan = existingBanOpt.get();
            existingBan.setReason(reason);
            existingBan.setActive(true);
            userBanRepository.save(existingBan);
        } else {
            UserBan ban = new UserBan(user, reason);
            userBanRepository.save(ban);
        }

        // users tablosunu da güncelle
        user.setBanned(true);
        user.setBanReason(reason);
        userRepository.save(user);
    }

    public void unbanUser(Long userId) {
        Optional<UserBan> existingBanOpt = userBanRepository.findByUserId(userId);
        if (existingBanOpt.isPresent()) {
            UserBan existingBan = existingBanOpt.get();
            existingBan.setActive(false);
            existingBan.setReason(null);
            userBanRepository.save(existingBan);
        }

        // users tablosunu da güncelle
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        user.setBanned(false);
        user.setBanReason(null);
        userRepository.save(user);
    }

    public List<UserBan> getBannedUsers() {
        return userBanRepository.findAllByActiveTrue();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<UserAdminDTO> getAllUsersWithBanInfo() {
        List<User> users = userRepository.findAll();
        List<UserBan> bans = userBanRepository.findAllByActiveTrue();

        Map<Long, UserBan> banMap = bans.stream()
                .collect(Collectors.toMap(ban -> ban.getUser().getId(), ban -> ban));

        return users.stream()
                .map(user -> {
                    UserBan ban = banMap.get(user.getId());
                    boolean isBanned = ban != null && ban.isActive();
                    String reason = (ban != null) ? ban.getReason() : null;
                    String role = user.getRole().name(); // Rolü de ekle
                    return new UserAdminDTO(user.getId(), user.getUsername(), user.getEmail(), isBanned, reason, role);
                })
                .collect(Collectors.toList());
    }

    public List<CommentDTO> getRecentComments() {
        return postsRepository.findTop10ByOrderByCreatedAtDesc()
            .stream()
            .map(post -> new CommentDTO(
                post.getId(),
                post.getUser().getUsername(),
                post.getMovie().getTitle(),
                post.getContent(),
                post.getCreatedAt(),
                0.0, // rating için varsayılan değer
                post.getMovie().getPosterPath() // Film posterini ekleyin
            ))
            .collect(Collectors.toList());
    }

    public void deletePost(Long postId) {
        Posts post = postsRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post bulunamadı"));
        
        postsRepository.delete(post);
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            // Get real data from repositories
            Long totalMovies = 10000L; // ← Sabit sayı
            Long totalUsers = userRepository.count();
            Long totalReviews = postsRepository.count();
            // Get visitor stats
            Map<String, Long> dailyVisitorStats = visitorService.getDailyStats();
            Map<String, Long> totalVisitorStats = visitorService.getTotalStats();
            
            // Debug logs
            System.out.println("Total Movies: " + totalMovies);
            System.out.println("Total Users: " + totalUsers);
            System.out.println("Total Reviews: " + totalReviews);
            System.out.println("Daily Visitor Stats: " + dailyVisitorStats);
            System.out.println("Total Visitor Stats: " + totalVisitorStats);
            
            // Put all stats in the map
            stats.put("totalMovies", totalMovies != null ? totalMovies : 0L);
            stats.put("totalUsers", totalUsers != null ? totalUsers : 0L);
            stats.put("totalReviews", totalReviews != null ? totalReviews : 0L);
            stats.put("dailyVisitors", dailyVisitorStats.get("uniqueVisitors") != null ? dailyVisitorStats.get("uniqueVisitors") : 0L);
            stats.put("totalVisitors", totalVisitorStats.get("totalUniqueVisitors") != null ? totalVisitorStats.get("totalUniqueVisitors") : 0L);
            
            System.out.println("Final stats map: " + stats); // Debug log
            
            return stats;
        } catch (Exception e) {
            // Log the error
            System.err.println("Error getting dashboard stats: " + e.getMessage());
            e.printStackTrace();
            
            // Return default values in case of error
            stats.put("totalMovies", 10000L);
            stats.put("totalUsers", 0L);
            stats.put("totalReviews", 0L);
            stats.put("dailyVisitors", 0L);
            stats.put("totalVisitors", 0L);
            
            return stats;
        }
    }
}
