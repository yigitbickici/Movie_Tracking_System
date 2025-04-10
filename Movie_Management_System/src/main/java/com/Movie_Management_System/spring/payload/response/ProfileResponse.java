package com.Movie_Management_System.spring.payload.response;

import java.util.List;

public class ProfileResponse {
    private String username;
    private String avatar;
    private ProfileStats stats;
    private List<MovieDTO> favorites;
    private List<MovieDTO> watched;
    private List<MovieDTO> watchlist;
    private List<CommentDTO> comments;
    private List<UserDTO> followers;
    private List<UserDTO> following;

    public static class ProfileStats {
        private int following;
        private int followers;
        private int comments;
        private MovieTime movieTime;
        private int moviesWatched;

        public static class MovieTime {
            private int months;
            private int days;
            private int hours;

            public int getMonths() { return months; }
            public void setMonths(int months) { this.months = months; }
            public int getDays() { return days; }
            public void setDays(int days) { this.days = days; }
            public int getHours() { return hours; }
            public void setHours(int hours) { this.hours = hours; }
        }

        public int getFollowing() { return following; }
        public void setFollowing(int following) { this.following = following; }
        public int getFollowers() { return followers; }
        public void setFollowers(int followers) { this.followers = followers; }
        public int getComments() { return comments; }
        public void setComments(int comments) { this.comments = comments; }
        public MovieTime getMovieTime() { return movieTime; }
        public void setMovieTime(MovieTime movieTime) { this.movieTime = movieTime; }
        public int getMoviesWatched() { return moviesWatched; }
        public void setMoviesWatched(int moviesWatched) { this.moviesWatched = moviesWatched; }
    }

    public static class MovieDTO {
        private Long id;
        private Long tmdbId;
        private String title;
        private String posterPath;
        private String releaseDate;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getTmdbId() { return tmdbId; }
        public void setTmdbId(Long tmdbId) { this.tmdbId = tmdbId; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getPosterPath() { return posterPath; }
        public void setPosterPath(String posterPath) { this.posterPath = posterPath; }
        public String getReleaseDate() { return releaseDate; }
        public void setReleaseDate(String releaseDate) { this.releaseDate = releaseDate; }
    }

    public static class CommentDTO {
        private Long id;
        private Long movieId;
        private String movieTitle;
        private String moviePoster;
        private String comment;
        private double rating;
        private String date;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getMovieId() { return movieId; }
        public void setMovieId(Long movieId) { this.movieId = movieId; }
        public String getMovieTitle() { return movieTitle; }
        public void setMovieTitle(String movieTitle) { this.movieTitle = movieTitle; }
        public String getMoviePoster() { return moviePoster; }
        public void setMoviePoster(String moviePoster) { this.moviePoster = moviePoster; }
        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
        public double getRating() { return rating; }
        public void setRating(double rating) { this.rating = rating; }
        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
    }

    public static class UserDTO {
        private Long id;
        private String username;
        private int movieCount;
        private boolean isFollowing;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public int getMovieCount() { return movieCount; }
        public void setMovieCount(int movieCount) { this.movieCount = movieCount; }
        public boolean isFollowing() { return isFollowing; }
        public void setFollowing(boolean following) { isFollowing = following; }
    }

    // Getters and Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    public ProfileStats getStats() { return stats; }
    public void setStats(ProfileStats stats) { this.stats = stats; }
    public List<MovieDTO> getFavorites() { return favorites; }
    public void setFavorites(List<MovieDTO> favorites) { this.favorites = favorites; }
    public List<MovieDTO> getWatched() { return watched; }
    public void setWatched(List<MovieDTO> watched) { this.watched = watched; }
    public List<MovieDTO> getWatchlist() { return watchlist; }
    public void setWatchlist(List<MovieDTO> watchlist) { this.watchlist = watchlist; }
    public List<CommentDTO> getComments() { return comments; }
    public void setComments(List<CommentDTO> comments) { this.comments = comments; }
    public List<UserDTO> getFollowers() { return followers; }
    public void setFollowers(List<UserDTO> followers) { this.followers = followers; }
    public List<UserDTO> getFollowing() { return following; }
    public void setFollowing(List<UserDTO> following) { this.following = following; }
} 