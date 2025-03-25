package com.Movie_Management_System.spring.services;

import com.Movie_Management_System.spring.entities.Movie;
import com.Movie_Management_System.spring.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MovieService {

    private final MovieRepository movieRepository;

    @Autowired
    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public Optional<Movie> getMovieById(Long id) {
        return movieRepository.findById(id);
    }

    public List<Movie> getMoviesByTitle(String title) {
        return movieRepository.findByTitleContaining(title);
    }

    // Bu metodu kaldırın veya Movie entity'de director alanı varsa yorum satırından çıkarın
    /*
    public List<Movie> getMoviesByDirector(String director) {
        return movieRepository.findByDirector(director);
    }
    */

    public Movie saveMovie(Movie movie) {
        return movieRepository.save(movie);
    }

    public void deleteMovie(Long id) {
        movieRepository.deleteById(id);
    }
}
