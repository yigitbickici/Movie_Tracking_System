package com.Movie_Management_System.spring.repository;

import com.Movie_Management_System.spring.entities.Posts;
import com.Movie_Management_System.spring.entities.Movie;
import com.Movie_Management_System.spring.entities.SpoilerRequest;
import com.Movie_Management_System.spring.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PostsRepository extends JpaRepository<Posts, Long> {
    List<Posts> findByMovieOrderByCreatedAtDesc(Movie movie);
} 