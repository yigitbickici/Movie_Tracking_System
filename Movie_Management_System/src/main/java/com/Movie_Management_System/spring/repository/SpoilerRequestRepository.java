package com.Movie_Management_System.spring.repository;

import com.Movie_Management_System.spring.entities.Comment;
import com.Movie_Management_System.spring.entities.Posts;
import com.Movie_Management_System.spring.entities.SpoilerRequest;
import com.Movie_Management_System.spring.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SpoilerRequestRepository extends JpaRepository<SpoilerRequest, Long> {
    Optional<SpoilerRequest> findByPostAndRequestedByUserAndStatus(Posts post, User user, String status);
    Optional<SpoilerRequest> findByCommentAndRequestedByUserAndStatus(Comment comment, User user, String pending);

}