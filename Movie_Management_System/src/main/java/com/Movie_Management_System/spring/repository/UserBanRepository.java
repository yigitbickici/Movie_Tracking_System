package com.Movie_Management_System.spring.repository;

import com.Movie_Management_System.spring.entities.UserBan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserBanRepository extends JpaRepository<UserBan, Long> {
    Optional<UserBan> findByUserId(Long userId);
    List<UserBan> findAllByActiveTrue();
}
