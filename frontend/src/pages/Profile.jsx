import React, { useState } from 'react';
import './Profile.css';
import { useNavigate, Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
import MovieDetail from '../components/MovieDetail';

const Profile = () => {
    const userStats = {
        following: 10,
        followers: 10,
        comments: 2,
        movieTime: {
            months: 0,
            days: 5,
            hours: 6
        },
        moviesWatched: 20,
    };

    const [movies, setMovies] = useState([
        {
            id: 27205,
            title: "Inception",
            poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
            release_date: "2010-07-16"
        },
        {
            id: 155,
            title: "The Dark Knight",
            poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
            release_date: "2008-07-18"
        },
        {
            id: 157336,
            title: "Interstellar",
            poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
            release_date: "2014-11-07"
        },
        {
            id: 278,
            title: "The Shawshank Redemption",
            poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
            release_date: "1994-09-23"
        },
        {
            id: 680,
            title: "Pulp Fiction",
            poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
            release_date: "1994-09-10"
        }
    ]);

    const [favoriteMovies, setFavoriteMovies] = useState([
        {
            id: 238,
            title: "The Godfather",
            poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
            release_date: "1972-03-14"
        },
        {
            id: 550,
            title: "Fight Club",
            poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
            release_date: "1999-10-15"
        },
        {
            id: 13,
            title: "Forrest Gump",
            poster_path: "/saHP97rTPS5eLmrLQEcANmKrsFl.jpg",
            release_date: "1994-06-23"
        },
        {
            id: 603,
            title: "The Matrix",
            poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
            release_date: "1999-03-30"
        },
        {
            id: 769,
            title: "Goodfellas",
            poster_path: "/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg",
            release_date: "1990-09-12"
        }
    ]);

    const [showAllMovies, setShowAllMovies] = useState(false);
    const [showAllFavorites, setShowAllFavorites] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [watchedMovies, setWatchedMovies] = useState(new Set());

    const navigate = useNavigate();
    
    const handleEditClick = () => {
        navigate('/profile/edit');
    };

    const handleSeeAllMovies = () => {
        setShowAllMovies(!showAllMovies);
    };

    const handleSeeAllFavorites = () => {
        setShowAllFavorites(!showAllFavorites);
    };

    const handleMovieClick = (movie) => {
        // Fetch movie details, credits, and watch providers in parallel
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
                ...detailedMovie,  // Tüm detayları ekleyelim
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

    const handleWatchedToggle = (movieId, event) => {
        event.stopPropagation(); // Film kartının click event'ini engelliyoruz
        setWatchedMovies(prev => {
            const newSet = new Set(prev);
            if (newSet.has(movieId)) {
                newSet.delete(movieId);
            } else {
                newSet.add(movieId);
            }
            return newSet;
        });
    };

    const MoviePreview = ({ movie }) => (
        <div className="movie-preview" onClick={() => handleMovieClick(movie)}>
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

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-avatar">
                    <span>JD</span>
                </div>
                <h1 className="profile-username">USER1</h1>
                <Link to="/profile/edit" className="edit-button">
                    EDIT
                </Link>
                <div className="profile-stats">
                    <div className="stat-item">
                        <div className="stat-value">{userStats.following}</div>
                        <div className="stat-label">following</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{userStats.followers}</div>
                        <div className="stat-label">follower</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{userStats.comments}</div>
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
                                    <span>{userStats.movieTime.months}</span>
                                    <label>MONTHS</label>
                                </div>
                                <div className="time-stat">
                                    <span>{userStats.movieTime.days}</span>
                                    <label>DAYS</label>
                                </div>
                                <div className="time-stat">
                                    <span>{userStats.movieTime.hours}</span>
                                    <label>HOURS</label>
                                </div>
                            </div>
                        </div>
                    
                        <div className="stat-card">
                            <h4>Movies watched</h4>
                            <div className="single-stat">{userStats.moviesWatched}</div>
                        </div>
                    </div>
                </div>

                <div className="movies-section">
                    <h2>Movies</h2>
                    <div className="section-header">
                        {movies.length > 5 && (
                            <button className="see-all-button" onClick={handleSeeAllMovies}>
                                {showAllMovies ? 'Show Less' : 'See All'} <FaChevronRight className={showAllMovies ? 'rotate-icon' : ''} />
                            </button>
                        )}
                    </div>
                    <div className="movies-slider">
                        {movies.length > 0 ? (
                            <div className="movies-grid">
                                {(showAllMovies ? movies : movies.slice(0, 5)).map((movie) => (
                                    <MoviePreview key={movie.id} movie={movie} />
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <button className="add-movies-btn">
                                    NO MOVIES
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="favorite-movies-section">
                    <div className="section-header">
                        <h2>Favorite Movies</h2>
                        {favoriteMovies.length > 5 && (
                            <button className="see-all-button" onClick={handleSeeAllFavorites}>
                                {showAllFavorites ? 'Show Less' : 'See All'} <FaChevronRight className={showAllFavorites ? 'rotate-icon' : ''} />
                            </button>
                        )}
                    </div>
                    <div className="movies-slider">
                        {favoriteMovies.length > 0 ? (
                            <div className="movies-grid">
                                {(showAllFavorites ? favoriteMovies : favoriteMovies.slice(0, 5)).map((movie) => (
                                    <MoviePreview key={movie.id} movie={movie} />
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <button className="add-favorite-movies-btn">
                                    NO MOVIES
                                </button>
                            </div>
                        )}
                    </div>
                </div>
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