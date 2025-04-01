package com.Movie_Management_System.spring.services;

import com.Movie_Management_System.spring.entities.Movie;
import com.Movie_Management_System.spring.entities.User;
import com.Movie_Management_System.spring.repository.MovieRepository;
import com.Movie_Management_System.spring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.Set;
import java.util.Map;
import java.util.HashMap;
import java.util.Collections;

@Service
public class MovieService {

    private static final Logger logger = LoggerFactory.getLogger(MovieService.class);

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

    public Movie getMovieById(Long id) {
        logger.info("Fetching movie with ID: {}", id);
        Optional<Movie> movie = movieRepository.findById(id);
        if (movie.isPresent()) {
            return movie.get();
        }
        logger.error("Movie not found with ID: {}", id);
        throw new RuntimeException("Movie not found");
    }

    public List<Movie> getMoviesByTitle(String title) {
        return movieRepository.findByTitleContaining(title);
    }

    public Optional<Movie> getMovieByTmdbId(Long tmdbId) {
        logger.info("Fetching movie with TMDB ID: {}", tmdbId);
        return movieRepository.findByTmdbId(tmdbId);
    }

    public Movie saveMovie(Movie movie) {
        logger.info("Saving movie: {}", movie.getId());
        return movieRepository.save(movie);
    }

    public void deleteMovie(Long id) {
        movieRepository.deleteById(id);
    }

    public void addToWatchlist(Long userId, Long movieId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User could not be found"));

        Movie movie = movieRepository.findByTmdbId(movieId)
            .orElseThrow(() -> new RuntimeException("Movie could not be found"));

        if (!user.getWatchlist().contains(movie)) {
            user.addToWatchlist(movie);
            userRepository.save(user);
        }
    }

    public void removeFromWatchlist(Long userId, Long movieId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User could not be found"));

        Movie movie = movieRepository.findByTmdbId(movieId)
            .orElseThrow(() -> new RuntimeException("Movie could not be found"));

        if (user.getWatchlist().contains(movie)) {
            user.removeFromWatchlist(movie);
            userRepository.save(user);
            movieRepository.save(movie);
        }
    }

    public boolean isInWatchlist(Long userId, Long movieId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User could not be found"));

        return user.getWatchlist().stream()
            .anyMatch(movie -> movie.getTmdbId().equals(movieId));
    }

    public void addToWatched(Long userId, Long movieId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User could not be found"));

        Movie movie = movieRepository.findByTmdbId(movieId)
            .orElseThrow(() -> new RuntimeException("Movie could not be found"));

        if (!user.getWatchedMovies().stream().anyMatch(m -> m.getTmdbId().equals(movieId))) {
            user.addToWatchedMovies(movie);
            userRepository.save(user);
        }
    }

    public void removeFromWatched(Long userId, Long movieId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User could not be found"));

        Movie movie = movieRepository.findByTmdbId(movieId)
            .orElseThrow(() -> new RuntimeException("Movie could not be found"));

        if (user.getWatchedMovies().stream().anyMatch(m -> m.getTmdbId().equals(movieId))) {
            user.removeFromWatchedMovies(movie);
            if (user.getFavoriteMovies().stream().anyMatch(m -> m.getTmdbId().equals(movieId))) {
                user.removeFromFavoriteMovies(movie);
            }
            userRepository.save(user);
        }
    }

    public boolean isWatched(Long userId, Long movieId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User could not be found"));

        return user.getWatchedMovies().stream()
            .anyMatch(movie -> movie.getTmdbId().equals(movieId));
    }

    public List<Movie> getWatchlist(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User could not be found"));

        // İzlenen filmleri al
        Set<Movie> watchedMovies = user.getWatchedMovies();
        
        // Watchlist'ten izlenen filmleri filtrele
        return user.getWatchlist().stream()
            .filter(movie -> !watchedMovies.contains(movie))
            .collect(Collectors.toList());
    }

    public List<Movie> getWatchedMovies(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User could not be found"));

        Set<Movie> watchedMoviesSet = user.getWatchedMovies();
        System.out.println("User ID: " + userId);
        System.out.println("Watched movies set: " + (watchedMoviesSet != null ? watchedMoviesSet.size() : "null"));
        
        if (watchedMoviesSet == null) {
            System.out.println("Watched movies set is null, returning empty list");
            return new ArrayList<>();
        }
        
        List<Movie> result = new ArrayList<>(watchedMoviesSet);
        System.out.println("Returning watched movies list with size: " + result.size());
        return result;
    }

    public void addToFavorites(Long userId, Long movieId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User could not be found"));

        Movie movie = movieRepository.findByTmdbId(movieId)
            .orElseThrow(() -> new RuntimeException("Movie could not be found"));

        if (!user.getFavoriteMovies().contains(movie)) {
            user.addToFavoriteMovies(movie);
            userRepository.save(user);
        }
    }

    public void removeFromFavorites(Long userId, Long movieId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User could not be found"));

        Movie movie = movieRepository.findByTmdbId(movieId)
            .orElseThrow(() -> new RuntimeException("Movie could not be found"));

        if (user.getFavoriteMovies().contains(movie)) {
            user.removeFromFavoriteMovies(movie);
            userRepository.save(user);
            movieRepository.save(movie);
        }
    }

    public boolean isFavorite(Long userId, Long movieId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException(" User could not be found"));

        return user.getFavoriteMovies().stream()
            .anyMatch(movie -> movie.getTmdbId().equals(movieId));
    }

    public List<Movie> getFavoriteMovies(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User could not be found"));

        return new ArrayList<>(user.getFavoriteMovies());
    }

    public Map<String, Integer> calculateMovieTimeStats(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Set<Movie> watchedMovies = user.getWatchedMovies();
        int totalMinutes = 0;

        // İzlenen tüm filmlerin sürelerini topla
        for (Movie movie : watchedMovies) {
            if (movie.getRuntime() != null) {
                totalMinutes += movie.getRuntime();
            }
        }

        // Toplam dakikayı ay, gün ve saat olarak hesapla
        int months = totalMinutes / (30 * 24 * 60); // Aylık ortalama 30 gün
        int remainingMinutes = totalMinutes % (30 * 24 * 60);
        int days = remainingMinutes / (24 * 60);
        remainingMinutes = remainingMinutes % (24 * 60);
        int hours = remainingMinutes / 60;

        Map<String, Integer> stats = new HashMap<>();
        stats.put("months", months);
        stats.put("days", days);
        stats.put("hours", hours);

        return stats;
    }
}
