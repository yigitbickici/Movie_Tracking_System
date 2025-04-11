package com.Movie_Management_System.spring.services;

import com.Movie_Management_System.spring.entities.User;
import com.Movie_Management_System.spring.payload.response.ProfileResponse;
import com.Movie_Management_System.spring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public ProfileResponse getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        return createProfileResponse(user);
    }

    @Transactional
    public ProfileResponse getUserProfileByUsername(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        return createProfileResponse(user);
    }

    @Transactional
    public void followUser(Long followerId, Long followedId) {
        User follower = userRepository.findById(followerId)
            .orElseThrow(() -> new RuntimeException("Follower not found"));
        User followed = userRepository.findById(followedId)
            .orElseThrow(() -> new RuntimeException("Followed user not found"));

        follower.followUser(followed);
        userRepository.save(follower);
        userRepository.save(followed);
    }

    @Transactional
    public void unfollowUser(Long followerId, Long followedId) {
        User follower = userRepository.findById(followerId)
            .orElseThrow(() -> new RuntimeException("Follower not found"));
        User followed = userRepository.findById(followedId)
            .orElseThrow(() -> new RuntimeException("Followed user not found"));

        follower.unfollowUser(followed);
        userRepository.save(follower);
        userRepository.save(followed);
    }

    private ProfileResponse createProfileResponse(User user) {
        ProfileResponse response = new ProfileResponse();
        response.setUsername(user.getUsername());
        response.setAvatar(user.getAvatar());

        // Stats - boş değerlerle başlat
        ProfileResponse.ProfileStats stats = new ProfileResponse.ProfileStats();
        stats.setFollowing(user.getFollowing() != null ? user.getFollowing().size() : 0);
        stats.setFollowers(user.getFollowers() != null ? user.getFollowers().size() : 0);
        stats.setComments(user.getComments() != null ? user.getComments().size() : 0);
        stats.setMoviesWatched(user.getWatchedMovies() != null ? user.getWatchedMovies().size() : 0);

        // Movie Time - varsayılan değerlerle başlat
        ProfileResponse.ProfileStats.MovieTime movieTime = new ProfileResponse.ProfileStats.MovieTime();
        movieTime.setMonths(0);
        movieTime.setDays(0);
        movieTime.setHours(0);
        stats.setMovieTime(movieTime);

        response.setStats(stats);

        // Boş listelerle başlat
        response.setFavorites(user.getFavoriteMovies() != null ? 
            user.getFavoriteMovies().stream()
                .map(movie -> {
                    ProfileResponse.MovieDTO dto = new ProfileResponse.MovieDTO();
                    dto.setId(movie.getId());
                    dto.setTmdbId(movie.getTmdbId());
                    dto.setTitle(movie.getTitle());
                    dto.setPosterPath(movie.getPosterPath());
                    dto.setReleaseDate(movie.getReleaseDate());
                    return dto;
                })
                .collect(Collectors.toList()) : 
            new ArrayList<>());

        response.setWatched(user.getWatchedMovies() != null ? 
            user.getWatchedMovies().stream()
                .map(movie -> {
                    ProfileResponse.MovieDTO dto = new ProfileResponse.MovieDTO();
                    dto.setId(movie.getTmdbId());
                    dto.setTmdbId(movie.getTmdbId());
                    dto.setTitle(movie.getTitle());
                    dto.setPosterPath(movie.getPosterPath());
                    dto.setReleaseDate(movie.getReleaseDate());
                    return dto;
                })
                .collect(Collectors.toList()) : 
            new ArrayList<>());

        response.setWatchlist(user.getWatchlist() != null ? 
            user.getWatchlist().stream()
                .map(movie -> {
                    ProfileResponse.MovieDTO dto = new ProfileResponse.MovieDTO();
                    dto.setId(movie.getTmdbId());
                    dto.setTmdbId(movie.getTmdbId());
                    dto.setTitle(movie.getTitle());
                    dto.setPosterPath(movie.getPosterPath());
                    dto.setReleaseDate(movie.getReleaseDate());
                    return dto;
                })
                .collect(Collectors.toList()) : 
            new ArrayList<>());

        response.setComments(user.getComments() != null ? 
            user.getComments().stream()
                .map(comment -> {
                    ProfileResponse.CommentDTO dto = new ProfileResponse.CommentDTO();
                    dto.setId(comment.getId());
                    dto.setMovieId(comment.getPost().getMovie().getId());
                    dto.setMovieTitle(comment.getPost().getMovie().getTitle());
                    dto.setMoviePoster(comment.getPost().getMovie().getPosterPath());
                    dto.setComment(comment.getContent());
                    dto.setRating(comment.getRating());
                    dto.setDate(comment.getCreatedAt().toString());
                    return dto;
                })
                .collect(Collectors.toList()) : 
            new ArrayList<>());

        response.setFollowers(user.getFollowers() != null ? 
            user.getFollowers().stream()
                .map(follower -> {
                    ProfileResponse.UserDTO dto = new ProfileResponse.UserDTO();
                    dto.setId(follower.getId());
                    dto.setUsername(follower.getUsername());
                    dto.setMovieCount(follower.getWatchedMovies() != null ? follower.getWatchedMovies().size() : 0);
                    dto.setFollowing(true);
                    return dto;
                })
                .collect(Collectors.toList()) : 
            new ArrayList<>());

        response.setFollowing(user.getFollowing() != null ? 
            user.getFollowing().stream()
                .map(following -> {
                    ProfileResponse.UserDTO dto = new ProfileResponse.UserDTO();
                    dto.setId(following.getId());
                    dto.setUsername(following.getUsername());
                    dto.setMovieCount(following.getWatchedMovies() != null ? following.getWatchedMovies().size() : 0);
                    dto.setFollowing(true);
                    return dto;
                })
                .collect(Collectors.toList()) : 
            new ArrayList<>());

        return response;
    }
} 