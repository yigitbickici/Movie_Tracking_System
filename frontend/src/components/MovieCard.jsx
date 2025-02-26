import React from "react";
import './MovieCard.css';

const MovieCard = ({ movie }) => {
    return (
        <div className="movie-card">
            <img
                className="movie-poster"
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
            />
            <div className="movie-info">
                <h3>{movie.title}</h3>
                <p className="movie-year">{movie.release_date.split("-")[0]}</p>
                <p className="movie-rating">⭐ {movie.vote_average}</p>
            </div>
        </div>
    );
};

export default MovieCard;
