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

    public List<Posts> getPostsByMovie(Movie movie) {
        logger.info("Fetching posts for movie: {} (ID: {})", movie.getTitle(), movie.getId());
        
        try {
            List<Posts> posts = postsRepository.findByMovieOrderByCreatedAtDesc(movie);
            logger.info("Found {} posts for movie", posts.size());
            
            // Initialize lazy-loaded collections
            posts.forEach(post -> {
                logger.debug("Loading data for post ID: {}", post.getId());
                post.getUser().getUsername(); // Initialize user
                post.getComments().size(); // Initialize comments
                post.getComments().forEach(comment -> {
                    comment.getUser().getUsername(); // Initialize comment users
                });
            });
            
            return posts;
        } catch (Exception e) {
            logger.error("Error fetching posts for movie: {}", e.getMessage());
            logger.error("Stack trace:", e);
            throw new RuntimeException("Error fetching posts: " + e.getMessage());
        }
    }

    public Posts createPost(String content, Long userId, Movie movie) {
        logger.info("Creating post for user ID: {} and movie ID: {}", userId, movie.getId());
        logger.info("Post content: {}", content);
        
        User user = userService.getUserById(userId);
        if (user == null) {
            logger.error("User not found with ID: {}", userId);
            throw new RuntimeException("User not found");
        }

        Posts post = new Posts();
        post.setContent(content);
        post.setUser(user);
        post.setMovie(movie);
        post.setCreatedAt(LocalDateTime.now());
        post.setLikeNum(0);
        post.setCommentNum(0);
        post.setIsSpoiler(false);

        Posts savedPost = postsRepository.save(post);
        logger.info("Post saved successfully with ID: {}", savedPost.getId());
        return savedPost;
    }

    public void likePost(Long postId) {
        logger.info("Liking post: {}", postId);
        Posts post = postsRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setLikeNum(post.getLikeNum() + 1);
        postsRepository.save(post);
        logger.info("Post liked successfully");
    }

    public Comment createComment(Long postId, Comment comment) {
        logger.info("Creating comment for post: {}", postId);
        Posts post = postsRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        
        comment.setPost(post);
        comment.setCreatedAt(LocalDateTime.now());
        Comment savedComment = commentRepository.save(comment);
        
        post.setCommentNum(post.getCommentNum() + 1);
        postsRepository.save(post);
        
        logger.info("Comment created successfully with ID: {}", savedComment.getId());
        return savedComment;
    }

    public List<Comment> getCommentsByPost(Posts post) {
        logger.info("Fetching comments for post: {}", post.getId());
        return commentRepository.findByPostOrderByCreatedAtDesc(post);
    }
} 