package com.Movie_Management_System.spring.repository;

import com.Movie_Management_System.spring.entities.VisitorLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VisitorLogRepository extends JpaRepository<VisitorLog, Long> {
    
    @Query("SELECT COUNT(DISTINCT v.ipAddress) FROM VisitorLog v WHERE v.visitDate = ?1")
    Long countUniqueVisitorsByDate(LocalDate date);
    
    @Query("SELECT COUNT(v) FROM VisitorLog v WHERE v.visitDate = ?1")
    Long countTotalVisitsByDate(LocalDate date);
    
    @Query("SELECT COUNT(v) FROM VisitorLog v")
    Long countTotalVisits();
    
    @Query("SELECT COUNT(DISTINCT v.ipAddress) FROM VisitorLog v")
    Long countTotalUniqueVisitors();

    @Query("SELECT COUNT(DISTINCT v.username) FROM VisitorLog v WHERE v.username IS NOT NULL AND v.visitDate = CURRENT_DATE")
    Long countUniqueLoggedInUsersToday();


    
    List<VisitorLog> findByVisitDate(LocalDate date);
} 