package com.Movie_Management_System.spring.repository;

import com.Movie_Management_System.spring.entities.Discussion;
import com.Movie_Management_System.spring.entities.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DiscussionRepository extends JpaRepository<Discussion, Long> {
    Optional<Discussion> findByMovie(Movie movie);
} 