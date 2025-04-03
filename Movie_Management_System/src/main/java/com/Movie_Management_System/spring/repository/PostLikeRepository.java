package com.Movie_Management_System.spring.repository;

import com.Movie_Management_System.spring.entities.PostLike;
import com.Movie_Management_System.spring.entities.Posts;
import com.Movie_Management_System.spring.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    Optional<PostLike> findByUserAndPost(User user, Posts post);
    boolean existsByUserAndPost(User user, Posts post);
} 