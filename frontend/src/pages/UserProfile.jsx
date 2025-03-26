import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaChevronRight, FaUserPlus, FaUserCheck, FaComment, FaStar, FaHeart, FaEye, FaList } from 'react-icons/fa';
import './UserProfile.css';
import MovieDetail from '../components/MovieDetail';

const UserProfile = () => {
    const { username } = useParams();
    const [isFollowing, setIsFollowing] = useState(false);
    const [userProfile, setUserProfile] = useState({
        username: username,
        avatar: username.substring(0, 2).toUpperCase(),
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
        },
        movies: [], // Son izlenen filmler
        favoriteMovies: [], // Favori filmler
    });

    const [showAllMovies, setShowAllMovies] = useState(false);
    const [showAllFavorites, setShowAllFavorites] = useState(false);
    const [showAllWatchlist, setShowAllWatchlist] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [userComments, setUserComments] = useState([]);
    const [showAllComments, setShowAllComments] = useState(false);
    const [userMovies, setUserMovies] = useState({
        favorites: [],
        watched: [],
        watchlist: []
    });

    const checkFollowStatus = async () => {
        try {
            // API çağrısı yapılacak
            // const response = await fetch(`/api/users/${username}/follow-status`);
            // const data = await response.json();
            // setIsFollowing(data.isFollowing);
            
            // Şimdilik mock data kullanıyoruz
            setIsFollowing(false);
        } catch (error) {
            console.error('Error checking follow status:', error);
            setIsFollowing(false);
        }
    };

    useEffect(() => {
        // Kullanıcı bilgilerini API'den çek
        fetchUserProfile();
        fetchUserComments();
        fetchUserMovies();
        checkFollowStatus(); // Takip durumunu kontrol et
    }, [username]);

    const fetchUserProfile = async () => {
        try {
            // API çağrısı yapılacak
            // const response = await fetch(`/api/users/${username}`);
            // const data = await response.json();
            setUserProfile({
                username: username,
                avatar: username.substring(0, 2).toUpperCase(),
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
                },
                movies: [],
            });
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const fetchUserComments = async () => {
        try {
            // API çağrısı yapılacak
            // const response = await fetch(`/api/users/${username}/comments`);
            // const data = await response.json();
            // Geçici mock data
            const mockComments = [
                {
                    id: 1,
                    movieId: 27205,
                    movieTitle: "Inception",
                    moviePoster: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
                    comment: "Great movie! One of Christopher Nolan's best.",
                    rating: 4.5,
                    date: "2024-03-15"
                },
                {
                    id: 2,
                    movieId: 155,
                    movieTitle: "The Dark Knight",
                    moviePoster: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
                    comment: "Heath Ledger's performance as the Joker is unforgettable.",
                    rating: 5,
                    date: "2024-03-10"
                },
                // ... diğer yorumlar
            ];
            setUserComments(mockComments);
        } catch (error) {
            console.error('Error fetching user comments:', error);
        }
    };

    const fetchUserMovies = async () => {
        try {
            // Mock data
            setUserMovies({
                favorites: [
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
                    },
                    {
                        id: 389,
                        title: "12 Angry Men",
                        poster_path: "/ppd84D2i9W8jXmsyInGyihiSyqz.jpg",
                        release_date: "1957-04-10"
                    }
                ],
                watched: [
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
                    },
                    {
                        id: 429,
                        title: "The Good, the Bad and the Ugly",
                        poster_path: "/bX2xnavhMYjWDoZp1VM6VnxYyxp.jpg",
                        release_date: "1966-12-23"
                    }
                ],
                watchlist: [
                    {
                        id: 11,
                        title: "Star Wars",
                        poster_path: "/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",
                        release_date: "1977-05-25"
                    },
                    {
                        id: 597,
                        title: "Titanic",
                        poster_path: "/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
                        release_date: "1997-11-18"
                    },
                    {
                        id: 120,
                        title: "The Lord of the Rings: The Fellowship of the Ring",
                        poster_path: "/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
                        release_date: "2001-12-18"
                    },
                    {
                        id: 122,
                        title: "The Lord of the Rings: The Return of the King",
                        poster_path: "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
                        release_date: "2003-12-17"
                    },
                    {
                        id: 121,
                        title: "The Lord of the Rings: The Two Towers",
                        poster_path: "/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg",
                        release_date: "2002-12-18"
                    },
                    {
                        id: 101,
                        title: "Leon: The Professional",
                        poster_path: "/yI6X2cCM5YPJtxMhUd3dPGqDAhw.jpg",
                        release_date: "1994-09-14"
                    }
                ]
            });
        } catch (error) {
            console.error('Error fetching user movies:', error);
        }
    };

    const handleFollowToggle = async () => {
        try {
            // API çağrısı yapılacak
            // const response = await fetch(`/api/users/${username}/follow`, {
            //     method: isFollowing ? 'DELETE' : 'POST'
            // });
            setIsFollowing(!isFollowing);
        } catch (error) {
            console.error('Error toggling follow:', error);
        }
    };

    const handleMovieClick = (movie) => {
        // Film detaylarını, oyuncuları ve izleme platformlarını paralel olarak çek
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

    const handleWatchlistUpdate = (movieId, isAdded) => {
        setUserMovies(prev => ({
            ...prev,
            watchlist: isAdded 
                ? [...prev.watchlist, { id: movieId }]
                : prev.watchlist.filter(movie => movie.id !== movieId)
        }));
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

    const CommentCard = ({ comment }) => (
        <div className="comment-card" onClick={() => handleMovieClick({ id: comment.movieId })}>
            <div className="comment-movie-info">
                <img 
                    src={`https://image.tmdb.org/t/p/w92${comment.moviePoster}`} 
                    alt={comment.movieTitle}
                    className="comment-movie-poster"
                />
                <div className="comment-movie-details">
                    <h4>{comment.movieTitle}</h4>
                    <div className="comment-rating">
                        <FaStar className="star-icon" />
                        <span>{comment.rating}</span>
                    </div>
                </div>
            </div>
            <p className="comment-text">{comment.comment}</p>
            <span className="comment-date">{new Date(comment.date).toLocaleDateString()}</span>
        </div>
    );

    const MovieModal = ({ movies, title, isOpen, onClose, icon: Icon }) => {
        const [isActive, setIsActive] = useState(false);

        useEffect(() => {
            if (isOpen) {
                // Modal açıldığında önce görünür yap, sonra animasyonu başlat
                requestAnimationFrame(() => {
                    setIsActive(true);
                });
            } else {
                // Modal kapanırken önce animasyonu bitir
                setIsActive(false);
            }
        }, [isOpen]);

        if (!isOpen) return null;

        const handleTransitionEnd = () => {
            // Animasyon bittiğinde ve modal kapalıysa komponenti kaldır
            if (!isActive) {
                onClose();
            }
        };

        return (
            <div 
                className={`movie-modal-overlay ${isActive ? 'active' : ''}`} 
                onClick={onClose}
                onTransitionEnd={handleTransitionEnd}
            >
                <div className="movie-modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>
                            {Icon && <Icon className="section-icon" />}
                            {title}
                        </h2>
                        <button className="modal-close-button" onClick={onClose}>
                            ×
                        </button>
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

    const MovieSection = ({ title, movies, icon: Icon, showAll, setShowAll }) => {
        const [isModalOpen, setIsModalOpen] = useState(false);
        const visibleMovies = movies.slice(0, 5);

        return (
            <div className="movies-section">
                <div className="section-header">
                    <h2>
                        <Icon className="section-icon" />
                        {title}
                    </h2>
                    {movies.length > 5 && (
                        <button 
                            className="see-all-button" 
                            onClick={() => setIsModalOpen(true)}
                        >
                            See All <FaChevronRight />
                        </button>
                    )}
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
                <button 
                    className={`follow-button ${isFollowing ? 'following' : ''}`}
                    onClick={handleFollowToggle}
                >
                    {isFollowing ? (
                        <>
                            <FaUserCheck /> Following
                        </>
                    ) : (
                        <>
                            <FaUserPlus /> Follow
                        </>
                    )}
                </button>
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

                {/* Favorites Section */}
                <MovieSection 
                    title="Favorites"
                    movies={userMovies.favorites}
                    icon={FaHeart}
                    showAll={showAllFavorites}
                    setShowAll={setShowAllFavorites}
                />

                {/* Watched Movies Section */}
                <MovieSection 
                    title="Watched Movies"
                    movies={userMovies.watched}
                    icon={FaEye}
                    showAll={showAllMovies}
                    setShowAll={setShowAllMovies}
                />

                {/* Watchlist Section */}
                <MovieSection 
                    title="Watchlist"
                    movies={userMovies.watchlist}
                    icon={FaList}
                    showAll={showAllWatchlist}
                    setShowAll={setShowAllWatchlist}
                />

                {/* Yorumlar bölümü */}
                <div className="comments-section">
                    <div className="section-header">
                        <h2>
                            <FaComment className="section-icon" />
                            Comments
                        </h2>
                        {userComments.length > 3 && (
                            <button 
                                className="see-all-button" 
                                onClick={() => setShowAllComments(!showAllComments)}
                            >
                                {showAllComments ? 'Show Less' : 'See All'} 
                                <FaChevronRight className={showAllComments ? 'rotate-icon' : ''} />
                            </button>
                        )}
                    </div>
                    
                    <div className="comments-container">
                        {userComments.length > 0 ? (
                            <div className="comments-grid">
                                {(showAllComments ? userComments : userComments.slice(0, 3)).map(comment => (
                                    <CommentCard key={comment.id} comment={comment} />
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>No comments yet</p>
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
                    onWatchlistUpdate={handleWatchlistUpdate}
                />
            )}
        </div>
    );
};

export default UserProfile; 