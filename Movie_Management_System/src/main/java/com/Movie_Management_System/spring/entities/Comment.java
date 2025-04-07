package com.Movie_Management_System.spring.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"posts", "comments", "password", "email", "roles"})
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "post_id", nullable = false)
    @JsonIgnoreProperties("comments")
    private Posts post;

    @Column(nullable = false, length = 1000)
    private String content;

    private double rating;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @Column
    private Boolean isSpoiler = false;

    @Column
    private Boolean spoilerPending = false; // 👈 YENİ EKLENEN ALAN

    @Column
    private Boolean spoilerReviewed = false;

    @Column
    private Integer likeCount = 0;

    // Constructors
    public Comment() {
        this.createdAt = LocalDateTime.now();
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

    public Posts getPost() {
        return post;
    }

    public void setPost(Posts post) {
        this.post = post;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
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

    public Boolean getSpoilerPending() {
        return spoilerPending;
    }

    public void setSpoilerPending(Boolean spoilerPending) {
        this.spoilerPending = spoilerPending;
    }

    public Boolean getSpoilerReviewed() {return spoilerReviewed;}

    public void setSpoilerReviewed(Boolean spoilerReviewed) {this.spoilerReviewed = spoilerReviewed;}

    public Integer getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(Integer likeCount) {
        this.likeCount = likeCount;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
