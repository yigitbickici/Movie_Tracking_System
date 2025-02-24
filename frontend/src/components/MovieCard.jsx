import React from 'react';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  return (
    <div className="movie-card">
      <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p className="movie-year">{movie.releaseYear}</p>
        <div className="movie-rating">★ {movie.rating}</div>
      </div>
    </div>
  );
};

export default MovieCard; 