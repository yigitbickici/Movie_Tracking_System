package com.Movie_Management_System.spring.payload.request;

public class PostRequest {
    private String content;
    private Long movieId;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }
} 