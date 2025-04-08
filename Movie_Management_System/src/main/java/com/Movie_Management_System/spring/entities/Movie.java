package com.Movie_Management_System.spring.entities;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "movies")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long tmdbId;

    @Column(nullable = false)
    private String title;

    @Column
    private String posterPath;

    @Column
    private String releaseDate;

    @Column(length = 2000)
    private String overview;

    @Column
    private Double voteAverage;

    @Column
    private int releaseYear;

    @Column
    private String genre;

    @Column
    private String director;

    @Column(name = "runtime")
    private Integer runtime;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL)
    @JsonIgnore // 👈 Bu önemli: Döngüyü kırar ve movie içinde post'lar dönmez
    private List<Posts> posts = new ArrayList<>();

    // Constructor
    public Movie() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTmdbId() {
        return tmdbId;
    }

    public void setTmdbId(Long tmdbId) {
        this.tmdbId = tmdbId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPosterPath() {
        return posterPath;
    }

    public void setPosterPath(String posterPath) {
        this.posterPath = posterPath;
    }

    public String getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(String releaseDate) {
        this.releaseDate = releaseDate;
    }

    public String getOverview() {
        return overview;
    }

    public void setOverview(String overview) {
        this.overview = overview;
    }

    public Double getVoteAverage() {
        return voteAverage;
    }

    public void setVoteAverage(Double voteAverage) {
        this.voteAverage = voteAverage;
    }

    public List<Posts> getPosts() {
        return posts;
    }

    public void setPosts(List<Posts> posts) {
        this.posts = posts;
    }

    public int getReleaseYear() {
        return releaseYear;
    }

    public void setReleaseYear(int releaseYear) {
        this.releaseYear = releaseYear;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }

    public Integer getRuntime() {
        return runtime;
    }

    public void setRuntime(Integer runtime) {
        this.runtime = runtime;
    }

    // Helper methods
    public void addPost(Posts post) {
        if (!posts.contains(post)) {
            posts.add(post);
        }
    }

    public void removePost(Posts post) {
        posts.remove(post);
    }
}
