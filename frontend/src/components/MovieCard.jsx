import React from "react";
import { useTranslation } from 'react-i18next';
import './MovieCard.css';

const MovieCard = ({ movie, onClick, isWatchlist, isWatched, onWatchedToggle, isFavorite, onFavoriteToggle, isGridView }) => {
    const { t } = useTranslation();
    
    // Liste görünümü için
    if (!isGridView) {
        return (
            <div className="movie-card" onClick={() => onClick && onClick({
                ...movie,
                tmdbId: movie.tmdbId || movie.id,
                posterPath: movie.poster_path || movie.posterPath,
                releaseDate: movie.release_date || movie.releaseDate,
                voteAverage: movie.vote_average || movie.voteAverage
            })}>
                <img 
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path || movie.posterPath}`} 
                    alt={movie.title}
                />
                <div className="list-view-info">
                    <h3>{movie.title}</h3>
                    <p className="movie-overview">{movie.overview}</p>
                    <div className="movie-meta">
                        <span className="year">{(movie.release_date || movie.releaseDate)?.split('-')[0]}</span>
                        <span className="rating">⭐ {movie.vote_average?.toFixed(1)}</span>
                        {movie.runtime && <span className="runtime">{movie.runtime} {t('movieCard.runtime')}</span>}
                    </div>
                </div>
                {isWatchlist && (
                    <button 
                        className={`watched-indicator ${isWatched ? 'active' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onWatchedToggle && onWatchedToggle(movie.tmdbId || movie.id, !isWatched);
                        }}
                        title={isWatched ? t('movieCard.watched') : t('movieCard.unwatched')}
                    >
                        ✓
                    </button>
                )}
            </div>
        );
    }

    // Grid görünümü için
    return (
        <div className="movie-card" onClick={() => onClick && onClick({
            ...movie,
            tmdbId: movie.tmdbId || movie.id,
            posterPath: movie.poster_path || movie.posterPath,
            releaseDate: movie.release_date || movie.releaseDate,
            voteAverage: movie.vote_average || movie.voteAverage
        })}>
            <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path || movie.posterPath}`} 
                alt={movie.title}
            />
            {isWatchlist && (
                <button 
                    className={`watched-indicator ${isWatched ? 'active' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onWatchedToggle && onWatchedToggle(movie.tmdbId || movie.id, !isWatched);
                    }}
                    title={isWatched ? t('movieCard.watched') : t('movieCard.unwatched')}
                >
                    ✓
                </button>
            )}
            <div className="movie-info">
                <h4>{movie.title}</h4>
                <p>
                    <span className="year">{(movie.release_date || movie.releaseDate)?.split('-')[0]}</span>
                    <span className="rating">⭐ {movie.vote_average?.toFixed(1)}</span>
                </p>
            </div>
        </div>
    );
};

export default MovieCard;
