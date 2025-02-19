package com.Movie_Management_System.spring.services;

import com.Movie_Management_System.spring.entities.Movie;
import com.Movie_Management_System.spring.repository.MovieRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MovieService {

    private final MovieRepository movieRepository;

    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public Optional<Movie> getMovieById(Long id) {
        return movieRepository.findById(id);
    }

    public Movie createMovie(Movie movie) {
        return movieRepository.save(movie);
    }

    public Movie updateMovie(Long id, Movie updatedMovie) {
        return movieRepository.findById(id).map(movie -> {
            movie.setTitle(updatedMovie.getTitle());
            movie.setDirector(updatedMovie.getDirector());
            movie.setReleaseYear(updatedMovie.getReleaseYear());
            return movieRepository.save(movie);
        }).orElseThrow(() -> new RuntimeException("Movie not found"));
    }

    public void deleteMovie(Long id) {
        movieRepository.deleteById(id);
    }
}
