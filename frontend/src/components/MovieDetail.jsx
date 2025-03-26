import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const [hoveredRating, setHoveredRating] = useState(0);
    const [selectedRating, setSelectedRating] = useState(0);
    const [showSocialPage, setShowSocialPage] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isWatched, setIsWatched] = useState(false);

    useEffect(() => {
        if (movie?.tmdbId) {
            checkWatchlistStatus();
        }
    }, [movie]);

    const checkWatchlistStatus = async () => {
        try {
            if (!movie?.tmdbId) return;
            setIsLoading(true);
            const response = await axios.get(`/api/movies/${movie.tmdbId}/watchlist/check`);
            setIsInWatchlist(response.data.inWatchlist);
        } catch (error) {
            console.error('Watchlist durumu kontrol edilirken hata:', error);
            setIsInWatchlist(false);
        } finally {
            setIsLoading(false);
        }
    };

    if (!movie) return null;

    // Convert runtime to hours and minutes
    const formatRuntime = (minutes) => {
        if (!minutes) return '';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}s ${mins}dk`;
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
                console.error("tmdbId bulunamadı:", movie);
                return;
            }

            console.log("Movie data:", movie); // Debug için

            const movieData = {
                title: movie.title || movie.original_title,
                posterPath: movie.poster_path || movie.posterPath,
                releaseDate: movie.release_date || movie.releaseDate,
                overview: movie.overview,
                voteAverage: movie.vote_average || movie.voteAverage
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

    const handleMarkAsWatched = () => {
        setIsWatched(!isWatched);
        console.log("Movie watched status changed:", movie.title);
    };

    const handleRemoveFromWatchlist = async () => {
        try {
            if (!movie?.tmdbId) return;
            await axios.delete(`/api/movies/${movie.tmdbId}/watchlist`);
            setIsInWatchlist(false);
            onWatchlistUpdate?.(movie.tmdbId, false);
            window.location.reload(); // Sayfayı yenile
        } catch (error) {
            console.error('Watchlist\'ten çıkarılırken hata:', error);
        }
    };

    const handleActorClick = (actorName) => {
        const searchQuery = encodeURIComponent(actorName);
        window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
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
                        {isInWatchlist && (
                            <button 
                                className={`watched-button ${isWatched ? 'active' : ''}`}
                                onClick={handleMarkAsWatched}
                                title="Watched"
                            >
                                ✓
                            </button>
                        )}
                    </div>
                    <div className="movie-detail-info">
                        <h1>{movie.title}</h1>
                        <p className="original-title">{movie.original_title}</p>
                        <div className="movie-meta">
                            <span>{(movie.release_date || movie.releaseDate)?.split("-")[0]}</span>
                            <span>⭐ {movie.vote_average || movie.voteAverage}</span>
                            {movie.runtime && <span>⏱️ {formatRuntime(movie.runtime)}</span>}
                        </div>
                        <p className="overview">{movie.overview}</p>
                        
                        {/* Add providers section */}
                        {movie.providers && (
                            <div className="providers-section">
                                <h3>Available Platforms (Türkiye):</h3>
                                <div className="providers-list">
                                    {(!movie.providers.flatrate && !movie.providers.rent && !movie.providers.buy) ? (
                                        <div className="no-providers">
                                            <span className="sad-face">😔</span>
                                            <p>No platforms available in Türkiye.</p>
                                        </div>
                                    ) : (
                                        <>
                                            {movie.providers.flatrate && (
                                                <div className="provider-category">
                                                    <h4>Subs</h4>
                                                    <div className="provider-items">
                                                        {movie.providers.flatrate.map(provider => (
                                                            <div 
                                                                key={provider.provider_id} 
                                                                className="provider-item"
                                                                onClick={() => handleProviderClick(provider.provider_id)}
                                                                title={`${provider.provider_name}'de izle`}
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
                                                    <h4>Renting</h4>
                                                    <div className="provider-items">
                                                        {movie.providers.rent.map(provider => (
                                                            <div 
                                                                key={provider.provider_id} 
                                                                className="provider-item"
                                                                onClick={() => handleProviderClick(provider.provider_id)}
                                                                title={`${provider.provider_name}'de izle`}
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
                                                    <h4>Purchase</h4>
                                                    <div className="provider-items">
                                                        {movie.providers.buy.map(provider => (
                                                            <div 
                                                                key={provider.provider_id} 
                                                                className="provider-item"
                                                                onClick={() => handleProviderClick(provider.provider_id)}
                                                                title={`${provider.provider_name}'de izle`}
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
                                <h3>Cast:</h3>
                                <div className="cast-list">
                                    {movie.cast.map(actor => (
                                        <div 
                                            key={actor.id} 
                                            className="cast-item"
                                            onClick={() => handleActorClick(actor.name)}
                                            title={`Search for ${actor.name} on Google`}
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
                        {isInWatchlist ? (
                            <button 
                                className="detail-remove-button" 
                                onClick={handleRemoveFromWatchlist}
                            >
                                - REMOVE FROM WATCHLIST
                            </button>
                        ) : (
                            <button 
                                className="detail-add-button" 
                                onClick={handleAddToWatchlist}
                            >
                                + ADD TO WATCHLIST
                            </button>
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