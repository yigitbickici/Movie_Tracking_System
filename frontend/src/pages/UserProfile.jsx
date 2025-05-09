import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
    const { t, i18n } = useTranslation();
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
            setError(t('userProfile.error.generic'));
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
            setError(t('userProfile.error.followStatus'));
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
            setError(error.response?.data?.message || t('userProfile.error.follow'));
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

        // Dil parametresini ekleyelim
        const language = i18n.language === 'tr' ? 'tr-TR' : 'en-US';

        Promise.all([
            fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=84e605aa45ef84282ba934b9b2648dc5&language=${language}`),
            fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/credits?api_key=84e605aa45ef84282ba934b9b2648dc5&language=${language}`),
            fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/watch/providers?api_key=84e605aa45ef84282ba934b9b2648dc5`)
        ])
        .then(([detailsRes, creditsRes, providersRes]) =>
            Promise.all([detailsRes.json(), creditsRes.json(), providersRes.json()])
        )
        .then(([detailedMovie, credits, providers]) => {
            // Ülke kodunu dilinize göre belirleyin
            const countryCode = i18n.language === 'tr' ? 'TR' : 'US';
            
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
                providers: providers.results?.[countryCode] || {}
            });
        })
        .catch(error => console.error("Error fetching movie details:", error));
    };

    const extractYearFromDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        if (typeof dateStr !== 'string') return 'N/A';
        if (dateStr.length >= 4) return dateStr.substring(0, 4);
        return 'N/A';
    };

    const MoviePreview = ({ movie }) => {
        const [releaseYear, setReleaseYear] = useState('N/A');
        
        useEffect(() => {
            // Check if we already have release date
            if (movie.releaseDate || movie.release_date) {
                const year = extractYearFromDate(movie.releaseDate || movie.release_date);
                setReleaseYear(year);
                return;
            }
            
            // If not, fetch from TMDB API
            if (movie.tmdbId) {
                fetch(`https://api.themoviedb.org/3/movie/${movie.tmdbId}?api_key=84e605aa45ef84282ba934b9b2648dc5&language=en-TR`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.release_date) {
                            const year = extractYearFromDate(data.release_date);
                            setReleaseYear(year);
                        }
                    })
                    .catch(error => console.error('Error fetching movie details:', error));
            }
        }, [movie.tmdbId, movie.releaseDate, movie.release_date]);

        return (
            <div className="movie-preview" onClick={() => handleMovieClick(movie)}>
                <img
                    src={`https://image.tmdb.org/t/p/w200${movie.posterPath || movie.poster_path}`}
                    alt={movie.title}
                />
                <div className="movie-preview-info">
                    <h4>{movie.title}</h4>
                    <div className="movie-year-rating">
                        <p>{releaseYear}</p>
                        <span className="movie-star"><FaStar style={{ color: '#FFD700' }} /></span>
                    </div>
                </div>
            </div>
        );
    };

    const CommentCard = ({ comment }) => (
        <div className="comment-card">
            <div className="comment-movie-info">
                <img 
                    src={`https://image.tmdb.org/t/p/w92${comment.moviePoster}`} 
                    alt={comment.movieTitle}
                    className="comment-movie-poster"
                />
                <div className="comment-movie-details">
                    <h4>{comment.movieTitle}</h4>

                </div>
            </div>
            <p className="comment-text">{comment.comment}</p>
            <span className="comment-date">{new Date(comment.date).toLocaleDateString()}</span>
        </div>
    );

    const MovieSection = ({ title, movies, icon: Icon }) => {
        const [isModalOpen, setIsModalOpen] = useState(false);
        
        // Çevirileri ekleyelim
        let translatedTitle = title;
        if (title === "Favorites") {
            translatedTitle = t('userProfile.sections.favorites');
        } else if (title === "Watched Movies") {
            translatedTitle = t('userProfile.sections.watchedMovies');
        } else if (title === "Watchlist") {
            translatedTitle = t('userProfile.sections.watchlist');
        }
        
        // İzlenen filmleri watchlist'ten filtrele
        const filteredMovies = title === "Watchlist" 
            ? movies.filter(movie => !userProfile.watched.some(w => w.tmdbId === movie.tmdbId))
            : movies;
            
        const visibleMovies = filteredMovies.slice(0, 5);

        return (
            <div className="movies-section">
                <div className="section-header">
                    <h2>
                        <Icon className="section-icon" />
                        {translatedTitle}
                    </h2>
                    {filteredMovies.length > 5 && (
                        <button 
                            className="see-all-button" 
                            onClick={() => setIsModalOpen(true)}
                        >
                            {t('userProfile.buttons.seeAll')} <FaChevronRight />
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
                                    {translatedTitle}
                                </h2>
                                <button 
                                    className="close-button"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    ×
                                </button>
                            </div>
                            <div className="modal-movies-grid">
                                {filteredMovies.map(movie => (
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
        return <div className="loading">{t('userProfile.loading')}</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!userProfile) {
        return <div className="error">{t('userProfile.error.notFound')}</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-avatar">
                    {userProfile.avatar ? (
                        <img
                            src={getAvatarUrl(userProfile.avatar)}
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
                            <FaUserCheck /> {t('userProfile.buttons.following')}
                        </>
                    ) : (
                        <>
                            <FaUserPlus /> {t('userProfile.buttons.follow')}
                        </>
                    )}
                </button>
                <div className="profile-stats">
                    <div className="stat-item">
                        <div className="stat-value">{userProfile.stats.following}</div>
                        <div className="stat-label">{t('userProfile.stats.following')}</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{userProfile.stats.followers}</div>
                        <div className="stat-label">{t('userProfile.stats.follower')}</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{userProfile.stats.comments}</div>
                        <div className="stat-label">{t('userProfile.stats.comments')}</div>
                    </div>
                </div>
            </div>

            <div className="profile-content">
                <div className="stats-section">
                    <h2>{t('userProfile.stats.title')}</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h4>{t('userProfile.stats.moviesWatched')}</h4>
                            <div className="single-stat">{userProfile.stats.moviesWatched}</div>
                        </div>
                        {userProfile.stats.movieTime && (
                            <div className="stat-card">
                                <h4>{t('userProfile.stats.movieTime')}</h4>
                                <div className="time-stats">
                                    <div className="time-stat">
                                        <span>{userProfile.stats.movieTime.months}</span>
                                        <label>{t('userProfile.stats.months')}</label>
                                    </div>
                                    <div className="time-stat">
                                        <span>{userProfile.stats.movieTime.days}</span>
                                        <label>{t('userProfile.stats.days')}</label>
                                    </div>
                                    <div className="time-stat">
                                        <span>{userProfile.stats.movieTime.hours}</span>
                                        <label>{t('userProfile.stats.hours')}</label>
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
                            {t('userProfile.sections.comments')}
                        </h2>
                        {userProfile.comments.length > 3 && (
                            <button 
                                className="see-all-button" 
                                onClick={() => setShowAllComments(!showAllComments)}
                            >
                                {showAllComments ? t('userProfile.buttons.showLess') : t('userProfile.buttons.seeAll')} 
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
                                <p>{t('userProfile.emptyState.noComments')}</p>
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