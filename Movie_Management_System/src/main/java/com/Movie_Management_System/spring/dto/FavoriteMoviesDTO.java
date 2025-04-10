package com.Movie_Management_System.spring.dto;

public class FavoriteMoviesDTO {
    private Long movieId;
    private String title;
    private String posterPath;
    private Double rating;
    private Long favoriteCount;

    // Constructor
    public FavoriteMoviesDTO(Long movieId, String title, String posterPath, Double rating, Long favoriteCount) {
        this.movieId = movieId;
        this.title = title;
        this.posterPath = posterPath;
        this.rating = rating;
        this.favoriteCount = favoriteCount;
    }

    // Getters ve Setters
    public Long getMovieId() { return movieId; }
    public void setMovieId(Long movieId) { this.movieId = movieId; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getPosterPath() { return posterPath; }
    public void setPosterPath(String posterPath) { this.posterPath = posterPath; }
    
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    
    public Long getFavoriteCount() { return favoriteCount; }
    public void setFavoriteCount(Long favoriteCount) { this.favoriteCount = favoriteCount; }
}
