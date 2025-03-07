import React, { useState, useEffect } from 'react';
import './Profile.css';
import { useNavigate, Link } from 'react-router-dom';
import { FaChevronRight, FaHeart, FaEye, FaList, FaComment } from 'react-icons/fa';
import MovieDetail from '../components/MovieDetail';

const Profile = () => {
    const [userProfile, setUserProfile] = useState({
        username: "USER1",
        avatar: "JD",
        stats: {
            following: 10,
            followers: 10,
            comments: 2,
            movieTime: {
                months: 0,
                days: 5,
                hours: 6
            },
            moviesWatched: 20,
        }
    });

    const [selectedMovie, setSelectedMovie] = useState(null);
    const [userMovies, setUserMovies] = useState({
        favorites: [],
        watched: [],
        watchlist: []
    });

    useEffect(() => {
        fetchUserMovies();
    }, []);

    const fetchUserMovies = async () => {
        // Mock data - gerçek API'den gelecek
        setUserMovies({
            favorites: [
                {
                    id: 238,
                    title: "The Godfather",
                    poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
                    release_date: "1972-03-14"
                },
                // ... diğer favori filmler
            ],
            watched: [
                {
                    id: 27205,
                    title: "Inception",
                    poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
                    release_date: "2010-07-16"
                },
                // ... diğer izlenen filmler
            ],
            watchlist: [
                {
                    id: 11,
                    title: "Star Wars",
                    poster_path: "/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",
                    release_date: "1977-05-25"
                },
                // ... diğer watchlist filmleri
            ]
        });
    };

    const handleMovieClick = (movie) => {
        Promise.all([
            fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=84e605aa45ef84282ba934b9b2648dc5&language=en-TR`),
            fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=84e605aa45ef84282ba934b9b2648dc5&language=en-TR`),
            fetch(`https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=84e605aa45ef84282ba934b9b2648dc5`)
        ])
        .then(([detailsRes, creditsRes, providersRes]) => 
            Promise.all([detailsRes.json(), creditsRes.json(), providersRes.json()])
        )
        .then(([detailedMovie, credits, providers]) => {
            setSelectedMovie({
                ...movie,
                ...detailedMovie,
                overview: detailedMovie.overview,
                vote_average: detailedMovie.vote_average,
                original_title: detailedMovie.original_title,
                runtime: detailedMovie.runtime,
                cast: credits.cast.slice(0, 5),
                providers: providers.results.TR || {}
            });
        })
        .catch(error => console.error("Error fetching movie details:", error));
    };

    const MoviePreview = ({ movie }) => (
        <div className="movie-preview" onClick={() => setSelectedMovie(movie)}>
            <img 
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
                alt={movie.title}
            />
            <div className="movie-preview-info">
                <h4>{movie.title}</h4>
                <p>{movie.release_date?.split('-')[0]}</p>
            </div>
        </div>
    );

    const MovieModal = ({ movies, title, isOpen, onClose, icon: Icon }) => {
        const [isActive, setIsActive] = useState(false);

        useEffect(() => {
            if (isOpen) {
                requestAnimationFrame(() => {
                    setIsActive(true);
                });
            } else {
                setIsActive(false);
            }
        }, [isOpen]);

        if (!isOpen) return null;

        return (
            <div 
                className={`movie-modal-overlay ${isActive ? 'active' : ''}`} 
                onClick={onClose}
            >
                <div className="movie-modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>
                            {Icon && <Icon className="section-icon" />}
                            {title}
                        </h2>
                        <button className="modal-close-button" onClick={onClose}>×</button>
                    </div>
                    <div className="modal-movies-grid">
                        {movies.map(movie => (
                            <MoviePreview key={movie.id} movie={movie} />
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const MovieSection = ({ title, movies, icon: Icon }) => {
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [showAll, setShowAll] = useState(false);
        const visibleMovies = showAll ? movies : movies.slice(0, 5);

        return (
            <div className="movies-section">
                <div className="section-header">
                    <h2>
                        <Icon className="section-icon" />
                        {title}
                    </h2>
                    <div className="section-buttons">
                        {movies.length > 5 && (
                            <button 
                                className="see-all-button" 
                                onClick={() => setShowAll(!showAll)}
                            >
                                {showAll ? 'Show Less' : 'See All'} 
                                <FaChevronRight className={showAll ? 'rotate-icon' : ''} />
                            </button>
                        )}
                        <button 
                            className="see-all-button modal-button" 
                            onClick={() => setIsModalOpen(true)}
                        >
                            See all <FaChevronRight />
                        </button>
                    </div>
                </div>
                
                <div className="movies-grid">
                    {visibleMovies.map(movie => (
                        <MoviePreview key={movie.id} movie={movie} />
                    ))}
                </div>

                <MovieModal 
                    movies={movies}
                    title={title}
                    icon={Icon}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            </div>
        );
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-avatar">
                    <span>{userProfile.avatar}</span>
                </div>
                <h1 className="profile-username">{userProfile.username}</h1>
                <Link to="/profile/edit" className="edit-button">
                    EDIT
                </Link>
                <div className="profile-stats">
                    <div className="stat-item">
                        <div className="stat-value">{userProfile.stats.following}</div>
                        <div className="stat-label">following</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{userProfile.stats.followers}</div>
                        <div className="stat-label">follower</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{userProfile.stats.comments}</div>
                        <div className="stat-label">comments</div>
                    </div>
                </div>
            </div>

            <div className="profile-content">
                <div className="stats-section">
                    <h2>Stats</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h4>Movie time</h4>
                            <div className="time-stats">
                                <div className="time-stat">
                                    <span>{userProfile.stats.movieTime.months}</span>
                                    <label>MONTHS</label>
                                </div>
                                <div className="time-stat">
                                    <span>{userProfile.stats.movieTime.days}</span>
                                    <label>DAYS</label>
                                </div>
                                <div className="time-stat">
                                    <span>{userProfile.stats.movieTime.hours}</span>
                                    <label>HOURS</label>
                                </div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <h4>Movies watched</h4>
                            <div className="single-stat">{userProfile.stats.moviesWatched}</div>
                        </div>
                    </div>
                </div>

                <MovieSection 
                    title="Favorites"
                    movies={userMovies.favorites}
                    icon={FaHeart}
                />

                <MovieSection 
                    title="Watched Movies"
                    movies={userMovies.watched}
                    icon={FaEye}
                />

                <MovieSection 
                    title="Watchlist"
                    movies={userMovies.watchlist}
                    icon={FaList}
                />
            </div>

            {selectedMovie && (
                <MovieDetail 
                    movie={selectedMovie} 
                    onClose={() => setSelectedMovie(null)}
                    isInList={true}
                />
            )}
        </div>
    );
};

export default Profile; 