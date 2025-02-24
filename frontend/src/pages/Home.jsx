import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import './Home.css';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/movies');
      const data = await response.json();
      setMovies(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      <header className="home-header">
        <h1>Movie Management System</h1>
        <div className="search-bar">
          <input type="text" placeholder="Search movies..." />
        </div>
      </header>
      <div className="movies-grid">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default Home; 