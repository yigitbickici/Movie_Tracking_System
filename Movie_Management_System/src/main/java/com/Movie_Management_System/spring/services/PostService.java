package com.Movie_Management_System.spring.services;

import com.Movie_Management_System.spring.entities.Posts;
import com.Movie_Management_System.spring.entities.Movie;
import com.Movie_Management_System.spring.entities.User;
import com.Movie_Management_System.spring.entities.Comment;
import com.Movie_Management_System.spring.entities.PostLike;
import com.Movie_Management_System.spring.repository.PostsRepository;
import com.Movie_Management_System.spring.repository.CommentRepository;
import com.Movie_Management_System.spring.repository.MovieRepository;
import com.Movie_Management_System.spring.repository.UserRepository;
import com.Movie_Management_System.spring.repository.PostLikeRepository;
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
    private PostLikeRepository postLikeRepository;

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

    public boolean toggleLikePost(Long postId, Long userId) {
        logger.info("Toggling like for post: {} by user: {}", postId, userId);
        
        Posts post = postsRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
            
        User user = userService.getUserById(userId);
        if (user == null) {
            logger.error("User not found with ID: {}", userId);
            throw new RuntimeException("User not found");
        }
        
        Optional<PostLike> existingLike = postLikeRepository.findByUserAndPost(user, post);
        
        if (existingLike.isPresent()) {
            // User already liked the post, so unlike it
            PostLike like = existingLike.get();
            post.removeLike(like);
            postLikeRepository.delete(like);
            postsRepository.save(post);
            logger.info("Post unliked successfully");
            return false; // Return false to indicate the post is now unliked
        } else {
            // User hasn't liked the post yet, so like it
            PostLike like = new PostLike();
            like.setUser(user);
            like.setPost(post);
            postLikeRepository.save(like);
            post.addLike(like);
            postsRepository.save(post);
            logger.info("Post liked successfully");
            return true; // Return true to indicate the post is now liked
        }
    }
    
    public boolean hasUserLikedPost(Long postId, Long userId) {
        Posts post = postsRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
            
        User user = userService.getUserById(userId);
        if (user == null) {
            logger.error("User not found with ID: {}", userId);
            throw new RuntimeException("User not found");
        }
        
        return postLikeRepository.existsByUserAndPost(user, post);
    }

    public Comment createComment(Long postId, Comment comment) {
        logger.info("Creating comment for post: {}", postId);
        Posts post = postsRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        
        comment.setPost(post);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setRating(0.0);
        comment.setIsSpoiler(false);
        comment.setLikeCount(0);
        
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

    public Posts save(Posts post) {
        return postsRepository.save(post);
    }

    public Optional<Posts> getPostById(Long postId) {
        return postsRepository.findById(postId);
    }

    public void deletePost(Long postId) {
        Posts post = postsRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        // Delete all comments
        post.getComments().clear();
        
        // Delete all likes
        post.getLikes().clear();
        
        // Delete all spoiler requests
        post.getSpoilerRequests().clear();
        
        // Save the changes to cascade the deletes
        postsRepository.save(post);
        
        // Finally delete the post
        postsRepository.delete(post);
    }
} 