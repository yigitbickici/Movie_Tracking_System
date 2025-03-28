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

    useEffect(() => {
        fetchMovies();
    }, [activeTab]);

    const fetchMovies = async () => {
        try {
            setLoading(true);
            if (activeTab === 'watchlist') {
                const response = await axios.get('/api/movies/watchlist');
                setWatchlistMovies(response.data);
            } else {
                const response = await axios.get('/api/movies/watched');
                setWatchedMovies(response.data);
            }
        } catch (error) {
            console.error('Filmler yüklenirken hata oluştu:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleWatchedToggle = async (movieId) => {
        try {
            if (activeTab === 'watchlist') {
                await axios.post(`/api/movies/${movieId}/watched`);
                // Film izlendi olarak işaretlendiğinde watchlist'ten kaldır
                setWatchlistMovies(prev => prev.filter(movie => movie.tmdbId !== movieId));
            } else {
                await axios.delete(`/api/movies/${movieId}/watched`);
                // Film izlenmemiş olarak işaretlendiğinde watched listesinden kaldır
                setWatchedMovies(prev => prev.filter(movie => movie.tmdbId !== movieId));
            }
            // Sayfayı yenile
            window.location.reload();
        } catch (error) {
            console.error('İzlenme durumu güncellenirken hata oluştu:', error);
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
        return <div className="loading">Yükleniyor...</div>;
    }

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
                {(activeTab === 'watchlist' ? watchlistMovies : watchedMovies).map(movie => (
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
                        isWatched={activeTab === 'watched' || watchedMovies.some(w => w.tmdbId === movie.tmdbId)}
                        onWatchedToggle={() => handleWatchedToggle(movie.tmdbId)}
                        isGridView={isGridView}
                    />
                ))}
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