import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const MovieDetail = ({ movie, onClose }) => {
    const navigate = useNavigate();
    const [hoveredRating, setHoveredRating] = useState(0);
    const [selectedRating, setSelectedRating] = useState(0);
    const [showSocialPage, setShowSocialPage] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [isWatched, setIsWatched] = useState(false);

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
        navigate(`/movies/${movie.id}/social`);
    };

    const handleAddToWatchlist = () => {
        setIsInWatchlist(true);
        console.log("Film izleme listesine eklendi:", movie.title);
    };

    const handleMarkAsWatched = () => {
        setIsWatched(!isWatched);
        console.log("Film izlendi durumu değiştirildi:", movie.title);
    };

    const handleRemoveFromList = () => {
        setIsInWatchlist(false);
        setIsWatched(false);
        console.log("Film listeden kaldırıldı:", movie.title);
    };

    return (
        <div className="movie-detail-overlay">
            <div className="movie-detail-content">
                <button className="close-button" onClick={onClose}>×</button>
                <div className="movie-detail-header">
                    <div className="poster-container">
                        <img 
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                            alt={movie.title} 
                            className="detail-poster"
                        />
                        {isInWatchlist && (
                            <button 
                                className={`watched-button ${isWatched ? 'active' : ''}`}
                                onClick={handleMarkAsWatched}
                                title="İzledim olarak işaretle"
                            >
                                ✓
                            </button>
                        )}
                    </div>
                    <div className="movie-detail-info">
                        <h1>{movie.title}</h1>
                        <p className="original-title">{movie.original_title}</p>
                        <div className="movie-meta">
                            <span>{movie.release_date.split("-")[0]}</span>
                            <span>⭐ {movie.vote_average}</span>
                            {movie.runtime && <span>⏱️ {formatRuntime(movie.runtime)}</span>}
                        </div>
                        <p className="overview">{movie.overview}</p>
                        
                        {/* Add providers section */}
                        {movie.providers && (
                            <div className="providers-section">
                                <h3>Mevcut Platformlar(Türkiye):</h3>
                                <div className="providers-list">
                                    {(!movie.providers.flatrate && !movie.providers.rent && !movie.providers.buy) ? (
                                        <div className="no-providers">
                                            <span className="sad-face">😔</span>
                                            <p>Henüz Türkiye'de izleme seçeneği mevcut değil.</p>
                                        </div>
                                    ) : (
                                        <>
                                            {movie.providers.flatrate && (
                                                <div className="provider-category">
                                                    <h4>Abonelik</h4>
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
                                                    <h4>Kiralama</h4>
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
                                                    <h4>Satın Alma</h4>
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
                                <h3>Oyuncular:</h3>
                                <div className="cast-list">
                                    {movie.cast.map(actor => (
                                        <div key={actor.id} className="cast-item">
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
                        {!isInWatchlist ? (
                            <button 
                                className="detail-add-button" 
                                onClick={handleAddToWatchlist}
                            >
                                + ADD TO WATCHLIST
                            </button>
                        ) : !isWatched ? (
                            <button 
                                className="detail-remove-button" 
                                onClick={handleRemoveFromList}
                            >
                                - REMOVE FROM LIST
                            </button>
                        ) : (
                            <div className="user-interaction">
                                <div className="rating-section">
                                    <h4>Rate</h4>
                                    <div className="star-rating">
                                        {[...Array(10)].map((_, index) => {
                                            const ratingValue = index + 1;
                                            return (
                                                <button
                                                    type="button"
                                                    key={ratingValue}
                                                    className={`star-button ${
                                                        ratingValue <= (hoveredRating || selectedRating) 
                                                            ? 'active' 
                                                            : ''
                                                    }`}
                                                    onClick={() => handleRatingChange(ratingValue)}
                                                    onMouseEnter={() => setHoveredRating(ratingValue)}
                                                    onMouseLeave={() => setHoveredRating(0)}
                                                >
                                                    ★
                                                </button>
                                            );
                                        })}
                                        {selectedRating > 0 && (
                                            <span className="rating-number">{selectedRating}/10</span>
                                        )}
                                    </div>
                                </div>
                                <div className="interaction-buttons">
                                    <button 
                                        className={`favorite-button ${isFavorite ? 'active' : ''}`}
                                        onClick={() => setIsFavorite(!isFavorite)}
                                    >
                                        ♥
                                    </button>
                                    <button 
                                        className="see-posts-button"
                                        onClick={handleSeePostsClick}
                                    >
                                        Join Discussion
                                    </button>
                                </div>
                            </div>
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