import React, { useState, useEffect } from 'react';
import axios from '../services/axiosConfig';
import './Watchlist.css';

const Watchlist = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Please login!');
                    setLoading(false);
                    return;
                }

                const response = await axios.get('/api/movies/watchlist', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                // API yanıtını kontrol et ve güvenli bir şekilde işle
                const data = response.data || [];
                setWatchlist(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Error loading watchlist:', err);
                setError('An error occurred while loading watchlist');
                setWatchlist([]);
            } finally {
                setLoading(false);
            }
        };

        fetchWatchlist();
    }, []);

    const removeFromWatchlist = async (movieId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please login!');
                return;
            }

            await axios.delete(`/api/movies/${movieId}/watchlist`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setWatchlist(prevWatchlist => prevWatchlist.filter(movie => movie.tmdbId !== movieId));
        } catch (err) {
            console.error('Error while removing movie from watchlist:', err);
            setError('An error occurred while removing the movie from the watchlist');
        }
    };

    if (loading) {
        return <div className="watchlist-container">Loading...</div>;
    }

    if (error) {
        return <div className="watchlist-container error">{error}</div>;
    }

    return (
        <div className="watchlist-container">
            <h2>My Watchlist</h2>
            {!watchlist || watchlist.length === 0 ? (
                <p>There are no movies in your watchlist yet..</p>
            ) : (
                <div className="watchlist-grid">
                    {watchlist.map(movie => (
                        <div key={movie.tmdbId} className="movie-card">
                            <img 
                                src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`} 
                                alt={movie.title}
                                className="movie-poster"
                            />
                            <div className="movie-info">
                                <h3>{movie.title}</h3>
                                <p>{movie.releaseDate?.split('-')[0]}</p>
                            </div>
                            <button 
                                onClick={() => removeFromWatchlist(movie.tmdbId)}
                                className="remove-button"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Watchlist; 