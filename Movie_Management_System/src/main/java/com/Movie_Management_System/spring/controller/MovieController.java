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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        
        Movie movie = movieService.getMovieById(movieId)
            .orElseGet(() -> {
                Movie newMovie = new Movie();
                newMovie.setTmdbId(movieId);
                newMovie.setPosterPath((String) movieData.get("poster_path"));
                newMovie.setTitle((String) movieData.get("title"));
                newMovie.setReleaseDate((String) movieData.get("release_date"));
                newMovie.setOverview((String) movieData.get("overview"));
                newMovie.setVoteAverage(((Number) movieData.get("vote_average")).doubleValue());
                return movieService.saveMovie(newMovie);
            });

        movieService.addToWatchlist(user.getId(), movieId);
        return ResponseEntity.ok(Map.of("message", "Film watchlist'e eklendi"));
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
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        
        boolean inWatchlist = movieService.isInWatchlist(user.getId(), movieId);
        return ResponseEntity.ok(Map.of("inWatchlist", inWatchlist));
    }
} 