import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import MovieDetail from '../components/MovieDetail';
import axios from '../services/axiosConfig';
import './Watchlist.css';

const API_KEY = "84e605aa45ef84282ba934b9b2648dc5";

const Watchlist = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('watchlist');
    const [isGridView, setIsGridView] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [watchlistMovies, setWatchlistMovies] = useState([]);
    const [watchedMovies, setWatchedMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMovies();
    }, [activeTab]);

    const fetchMovies = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please login');
                setLoading(false);
                return;
            }

            const headers = {
                'Authorization': `Bearer ${token}`
            };

            if (activeTab === 'watchlist') {
                const response = await axios.get('/api/movies/watchlist', { headers });
                console.log('Watchlist response:', response.data);
                setWatchlistMovies(Array.isArray(response.data) ? response.data : []);
            } else {
                const response = await axios.get('/api/movies/watched', { headers });
                console.log('Watched movies API response:', {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers,
                    data: response.data
                });
                const movies = response.data;
                if (Array.isArray(movies)) {
                    console.log('Setting watched movies:', movies.length, 'items');
                    setWatchedMovies(movies);
                } else {
                    console.error('API response is not an array:', movies);
                    setWatchedMovies([]);
                }
            }
        } catch (error) {
            console.error('An error occurred while loading movies:', error);
            setError('An error occurred while loading movies');
            if (activeTab === 'watchlist') {
                setWatchlistMovies([]);
            } else {
                setWatchedMovies([]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleWatchedToggle = async (movieId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please login');
                return;
            }

            const headers = {
                'Authorization': `Bearer ${token}`
            };

            if (activeTab === 'watchlist') {
                await axios.post(`/api/movies/${movieId}/watched`, {}, { headers });
                setWatchlistMovies(prev => prev.filter(movie => movie.tmdbId !== movieId));
            } else {
                await axios.delete(`/api/movies/${movieId}/watched`, { headers });
                setWatchedMovies(prev => prev.filter(movie => movie.tmdbId !== movieId));
            }
        } catch (error) {
            console.error('An error occurred while updating the viewing status:', error);
            setError('An error occurred while updating the viewing status');
        }
    };

    const handleMovieClick = (movie) => {
        Promise.all([
            fetch(`https://api.themoviedb.org/3/movie/${movie.tmdbId}?api_key=${API_KEY}&language=en-TR`),
            fetch(`https://api.themoviedb.org/3/movie/${movie.tmdbId}/credits?api_key=${API_KEY}&language=en-TR`),
            fetch(`https://api.themoviedb.org/3/movie/${movie.tmdbId}/watch/providers?api_key=${API_KEY}`)
        ])
            .then(([detailsRes, creditsRes, providersRes]) => 
                Promise.all([detailsRes.json(), creditsRes.json(), providersRes.json()])
            )
            .then(([detailedMovie, credits, providers]) => {
                setSelectedMovie({
                    ...movie,
                    runtime: detailedMovie.runtime,
                    cast: credits.cast.slice(0, 5),
                    providers: providers.results.TR || {}
                });
            })
            .catch(error => console.error("Error fetching movie details:", error));
    };

    const toggleView = () => {
        setIsGridView(!isGridView);
    };

    const handleWatchlistUpdate = (movieId, isAdded) => {
        if (!isAdded) {
            navigate('/profile');
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    const currentMovies = activeTab === 'watchlist' ? 
        (Array.isArray(watchlistMovies) ? watchlistMovies : []) : 
        (Array.isArray(watchedMovies) ? watchedMovies : []);

    return (
        <div className="watchlist-container">
            <div className="watchlist-header">
                <div className="tab-buttons">
                    <button 
                        className={`tab-button ${activeTab === 'watchlist' ? 'active' : ''}`}
                        onClick={() => setActiveTab('watchlist')}
                    >
                        WatchList
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'watched' ? 'active' : ''}`}
                        onClick={() => setActiveTab('watched')}
                    >
                        Watched
                    </button>
                </div>
                <button className="view-toggle" onClick={toggleView}>
                    {isGridView ? '⊞' : '≣'}
                </button>
            </div>

            <div className={`movies-container ${isGridView ? 'grid-view' : 'list-view'}`}>
                {currentMovies && currentMovies.length > 0 ? (
                    currentMovies.map(movie => (
                    <MovieCard 
                            key={movie.tmdbId}
                            movie={{
                                ...movie,
                                id: movie.tmdbId,
                                poster_path: movie.posterPath,
                                release_date: movie.releaseDate,
                                vote_average: movie.voteAverage
                            }}
                        onClick={() => handleMovieClick(movie)}
                        isWatchlist={activeTab === 'watchlist'}
                            isWatched={activeTab === 'watched'}
                            onWatchedToggle={activeTab === 'watchlist' ? () => handleWatchedToggle(movie.tmdbId) : null}
                        isGridView={isGridView}
                    />
                    ))
                ) : (
                    <div className="no-movies">
                        {activeTab === 'watchlist' ? 'There are no movies in your watchlist yet.' : 'There are no movies watched yet.'}
                    </div>
                )}
            </div>

            {selectedMovie && (
                <MovieDetail 
                    movie={selectedMovie}
                    onClose={() => setSelectedMovie(null)}
                    isInList={true}
                    onWatchlistUpdate={handleWatchlistUpdate}
                />
            )}
        </div>
    );
};

export default Watchlist; 