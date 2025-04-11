package com.Movie_Management_System.spring.repository;

import com.Movie_Management_System.spring.entities.Comment;
import com.Movie_Management_System.spring.entities.Posts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostOrderByCreatedAtDesc(Posts post);
    List<Comment> findTop10ByOrderByCreatedAtDesc();

    @Query("SELECT COUNT(c) FROM Comment c")
    long countTotalComments();
} 