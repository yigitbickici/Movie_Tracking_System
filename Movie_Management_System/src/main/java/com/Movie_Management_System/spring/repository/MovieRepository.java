package com.Movie_Management_System.spring.repository;

import com.Movie_Management_System.spring.entities.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    @Query(value = "SELECT * FROM movies ORDER BY vote_average DESC LIMIT 10", nativeQuery = true)
    List<Movie> findTopFavoriteMovies();

    @Query(value = "SELECT COUNT(*) FROM user_favorites WHERE movie_id = :movieId", nativeQuery = true)
    Long countFavoritesByMovieId(@Param("movieId") Long movieId);
}
