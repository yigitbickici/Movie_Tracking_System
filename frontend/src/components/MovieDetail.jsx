import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from '../services/axiosConfig';
import './MovieDetail.css';
import MovieSocialPage from './MovieSocialPage';

// To route user to the related platform
const PLATFORM_URLS = {
    8: "https://www.netflix.com/tr/", // Netflix
    119: "https://www.primevideo.com/tr/", // Amazon Prime
    337: "https://www.disneyplus.com/tr-tr", // Disney+
    531: "https://www.blutv.com/", // BluTV
    1870: "https://www.exxen.com/", // EXXEN
    2: "https://tv.apple.com", // Apple TV
    3: "https://play.google.com/store/movies?hl=tr", // Google Play Movies
    11: "https://mubi.com/tr/tr/", // MUBI
};

const MovieDetail = ({ movie, onClose, onWatchlistUpdate }) => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [hoveredRating, setHoveredRating] = useState(0);
    const [selectedRating, setSelectedRating] = useState(0);
    const [showSocialPage, setShowSocialPage] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isWatched, setIsWatched] = useState(false);
    const [userType, setUserType] = useState(null);

    useEffect(() => {
        if (movie?.tmdbId) {
            checkWatchlistStatus();
            checkWatchedStatus();
            checkFavoriteStatus();
            updateMovieRuntime();
            checkUserType();
        }
    }, [movie]);

    const checkUserType = () => {
        const type = localStorage.getItem('userType');
        console.log('User Type:', type); // Debug için
        setUserType(type);
    };

    const checkWatchlistStatus = async () => {
        try {
            if (!movie?.tmdbId) return;
            setIsLoading(true);
            const response = await axios.get(`/api/movies/${movie.tmdbId}/watchlist/check`);
            setIsInWatchlist(response.data.inWatchlist);
        } catch (error) {
            console.error('Error checking watchlist status:', error);
            setIsInWatchlist(false);
        } finally {
            setIsLoading(false);
        }
    };

    const checkWatchedStatus = async () => {
        try {
            const response = await axios.get(`/api/movies/${movie.tmdbId}/watched/check`);
            setIsWatched(response.data.isWatched);
        } catch (error) {
            console.error("An error occurred while checking the viewing status:", error);
        }
    };

    const checkFavoriteStatus = async () => {
        try {
            const response = await axios.get(`/api/movies/${movie.tmdbId}/favorites/check`);
            setIsFavorite(response.data.isFavorite);
        } catch (error) {
            console.error("Error checking favorite status:", error);
        }
    };

    const updateMovieRuntime = async () => {
        try {
            if (!movie?.tmdbId || !movie.runtime) return;
            
            await axios.put(`/api/movies/${movie.tmdbId}/runtime`, {
                runtime: movie.runtime
            });
        } catch (error) {
            console.error("An error occurred while updating the movie duration:", error);
        }
    };

    if (!movie) return null;

    // Convert runtime to hours and minutes
    const formatRuntime = (minutes) => {
        if (!minutes) return '';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}${t('movieDetail.runtime').split(' ')[0]} ${mins}${t('movieDetail.runtime').split(' ')[1]}`;
    };

    const handleProviderClick = (providerId) => {
        //console.log(providerId);
        const url = PLATFORM_URLS[providerId];
        if (url) {
            window.open(url, '_blank');
        }
    };

    const handleRatingChange = (rating) => {
        setSelectedRating(rating);
        console.log("New rating:", rating);
    };

    const handleSeePostsClick = () => {
        navigate(`/movies/${movie.tmdbId}/social`);
    };

    const handleAddToWatchlist = async () => {
        try {
            if (!movie?.tmdbId) {
                console.error("tmdbId is not found:", movie);
                return;
            }

            console.log("Movie data:", movie); // Debug için

            const movieData = {
                title: movie.title || movie.original_title,
                posterPath: movie.poster_path || movie.posterPath,
                releaseDate: movie.release_date || movie.releaseDate,
                overview: movie.overview,
                voteAverage: movie.vote_average || movie.voteAverage,
                runtime: movie.runtime || 0
            };

            console.log("Sending movie data:", movieData); // Debug için
            console.log("tmdbId:", movie.tmdbId); // Debug için

            const response = await axios.post(`/api/movies/${movie.tmdbId}/watchlist`, movieData);
            console.log("Response:", response.data); // Debug için

            setIsInWatchlist(true);
            if (onWatchlistUpdate) {
                onWatchlistUpdate(movie.tmdbId, true);
            }
        } catch (error) {
            console.error('Watchlist\'e eklenirken hata:', error);
            console.error('Error details:', error.response?.data); // Debug için
        }
    };

    const handleWatchedToggle = async () => {
        if (!movie?.tmdbId) {
            console.error("tmdbId is not found:", movie);
            return;
        }

        setIsLoading(true);
        try {
            if (isWatched) {
                await axios.delete(`/api/movies/${movie.tmdbId}/watched`);
                setIsWatched(false);
            } else {
                await axios.post(`/api/movies/${movie.tmdbId}/watched`);
                setIsWatched(true);
            }
        } catch (error) {
            console.error("An error occurred while updating the viewing status:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveFromWatchlist = async () => {
        try {
            if (!movie?.tmdbId) return;
            await axios.delete(`/api/movies/${movie.tmdbId}/watchlist`);
            setIsInWatchlist(false);
            if (onWatchlistUpdate) {
                onWatchlistUpdate(movie.tmdbId, false);
            }
            window.location.reload(); // Sayfayı yenile
        } catch (error) {
            console.error('Watchlist\'ten çıkarılırken hata:', error);
        }
    };

    const handleActorClick = (actorName) => {
        const searchQuery = encodeURIComponent(actorName);
        window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
    };

    const handleFavoriteToggle = async () => {
        if (!movie?.tmdbId) {
            console.error("tmdbId is not found:", movie);
            return;
        }

        setIsLoading(true);
        try {
            if (isFavorite) {
                await axios.delete(`/api/movies/${movie.tmdbId}/favorites`);
                setIsFavorite(false);
                // Sayfayı yenile
                window.location.reload();
            } else {
                await axios.post(`/api/movies/${movie.tmdbId}/favorites`);
                setIsFavorite(true);
                // Sayfayı yenile
                window.location.reload();
            }
        } catch (error) {
            console.error("An error occurred while updating the favorite status:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="movie-detail-overlay">
            <div className="movie-detail-content">
                <button className="close-button" onClick={onClose}>×</button>
                <div className="movie-detail-header">
                    <div className="poster-container">
                        <img 
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path || movie.posterPath}`} 
                            alt={movie.title} 
                            className="detail-poster"
                        />
                        {(isInWatchlist || isWatched) &&(
                            <button
                                className={`watched-button ${isWatched ? 'active' : ''}`}
                                onClick={handleWatchedToggle}
                                disabled={isLoading}
                                title={isWatched ? t('movieDetail.markAsUnwatched') : t('movieDetail.markAsWatched')}
                            >
                                ✓
                            </button>
                        )}
                    </div>
                    <div className="movie-detail-info">
                        <h1>{movie.title}</h1>
                        <p className="original-title">{t('movieDetail.originalTitle')}: {movie.original_title}</p>
                        <div className="movie-meta">
                            <span>{(movie.release_date || movie.releaseDate)?.split("-")[0]}</span>
                            <span>⭐ {movie.vote_average || movie.voteAverage}</span>
                            {movie.runtime && <span>⏱️ {formatRuntime(movie.runtime)}</span>}
                            <button 
                                className={`favorite-button ${isFavorite ? 'active' : ''}`}
                                onClick={handleFavoriteToggle}
                                disabled={isLoading}
                            >
                                ❤️
                            </button>
                        </div>
                        <p className="overview">{movie.overview}</p>
                        
                        {/* Add providers section */}
                        {movie.providers && (
                            <div className="providers-section">
                                <h3>{t('movieDetail.platforms.title')}</h3>
                                <div className="providers-list">
                                    {(!movie.providers.flatrate && !movie.providers.rent && !movie.providers.buy) ? (
                                        <div className="no-providers">
                                            <span className="sad-face">😔</span>
                                            <p>{t('movieDetail.platforms.noProviders')}</p>
                                        </div>
                                    ) : (
                                        <>
                                            {movie.providers.flatrate && (
                                                <div className="provider-category">
                                                    <h4>{t('movieDetail.platforms.subs')}</h4>
                                                    <div className="provider-items">
                                                        {movie.providers.flatrate.map(provider => (
                                                            <div 
                                                                key={provider.provider_id} 
                                                                className="provider-item"
                                                                onClick={() => handleProviderClick(provider.provider_id)}
                                                                title={`${t('movieDetail.platforms.watchOn')} ${provider.provider_name}`}
                                                            >
                                                                <img 
                                                                    src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                                                    alt={provider.provider_name}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {movie.providers.rent && (
                                                <div className="provider-category">
                                                    <h4>{t('movieDetail.platforms.renting')}</h4>
                                                    <div className="provider-items">
                                                        {movie.providers.rent.map(provider => (
                                                            <div 
                                                                key={provider.provider_id} 
                                                                className="provider-item"
                                                                onClick={() => handleProviderClick(provider.provider_id)}
                                                                title={`${t('movieDetail.platforms.watchOn')} ${provider.provider_name}`}
                                                            >
                                                                <img 
                                                                    src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                                                    alt={provider.provider_name}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {movie.providers.buy && (
                                                <div className="provider-category">
                                                    <h4>{t('movieDetail.platforms.purchase')}</h4>
                                                    <div className="provider-items">
                                                        {movie.providers.buy.map(provider => (
                                                            <div 
                                                                key={provider.provider_id} 
                                                                className="provider-item"
                                                                onClick={() => handleProviderClick(provider.provider_id)}
                                                                title={`${t('movieDetail.platforms.watchOn')} ${provider.provider_name}`}
                                                            >
                                                                <img 
                                                                    src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                                                    alt={provider.provider_name}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Cast section */}
                        {movie.cast && (
                            <div className="cast-section">
                                <h3>{t('movieDetail.cast.title')}</h3>
                                <div className="cast-list">
                                    {movie.cast.map(actor => (
                                        <div 
                                            key={actor.id} 
                                            className="cast-item"
                                            onClick={() => handleActorClick(actor.name)}
                                            title={`${t('movieDetail.cast.searchFor')} ${actor.name}`}
                                        >
                                            {actor.profile_path ? (
                                                <img 
                                                    src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                                    alt={actor.name}
                                                    className="cast-photo"
                                                />
                                            ) : (
                                                <div className="cast-photo-placeholder">
                                                    👤
                                                </div>
                                            )}
                                            <p className="cast-name">{actor.name}</p>
                                            <p className="cast-character">{actor.character}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Watch status section */}
                        {userType === 'admin' || userType === 'editor' ? (
                            <div className="user-interaction">
                                <button 
                                    className="see-posts-button"
                                    onClick={handleSeePostsClick}
                                >
                                    {t('movieDetail.actions.seeDiscussions')}
                                </button>
                            </div>
                        ) : (
                            isWatched ? (
                                <div className="user-interaction">
                                    <div className="rating-section">
                                        <h4>{t('movieDetail.actions.rateMovie')}</h4>
                                        <div className="star-rating">
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                                                <button
                                                    key={star}
                                                    className={`star-button ${star <= selectedRating ? 'active' : ''}`}
                                                    onClick={() => handleRatingChange(star)}
                                                >
                                                    ★
                                                </button>
                                            ))}
                                            <span className="rating-number">{selectedRating}/10</span>
                                        </div>
                                    </div>
                                    <div className="interaction-buttons">
                                        <button 
                                            className="see-posts-button"
                                            onClick={handleSeePostsClick}
                                        >
                                            {t('movieDetail.actions.seeAllPosts')}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                isInWatchlist ? (
                                    <div className="user-interaction">
                                        <button 
                                            className="remove-from-watchlist-button"
                                            onClick={handleRemoveFromWatchlist}
                                            disabled={isLoading}
                                        >
                                            {t('movieDetail.actions.removeFromWatchlist')}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="user-interaction">
                                        <button 
                                            className="add-to-watchlist-button"
                                            onClick={handleAddToWatchlist}
                                            disabled={isLoading}
                                        >
                                            {t('movieDetail.actions.addToWatchlist')}
                                        </button>
                                    </div>
                                )
                            )
                        )}
                    </div>
                </div>
            </div>
            
            {showSocialPage && (
                <MovieSocialPage 
                    movie={movie} 
                    onClose={() => setShowSocialPage(false)}
                />
            )}
        </div>
    );
};

export default MovieDetail;