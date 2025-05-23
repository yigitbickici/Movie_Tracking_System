package com.Movie_Management_System.spring.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.Comments;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name ="posts")
public class Posts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"followers", "following", "posts", "comments", "password", "email", "roles"})
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "movie_id", nullable = false)
    @JsonIgnoreProperties("posts")
    private Movie movie;

    @Column(nullable = false, length = 2000)
    @JsonProperty("content")
    private String content;

    @Column
    private Integer likeNum = 0;

    @Column
    private Integer commentNum = 0;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @Column
    private Boolean isSpoiler = false;

    @Column
    private Boolean spoilerPending = false;

    @Column
    private Boolean spoilerReviewed = false;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnoreProperties("post")
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("post")
    private List<SpoilerRequest> spoilerRequests = new ArrayList<>();
    
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("post")
    private List<PostLike> likes = new ArrayList<>();

    @Column(name = "media_url", length = 500)
    private String mediaUrl;

    // Constructors
    public Posts() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Movie getMovie() {
        return movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getLikeNum() {
        return likeNum;
    }

    public void setLikeNum(Integer likeNum) {
        this.likeNum = likeNum;
    }

    public Integer getCommentNum() {
        return commentNum;
    }

    public void setCommentNum(Integer commentNum) {
        this.commentNum = commentNum;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Boolean getIsSpoiler() {
        return isSpoiler;
    }

    public void setIsSpoiler(Boolean isSpoiler) {
        this.isSpoiler = isSpoiler;
    }

    public Boolean getSpoilerPending() {return spoilerPending;}

    public void setSpoilerPending(Boolean spoilerPending) {this.spoilerPending = spoilerPending;}

    public Boolean getSpoilerReviewed() {return spoilerReviewed;}

    public void setSpoilerReviewed(Boolean spoilerReviewed) {this.spoilerReviewed = spoilerReviewed;}

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public List<SpoilerRequest> getSpoilerRequests() {
        return spoilerRequests;
    }

    public void setSpoilerRequests(List<SpoilerRequest> spoilerRequests) {
        this.spoilerRequests = spoilerRequests;
    }
    
    public List<PostLike> getLikes() {
        return likes;
    }

    public void setLikes(List<PostLike> likes) {
        this.likes = likes;
    }

    public String getMediaUrl() {
        return mediaUrl;
    }

    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }

    // Helper methods for managing comments
    public void addComment(Comment comment) {
        comments.add(comment);
        comment.setPost(this);
        this.commentNum++;
    }

    public void removeComment(Comment comment) {
        comments.remove(comment);
        comment.setPost(null);
        this.commentNum--;
    }

    // Helper methods for spoiler requests
    public void addSpoilerRequest(SpoilerRequest request) {
        spoilerRequests.add(request);
        request.setPost(this);
    }

    public void removeSpoilerRequest(SpoilerRequest request) {
        spoilerRequests.remove(request);
        request.setPost(null);
    }
    
    // Helper methods for likes
    public void addLike(PostLike like) {
        likes.add(like);
        like.setPost(this);
        this.likeNum++;
    }

    public void removeLike(PostLike like) {
        likes.remove(like);
        like.setPost(null);
        this.likeNum--;
    }

    // Pre-persist hook to set createdAt
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Pre-update hook to set updatedAt
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }


}
