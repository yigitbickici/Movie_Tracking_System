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
@CrossOrigin(origins = "http://moviary.com")
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
                    newMovie.setRuntime(((Number) movieData.get("runtime")).intValue());
                    return movieService.saveMovie(newMovie);
                });

            movieService.addToWatchlist(user.getId(), movie.getTmdbId());
            return ResponseEntity.ok(Map.of("message", "Film watchlist'e eklendi"));
        } catch (Exception e) {
            e.printStackTrace();
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
    public ResponseEntity<?> addToWatched(
            @PathVariable Long movieId,
            @RequestBody(required = false) Map<String, Object> movieData) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
            
            Movie movie = movieService.getMovieByTmdbId(movieId)
                .orElseGet(() -> {
                    if (movieData == null) {
                        throw new RuntimeException("Movie data is required for new movies");
                    }
                    Movie newMovie = new Movie();
                    newMovie.setTmdbId(movieId);
                    newMovie.setTitle((String) movieData.get("title"));
                    newMovie.setPosterPath((String) movieData.get("posterPath"));
                    newMovie.setReleaseDate((String) movieData.get("releaseDate"));
                    newMovie.setOverview((String) movieData.get("overview"));
                    newMovie.setVoteAverage(((Number) movieData.get("voteAverage")).doubleValue());
                    newMovie.setRuntime(((Number) movieData.get("runtime")).intValue());
                    return movieService.saveMovie(newMovie);
                });

            movieService.addToWatched(user.getId(), movie.getTmdbId());
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
        System.out.println("Watched movies for user " + username + ": " + watchedMovies.size());
        System.out.println("Watched movies content: " + watchedMovies);
        return ResponseEntity.ok(watchedMovies);
    }

    @PostMapping("/{movieId}/favorites")
    public ResponseEntity<?> addToFavorites(@PathVariable Long movieId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
            
            movieService.addToFavorites(user.getId(), movieId);
            return ResponseEntity.ok(Map.of("message", "Film favorilere eklendi"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{movieId}/favorites")
    public ResponseEntity<?> removeFromFavorites(@PathVariable Long movieId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        
        movieService.removeFromFavorites(user.getId(), movieId);
        return ResponseEntity.ok(Map.of("message", "Film favorilerden çıkarıldı"));
    }

    @GetMapping("/{movieId}/favorites/check")
    public ResponseEntity<?> checkFavoriteStatus(@PathVariable Long movieId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("No User Found"));
        
        boolean isFavorite = movieService.isFavorite(user.getId(), movieId);
        return ResponseEntity.ok(Map.of("isFavorite", isFavorite));
    }

    @GetMapping("/favorites")
    public ResponseEntity<?> getFavoriteMovies() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        
        List<Movie> favoriteMovies = movieService.getFavoriteMovies(user.getId());
        return ResponseEntity.ok(favoriteMovies);
    }

    @GetMapping("/stats/movietime")
    public ResponseEntity<?> getMovieTimeStats() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        
        Map<String, Integer> stats = movieService.calculateMovieTimeStats(user.getId());
        return ResponseEntity.ok(stats);
    }

    @PutMapping("/{movieId}/runtime")
    public ResponseEntity<?> updateMovieRuntime(
            @PathVariable Long movieId,
            @RequestBody Map<String, Object> movieData) {
        try {
            Movie movie = movieService.getMovieByTmdbId(movieId)
                .orElseThrow(() -> new RuntimeException("Film bulunamadı"));
            
            movie.setRuntime(((Number) movieData.get("runtime")).intValue());
            movieService.saveMovie(movie);
            
            return ResponseEntity.ok(Map.of("message", "Film süresi güncellendi"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
} 