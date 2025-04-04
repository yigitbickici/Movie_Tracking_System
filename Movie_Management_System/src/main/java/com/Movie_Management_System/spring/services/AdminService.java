package com.Movie_Management_System.spring.services;

import com.Movie_Management_System.spring.dto.UserAdminDTO;
import com.Movie_Management_System.spring.entities.User;
import com.Movie_Management_System.spring.entities.UserBan;
import com.Movie_Management_System.spring.repository.UserRepository;
import com.Movie_Management_System.spring.repository.UserBanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserBanRepository userBanRepository;

    public void banUser(Long userId, String reason) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

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
}
