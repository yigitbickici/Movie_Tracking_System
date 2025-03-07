import React from "react";
import './MovieCard.css';

const MovieCard = ({ movie, onClick, isWatchlist, isWatched, onWatchedToggle, isGridView }) => {
    // Eğer watchlist sayfasında ve list view modundaysa
    if (isWatchlist && !isGridView) {
        return (
            <div className="movie-card" onClick={onClick}>
                <img 
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                    alt={movie.title}
                />
                <div className="list-view-info">
                    <h3>{movie.title}</h3>
                    <p className="movie-overview">{movie.overview}</p>
                    <div className="movie-meta">
                        <span>{movie.release_date?.split('-')[0]}</span>
                        <span>⭐ {movie.vote_average}</span>
                    </div>
                </div>
                {isWatchlist && (
                    <button 
                        className={`watched-indicator ${isWatched ? 'active' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onWatchedToggle(e);
                        }}
                    >
                        ✓
                    </button>
                )}
            </div>
        );
    }

    // Normal grid view için orijinal render
    return (
        <div className="movie-card" onClick={onClick}>
            <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title}
            />
            {isWatchlist && (
                <button 
                    className={`watched-indicator ${isWatched ? 'active' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onWatchedToggle(e);
                    }}
                >
                    ✓
                </button>
            )}
            <div className="movie-info">
                <h4>{movie.title}</h4>
                <p>{movie.release_date?.split('-')[0]}</p>
            </div>
        </div>
    );
};

export default MovieCard;
