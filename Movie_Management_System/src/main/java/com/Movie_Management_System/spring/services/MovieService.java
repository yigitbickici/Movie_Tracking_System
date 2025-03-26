package com.Movie_Management_System.spring.services;

import com.Movie_Management_System.spring.entities.Movie;
import com.Movie_Management_System.spring.entities.User;
import com.Movie_Management_System.spring.repository.MovieRepository;
import com.Movie_Management_System.spring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.Set;

@Service
public class MovieService {

    private final MovieRepository movieRepository;

    @Autowired
    private UserRepository userRepository;

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

    public Optional<Movie> getMovieByTmdbId(Long tmdbId) {
        return movieRepository.findByTmdbId(tmdbId);
    }

    public Movie saveMovie(Movie movie) {
        return movieRepository.save(movie);
    }

    public void deleteMovie(Long id) {
        movieRepository.deleteById(id);
    }

    public void addToWatchlist(Long userId, Long movieId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Movie movie = movieRepository.findByTmdbId(movieId)
            .orElseThrow(() -> new RuntimeException("Film bulunamadı"));

        if (!user.getWatchlist().contains(movie)) {
            user.addToWatchlist(movie);
            userRepository.save(user);
        }
    }

    public void removeFromWatchlist(Long userId, Long movieId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Movie movie = movieRepository.findByTmdbId(movieId)
            .orElseThrow(() -> new RuntimeException("Film bulunamadı"));

        if (user.getWatchlist().contains(movie)) {
            user.removeFromWatchlist(movie);
            userRepository.save(user);
            movieRepository.save(movie);
        }
    }

    public boolean isInWatchlist(Long userId, Long movieId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        return user.getWatchlist().stream()
            .anyMatch(movie -> movie.getTmdbId().equals(movieId));
    }

    public void addToWatched(Long userId, Long movieId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Movie movie = movieRepository.findByTmdbId(movieId)
            .orElseThrow(() -> new RuntimeException("Film bulunamadı"));

        if (!user.getWatchedMovies().contains(movie)) {
            user.addToWatchedMovies(movie);
            userRepository.save(user);
        }
    }

    public void removeFromWatched(Long userId, Long movieId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Movie movie = movieRepository.findByTmdbId(movieId)
            .orElseThrow(() -> new RuntimeException("Film bulunamadı"));

        if (user.getWatchedMovies().contains(movie)) {
            user.removeFromWatchedMovies(movie);
            userRepository.save(user);
            movieRepository.save(movie);
        }
    }

    public boolean isWatched(Long userId, Long movieId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        return user.getWatchedMovies().stream()
            .anyMatch(movie -> movie.getTmdbId().equals(movieId));
    }

    public List<Movie> getWatchlist(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        // İzlenen filmleri al
        Set<Movie> watchedMovies = user.getWatchedMovies();
        
        // Watchlist'ten izlenen filmleri filtrele
        return user.getWatchlist().stream()
            .filter(movie -> !watchedMovies.contains(movie))
            .collect(Collectors.toList());
    }

    public List<Movie> getWatchedMovies(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        return new ArrayList<>(user.getWatchedMovies());
    }
}
