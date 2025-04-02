package com.Movie_Management_System.spring.services;

import com.Movie_Management_System.spring.entities.Posts;
import com.Movie_Management_System.spring.entities.Movie;
import com.Movie_Management_System.spring.entities.User;
import com.Movie_Management_System.spring.entities.Comment;
import com.Movie_Management_System.spring.repository.PostsRepository;
import com.Movie_Management_System.spring.repository.CommentRepository;
import com.Movie_Management_System.spring.repository.MovieRepository;
import com.Movie_Management_System.spring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    private static final Logger logger = LoggerFactory.getLogger(PostService.class);

    @Autowired
    private PostsRepository postsRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    public Optional<Posts> getPostById(Long id) {
        return postsRepository.findById(id);
    }

    public Posts savePost(Posts post) {
        return postsRepository.save(post);
    }

    // ... existing code ...
} 