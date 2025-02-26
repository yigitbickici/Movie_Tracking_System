import React from 'react';
import './MovieDetail.css';

const MovieDetail = ({ movie, onClose }) => {
    if (!movie) return null;

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
                        </div>
                        <p className="overview">{movie.overview}</p>
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