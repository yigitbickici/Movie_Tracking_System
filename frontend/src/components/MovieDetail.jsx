import React from 'react';
import './MovieDetail.css';

const MovieDetail = ({ movie, onClose }) => {
    if (!movie) return null;

    // Convert runtime to hours and minutes
    const formatRuntime = (minutes) => {
        if (!minutes) return '';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}s ${mins}dk`;
    };

    return (
        <div className="movie-detail-overlay">
            <div className="movie-detail-content">
                <button className="close-button" onClick={onClose}>×</button>
                <div className="movie-detail-header">
                    <img 
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                        alt={movie.title} 
                        className="detail-poster"
                    />
                    <div className="movie-detail-info">
                        <h1>{movie.title}</h1>
                        <p className="original-title">{movie.original_title}</p>
                        <div className="movie-meta">
                            <span>{movie.release_date.split("-")[0]}</span>
                            <span>⭐ {movie.vote_average}</span>
                            {movie.runtime && <span>⏱️ {formatRuntime(movie.runtime)}</span>}
                        </div>
                        <p className="overview">{movie.overview}</p>
                        
                        {/* Add cast section */}
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
                        
                        <button className="detail-add-button" onClick={() => console.log("Film listeye eklendi:", movie.title)}>
                            + ADD TO MY LIST
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetail; 