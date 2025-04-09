package com.Movie_Management_System.spring.repository;

import com.Movie_Management_System.spring.entities.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {

    List<Movie> findByTitle(String title);

    List<Movie> findByTitleContaining(String title);

    List<Movie> findByReleaseYear(int releaseYear);

    List<Movie> findByGenre(String genre);

    List<Movie> findByTitleAndDirector(String title, String director);

    List<Movie> findByReleaseYearOrderByTitleAsc(int releaseYear);

    long countByGenre(String genre);

    Optional<Movie> findByTmdbId(Long tmdbId);

    @Query("SELECT COUNT(m) FROM Movie m")
    long countTotalMovies();
}
