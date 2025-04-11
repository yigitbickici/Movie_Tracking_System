package com.Movie_Management_System.spring.services;

import com.Movie_Management_System.spring.entities.VisitorLog;
import com.Movie_Management_System.spring.repository.VisitorLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Map;
import java.util.HashMap;

@Service
public class VisitorService {

    @Autowired
    private VisitorLogRepository visitorLogRepository;

    public void logVisit(String ipAddress, String userAgent, String pageUrl) {
        VisitorLog log = new VisitorLog();
        log.setIpAddress(ipAddress);
        log.setUserAgent(userAgent);
        log.setPageUrl(pageUrl);

        // Kullanıcı adı varsa ekle
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            log.setUsername(auth.getName());
        }

        visitorLogRepository.save(log);
    }

    public Map<String, Long> getDailyStats() {
        LocalDate today = LocalDate.now();
        Map<String, Long> stats = new HashMap<>();

        // IP yerine kullanıcıya göre benzersiz ziyaretçileri say
        Long uniqueVisitors = visitorLogRepository.countUniqueLoggedInUsersToday();
        Long totalVisits = visitorLogRepository.countTotalVisitsByDate(today);

        stats.put("uniqueVisitors", uniqueVisitors != null ? uniqueVisitors : 0L);
        stats.put("totalVisits", totalVisits != null ? totalVisits : 0L);

        return stats;
    }

    public Map<String, Long> getTotalStats() {
        Map<String, Long> stats = new HashMap<>();

        Long totalUniqueVisitors = visitorLogRepository.countTotalUniqueVisitors(); // istersen bunu da username'e göre yapabiliriz
        Long totalVisits = visitorLogRepository.countTotalVisits();

        stats.put("totalUniqueVisitors", totalUniqueVisitors != null ? totalUniqueVisitors : 0L);
        stats.put("totalVisits", totalVisits != null ? totalVisits : 0L);

        return stats;
    }
}
