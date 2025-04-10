package com.Movie_Management_System.spring.repository;

import com.Movie_Management_System.spring.entities.SpoilerRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpoilerRequestRepository extends JpaRepository<SpoilerRequest, Long> {
} 