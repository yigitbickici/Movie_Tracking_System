import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaChevronRight, FaUserPlus, FaUserCheck, FaComment, FaStar, FaHeart, FaEye, FaList } from 'react-icons/fa';
import './UserProfile.css';
import MovieDetail from '../components/MovieDetail';
import axios from '../services/axiosConfig';

// Helper function to construct full avatar URL
const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return '';
    // Check if the path is already a full URL (e.g., from external provider)
    if (avatarPath.startsWith('http')) return avatarPath;
    // Assuming backend serves avatars at http://localhost:8080
    return `http://localhost:8080${avatarPath}`;
};

const UserProfile = () => {
    const { username } = useParams();
    const [isFollowing, setIsFollowing] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [showAllComments, setShowAllComments] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserProfile();
        checkFollowStatus();
    }, [username]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/users/${username}`);
            setUserProfile(response.data);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            setError('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const checkFollowStatus = async () => {
        try {
            const response = await axios.get(`/api/users/${username}/follow-status`);
            setIsFollowing(response.data.isFollowing);
        } catch (error) {
            console.error('Error checking follow status:', error);
            setError('Failed to check follow status');
        }
    };

    const handleFollowToggle = async () => {
        try {
            setError(null);
            const response = await axios.post(`/api/users/${username}/${isFollowing ? 'unfollow' : 'follow'}`);
            setIsFollowing(response.data.isFollowing);
            await checkFollowStatus();
        } catch (error) {
            console.error('Error toggling follow:', error);
            setError(error.response?.data?.message || 'An error occurred while updating follow status');
            await checkFollowStatus();
        }
    };

    const handleMovieClick = (movie) => {
        // Ensure movie object has tmdbId
        const tmdbId = movie.tmdbId || movie.id;
        if (!tmdbId) {
            console.error("Movie object missing tmdbId:", movie);
            return;
        }

        Promise.all([
            fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=84e605aa45ef84282ba934b9b2648dc5&language=en-TR`),
            fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/credits?api_key=84e605aa45ef84282ba934b9b2648dc5&language=en-TR`),
            fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/watch/providers?api_key=84e605aa45ef84282ba934b9b2648dc5`)
        ])
        .then(([detailsRes, creditsRes, providersRes]) =>
            Promise.all([detailsRes.json(), creditsRes.json(), providersRes.json()])
        )
        .then(([detailedMovie, credits, providers]) => {
            setSelectedMovie({
                ...movie, // Keep original movie data
                ...detailedMovie, // Overwrite with detailed data
                id: tmdbId, // Ensure id is the tmdbId
                tmdbId: tmdbId, // Ensure tmdbId is present
                poster_path: detailedMovie.poster_path || movie.posterPath, // Use detailed poster path or fallback
                release_date: detailedMovie.release_date || movie.releaseDate, // Use detailed release date or fallback
                vote_average: detailedMovie.vote_average || movie.voteAverage, // Use detailed vote average or fallback
                overview: detailedMovie.overview,
                original_title: detailedMovie.original_title,
                runtime: detailedMovie.runtime,
                cast: credits.cast?.slice(0, 5),
                providers: providers.results?.TR || {}
            });
        })
        .catch(error => console.error("Error fetching movie details:", error));
    };

    const MoviePreview = ({ movie }) => (
        <div className="movie-preview" onClick={() => handleMovieClick(movie)}>
            <img
                src={`https://image.tmdb.org/t/p/w200${movie.posterPath || movie.poster_path}`} // Use posterPath from backend or poster_path if available
                alt={movie.title}
            />
            <div className="movie-preview-info">
                <h4>{movie.title}</h4>
                <p>{(movie.releaseDate || movie.release_date)?.split('-')[0]}</p> // Use releaseDate or release_date
            </div>
        </div>
    );

    const CommentCard = ({ comment }) => (
        <div className="comment-card" onClick={() => handleMovieClick({ id: comment.movieId })}>
            <div className="comment-movie-info">
                <img 
                    src={`https://image.tmdb.org/t/p/w92${comment.moviePoster}`} 
                    alt={comment.movieTitle}
                    className="comment-movie-poster"
                />
                <div className="comment-movie-details">
                    <h4>{comment.movieTitle}</h4>
                    <div className="comment-rating">
                        <FaStar className="star-icon" />
                        <span>{comment.rating}</span>
                    </div>
                </div>
            </div>
            <p className="comment-text">{comment.comment}</p>
            <span className="comment-date">{new Date(comment.date).toLocaleDateString()}</span>
        </div>
    );

    const MovieSection = ({ title, movies, icon: Icon }) => {
        const [isModalOpen, setIsModalOpen] = useState(false);
        const visibleMovies = movies.slice(0, 5);

        return (
            <div className="movies-section">
                <div className="section-header">
                    <h2>
                        <Icon className="section-icon" />
                        {title}
                    </h2>
                    {movies.length > 5 && (
                        <button 
                            className="see-all-button" 
                            onClick={() => setIsModalOpen(true)}
                        >
                            See All <FaChevronRight />
                        </button>
                    )}
                </div>
                
                <div className="movies-grid">
                    {visibleMovies.map(movie => (
                        <MoviePreview key={movie.id} movie={movie} />
                    ))}
                </div>

                {isModalOpen && (
                    <div className="movie-modal">
                        <div className="movie-modal-content">
                            <div className="modal-header">
                                <h2>
                                    <Icon className="section-icon" />
                                    {title}
                                </h2>
                                <button 
                                    className="close-button"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    ×
                                </button>
                            </div>
                            <div className="modal-movies-grid">
                                {movies.map(movie => (
                                    <MoviePreview key={movie.id} movie={movie} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!userProfile) {
        return <div className="error">Profile not found</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-avatar">
                    {userProfile.avatar ? (
                        <img
                            src={getAvatarUrl(userProfile.avatar)} // Use helper function
                            alt={userProfile.username}
                            className="profile-avatar-image"
                        />
                    ) : (
                        <span>{userProfile.username.substring(0, 2).toUpperCase()}</span>
                    )}
                </div>
                <h1 className="profile-username">{userProfile.username}</h1>
                <button 
                    className={`follow-button ${isFollowing ? 'following' : ''}`}
                    onClick={handleFollowToggle}
                >
                    {isFollowing ? (
                        <>
                            <FaUserCheck /> Following
                        </>
                    ) : (
                        <>
                            <FaUserPlus /> Follow
                        </>
                    )}
                </button>
                <div className="profile-stats">
                    <div className="stat-item">
                        <div className="stat-value">{userProfile.stats.following}</div>
                        <div className="stat-label">following</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{userProfile.stats.followers}</div>
                        <div className="stat-label">follower</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{userProfile.stats.comments}</div>
                        <div className="stat-label">comments</div>
                    </div>
                </div>
            </div>

            <div className="profile-content">
                <div className="stats-section">
                    <h2>Stats</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h4>Movies watched</h4>
                            <div className="single-stat">{userProfile.stats.moviesWatched}</div>
                        </div>
                        {userProfile.stats.movieTime && (
                            <div className="stat-card">
                                <h4>Movie time</h4>
                                <div className="time-stats">
                                    <div className="time-stat">
                                        <span>{userProfile.stats.movieTime.months}</span>
                                        <label>MONTHS</label>
                                    </div>
                                    <div className="time-stat">
                                        <span>{userProfile.stats.movieTime.days}</span>
                                        <label>DAYS</label>
                                    </div>
                                    <div className="time-stat">
                                        <span>{userProfile.stats.movieTime.hours}</span>
                                        <label>HOURS</label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <MovieSection 
                    title="Favorites"
                    movies={userProfile.favorites}
                    icon={FaHeart}
                />

                <MovieSection 
                    title="Watched Movies"
                    movies={userProfile.watched}
                    icon={FaEye}
                />

                <MovieSection 
                    title="Watchlist"
                    movies={userProfile.watchlist}
                    icon={FaList}
                />

                <div className="comments-section">
                    <div className="section-header">
                        <h2>
                            <FaComment className="section-icon" />
                            Comments
                        </h2>
                        {userProfile.comments.length > 3 && (
                            <button 
                                className="see-all-button" 
                                onClick={() => setShowAllComments(!showAllComments)}
                            >
                                {showAllComments ? 'Show Less' : 'See All'} 
                                <FaChevronRight className={showAllComments ? 'rotate-icon' : ''} />
                            </button>
                        )}
                    </div>
                    
                    <div className="comments-container">
                        {userProfile.comments.length > 0 ? (
                            <div className="comments-grid">
                                {(showAllComments ? userProfile.comments : userProfile.comments.slice(0, 3)).map(comment => (
                                    <CommentCard key={comment.id} comment={comment} />
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>No comments yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {selectedMovie && (
                <MovieDetail 
                    movie={selectedMovie} 
                    onClose={() => setSelectedMovie(null)}
                    isInList={true}
                />
            )}

            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default UserProfile; 