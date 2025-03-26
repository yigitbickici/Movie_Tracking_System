package com.Movie_Management_System.spring.controller;

import com.Movie_Management_System.spring.entities.User;
import com.Movie_Management_System.spring.entities.Movie;
import com.Movie_Management_System.spring.services.MovieService;
import com.Movie_Management_System.spring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "http://localhost:3000")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/{movieId}/watchlist")
    public ResponseEntity<?> addToWatchlist(
            @PathVariable Long movieId,
            @RequestBody Map<String, Object> movieData) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
            
            Movie movie = movieService.getMovieByTmdbId(movieId)
                .orElseGet(() -> {
                    Movie newMovie = new Movie();
                    newMovie.setTmdbId(movieId);
                    newMovie.setTitle((String) movieData.get("title"));
                    newMovie.setPosterPath((String) movieData.get("posterPath"));
                    newMovie.setReleaseDate((String) movieData.get("releaseDate"));
                    newMovie.setOverview((String) movieData.get("overview"));
                    newMovie.setVoteAverage(((Number) movieData.get("voteAverage")).doubleValue());
                    return movieService.saveMovie(newMovie);
                });

            movieService.addToWatchlist(user.getId(), movieId);
            return ResponseEntity.ok(Map.of("message", "Film watchlist'e eklendi"));
        } catch (Exception e) {
            e.printStackTrace(); // Debug için
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{movieId}/watchlist")
    public ResponseEntity<?> removeFromWatchlist(@PathVariable Long movieId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        
        movieService.removeFromWatchlist(user.getId(), movieId);
        return ResponseEntity.ok(Map.of("message", "Film watchlist'ten çıkarıldı"));
    }

    @GetMapping("/{movieId}/watchlist/check")
    public ResponseEntity<?> checkWatchlistStatus(@PathVariable Long movieId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("No User Found"));
        
        boolean inWatchlist = movieService.isInWatchlist(user.getId(), movieId);
        return ResponseEntity.ok(Map.of("inWatchlist", inWatchlist));
    }

    @PostMapping("/{movieId}/watched")
    public ResponseEntity<?> addToWatched(@PathVariable Long movieId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
            
            movieService.addToWatched(user.getId(), movieId);
            return ResponseEntity.ok(Map.of("message", "Film izlendi olarak işaretlendi"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{movieId}/watched")
    public ResponseEntity<?> removeFromWatched(@PathVariable Long movieId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        
        movieService.removeFromWatched(user.getId(), movieId);
        return ResponseEntity.ok(Map.of("message", "Film izlendi listesinden çıkarıldı"));
    }

    @GetMapping("/{movieId}/watched/check")
    public ResponseEntity<?> checkWatchedStatus(@PathVariable Long movieId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("No User Found"));
        
        boolean isWatched = movieService.isWatched(user.getId(), movieId);
        return ResponseEntity.ok(Map.of("isWatched", isWatched));
    }

    @GetMapping("/watchlist")
    public ResponseEntity<?> getWatchlist() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        
        List<Movie> watchlist = movieService.getWatchlist(user.getId());
        return ResponseEntity.ok(watchlist);
    }

    @GetMapping("/watched")
    public ResponseEntity<?> getWatchedMovies() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        
        List<Movie> watchedMovies = movieService.getWatchedMovies(user.getId());
        return ResponseEntity.ok(watchedMovies);
    }
} 