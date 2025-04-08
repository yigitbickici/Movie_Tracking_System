package com.Movie_Management_System.spring.dto;

import java.time.LocalDateTime;

public class CommentDTO {
    private Long id;
    private String username;
    private String movieTitle;
    private String content;
    private LocalDateTime createdAt;
    private Double rating;
    private String posterPath;

    // Constructor
    public CommentDTO(Long id, String username, String movieTitle, String content, LocalDateTime createdAt, Double rating, String posterPath) {
        this.id = id;
        this.username = username;
        this.movieTitle = movieTitle;
        this.content = content;
        this.createdAt = createdAt;
        this.rating = rating;
        this.posterPath = posterPath;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getMovieTitle() {
        return movieTitle;
    }

    public void setMovieTitle(String movieTitle) {
        this.movieTitle = movieTitle;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getPosterPath() {
        return posterPath;
    }

    public void setPosterPath(String posterPath) {
        this.posterPath = posterPath;
    }
}
