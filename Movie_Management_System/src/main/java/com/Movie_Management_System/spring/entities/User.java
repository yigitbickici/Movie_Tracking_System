package com.Movie_Management_System.spring.entities;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private Role role;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @ManyToMany
    @JoinTable(
            name = "user_favorite_movies",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "movie_id")
    )
    private List<Movie> favoriteMovies;

    @ManyToMany
    @JoinTable(
            name = "user_watched_movies",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns =   @JoinColumn(name = "movie_id")
    )
    private List<Movie> watchedMovies;

    @ManyToMany
    @JoinTable(
            name = "user_watchlist",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns =   @JoinColumn(name = "movie_id")
    )
    private List<Movie> watchedList;

    //JOIN
    //private List<User> following;
    //private List<User> followers;

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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<Movie> getFavoriteMovies() {
        return favoriteMovies;
    }

    public void add_to_favorite(List<Movie> favoriteMovies,  Movie movie) {
        favoriteMovies.add(movie);
    }

    public List<Movie> getWatchedMovies() {
        return watchedMovies;
    }

    public void set_as_wathced(List<Movie> watchedMovies, Movie movie) {
        watchedMovies.add(movie);
    }
}
