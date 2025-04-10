package com.Movie_Management_System.spring.entities;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "users",
       uniqueConstraints = {
           @UniqueConstraint(columnNames = "username"),
           @UniqueConstraint(columnNames = "email")
       })
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(max = 120)
    @JsonIgnore
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.CUSTOMER;

    @Column(name = "is_banned")
    private boolean isBanned = false;

    @Column(name = "ban_reason")
    private String banReason;

    @ManyToMany
    @JoinTable(
            name = "user_favorite_movies",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "movie_id")
    )
    @JsonIgnore
    private Set<Movie> favoriteMovies = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "user_watched_movies",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "movie_id")
    )
    @JsonIgnore
    private Set<Movie> watchedMovies = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_watchlist",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "movie_id"))
    @JsonIgnore
    private Set<Movie> watchlist = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonBackReference("user-posts")
    private List<Posts> posts = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonBackReference("user-comments")
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "requestedByUser")
    private List<SpoilerRequest> requestedSpoilers = new ArrayList<>();

    @OneToMany(mappedBy = "resolvedByUser")
    private List<SpoilerRequest> resolvedSpoilers = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "user_followers",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "follower_id")
    )
    private List<User> followers = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "user_following",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "following_id")
    )
    private List<User> following = new ArrayList<>();

    public User() {
    }

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean isBanned() {
        return isBanned;
    }

    public void setBanned(boolean banned) {
        isBanned = banned;
    }

    public String getBanReason() {
        return banReason;
    }

    public void setBanReason(String banReason) {
        this.banReason = banReason;
    }

    public Set<Movie> getFavoriteMovies() {
        return favoriteMovies;
    }

    public void setFavoriteMovies(Set<Movie> favoriteMovies) {
        this.favoriteMovies = favoriteMovies;
    }

    public Set<Movie> getWatchedMovies() {
        return watchedMovies;
    }

    public void setWatchedMovies(Set<Movie> watchedMovies) {
        this.watchedMovies = watchedMovies;
    }

    public Set<Movie> getWatchlist() {
        return watchlist;
    }

    public void setWatchlist(Set<Movie> watchlist) {
        this.watchlist = watchlist;
    }

    public List<Posts> getPosts() {
        return posts;
    }

    public void setPosts(List<Posts> posts) {
        this.posts = posts;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public List<SpoilerRequest> getRequestedSpoilers() {
        return requestedSpoilers;
    }

    public void setRequestedSpoilers(List<SpoilerRequest> requestedSpoilers) {
        this.requestedSpoilers = requestedSpoilers;
    }

    public List<SpoilerRequest> getResolvedSpoilers() {
        return resolvedSpoilers;
    }

    public void setResolvedSpoilers(List<SpoilerRequest> resolvedSpoilers) {
        this.resolvedSpoilers = resolvedSpoilers;
    }

    public List<User> getFollowers() {
        return followers;
    }

    public void setFollowers(List<User> followers) {
        this.followers = followers;
    }

    public List<User> getFollowing() {
        return following;
    }

    public void setFollowing(List<User> following) {
        this.following = following;
    }

    // Helper methods
    public void addToWatchedMovies(Movie movie) {
        if (watchedMovies == null) {
            watchedMovies = new HashSet<>();
        }
        watchedMovies.add(movie);
    }

    public void removeFromWatchedMovies(Movie movie) {
        if (watchedMovies != null) {
            watchedMovies.remove(movie);
        }
    }

    public void addToWatchlist(Movie movie) {
        if (watchlist == null) {
            watchlist = new HashSet<>();
        }
        watchlist.add(movie);
    }

    public void removeFromWatchlist(Movie movie) {
        if (watchlist != null) {
            watchlist.remove(movie);
        }
    }

    public void addToFavoriteMovies(Movie movie) {
        if (favoriteMovies == null) {
            favoriteMovies = new HashSet<>();
        }
        favoriteMovies.add(movie);
    }

    public void removeFromFavoriteMovies(Movie movie) {
        if (favoriteMovies != null) {
            favoriteMovies.remove(movie);
        }
    }

    public void followUser(User user) {
        following.add(user);
        user.getFollowers().add(this);
    }

    public void unfollowUser(User user) {
        following.remove(user);
        user.getFollowers().remove(this);
    }
}
