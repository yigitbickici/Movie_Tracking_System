package com.Movie_Management_System.spring.services;

import com.Movie_Management_System.spring.entities.*;
import com.Movie_Management_System.spring.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class DiscussionService {

    @Autowired
    private DiscussionRepository discussionRepository;

    @Autowired
    private PostsRepository postsRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SpoilerRequestRepository spoilerRequestRepository;

    // Discussion işlemleri
    public Discussion getOrCreateDiscussion(Long movieId) {
        Movie movie = movieRepository.findByTmdbId(movieId)
            .orElseThrow(() -> new RuntimeException("Film bulunamadı"));

        return discussionRepository.findByMovie(movie)
            .orElseGet(() -> {
                Discussion discussion = new Discussion();
                discussion.setMovie(movie);
                return discussionRepository.save(discussion);
            });
    }

    // Post işlemleri
    public Posts createPost(Long movieId, Long userId, String content) {
        Discussion discussion = getOrCreateDiscussion(movieId);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        Movie movie = movieRepository.findByTmdbId(movieId)
            .orElseThrow(() -> new RuntimeException("Film bulunamadı"));

        Posts post = new Posts();
        post.setUser(user);
        post.setMovie(movie);
        post.setDiscussion(discussion);
        post.setContent(content);

        return postsRepository.save(post);
    }

    public List<Posts> getPostsByMovie(Long movieId) {
        Discussion discussion = getOrCreateDiscussion(movieId);
        return postsRepository.findByDiscussionOrderByCreatedAtDesc(discussion);
    }

    public void deletePost(Long postId, Long userId) {
        Posts post = postsRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post bulunamadı"));

        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("Bu post'u silme yetkiniz yok");
        }

        postsRepository.delete(post);
    }

    // Yorum işlemleri
    public Comment addComment(Long postId, Long userId, String content) {
        Posts post = postsRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post bulunamadı"));
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setMovie(post.getMovie());
        comment.setPost(post);
        comment.setContent(content);

        post.addComment(comment);
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByPost(Long postId) {
        Posts post = postsRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post bulunamadı"));
        return commentRepository.findByPostOrderByCreatedAtDesc(post);
    }

    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new RuntimeException("Yorum bulunamadı"));

        if (!comment.getUser().getId().equals(userId)) {
            throw new RuntimeException("Bu yorumu silme yetkiniz yok");
        }

        commentRepository.delete(comment);
    }

    // Beğeni işlemleri
    public void likePost(Long postId, Long userId) {
        Posts post = postsRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post bulunamadı"));
        post.setLikeNum(post.getLikeNum() + 1);
        postsRepository.save(post);
    }

    public void likeComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new RuntimeException("Yorum bulunamadı"));
        comment.setLikeCount(comment.getLikeCount() + 1);
        commentRepository.save(comment);
    }

    // Spoiler işlemleri
    public void reportSpoiler(Long postId, Long userId) {
        Posts post = postsRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post bulunamadı"));
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        SpoilerRequest request = new SpoilerRequest();
        request.setUser(user);
        request.setPost(post);
        request.setStatus("PENDING");

        post.addSpoilerRequest(request);
        spoilerRequestRepository.save(request);
    }

    public void reportCommentSpoiler(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new RuntimeException("Yorum bulunamadı"));
        comment.setIsSpoiler(true);
        commentRepository.save(comment);
    }

    // Kullanıcı izleme kontrolü
    public boolean hasUserWatchedMovie(Long userId, Long movieId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        Movie movie = movieRepository.findByTmdbId(movieId)
            .orElseThrow(() -> new RuntimeException("Film bulunamadı"));

        return user.getWatchedMovies().contains(movie);
    }
} 