import React, { useState, useEffect } from 'react';
import './Profile.css';
import { useNavigate, Link } from 'react-router-dom';
import { FaChevronRight, FaHeart, FaEye, FaList, FaComment, FaStar, FaTrash, FaEdit, FaUsers, FaUserFriends } from 'react-icons/fa';
import MovieDetail from '../components/MovieDetail';

const Profile = () => {
    const [userProfile, setUserProfile] = useState({
        username: "USER1",
        avatar: "U1",
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
    const [userComments, setUserComments] = useState([]);
    const [showAllComments, setShowAllComments] = useState(false);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        commentId: null
    });
    const [editModal, setEditModal] = useState({
        isOpen: false,
        comment: null
    });

    const [followers, setFollowers] = useState([
        {
            id: 1,
            username: "MovieLover",
            movieCount: 150,
            isFollowing: true,
        },
        {
            id: 2,
            username: "CinemaFan",
            movieCount: 89,
            isFollowing: false,
        }
    ]);

    const [following, setFollowing] = useState([
        {
            id: 3,
            username: "FilmBuff",
            movieCount: 234,
        },
        {
            id: 4,
            username: "MovieCritic",
            movieCount: 567,
        }
    ]);

    const [followersModal, setFollowersModal] = useState(false);
    const [followingModal, setFollowingModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchUserMovies();
        fetchUserComments();
    }, []);

    const fetchUserMovies = async () => {
        setUserMovies({
            favorites: [
                {
                    id: 238,
                    title: "The Godfather",
                    poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
                    release_date: "1972-03-14"
                },
                {
                    id: 155,
                    title: "The Dark Knight",
                    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
                    release_date: "2008-07-18"
                },
                {
                    id: 550,
                    title: "Fight Club",
                    poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
                    release_date: "1999-10-15"
                },
                {
                    id: 278,
                    title: "The Shawshank Redemption",
                    poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
                    release_date: "1994-09-23"
                },
                {
                    id: 13,
                    title: "Forrest Gump",
                    poster_path: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
                    release_date: "1994-07-06"
                },
                {
                    id: 497,
                    title: "The Green Mile",
                    poster_path: "/velWPhVMQeQKcxggNEU8YmIo52R.jpg",
                    release_date: "1999-12-10"
                },
                {
                    id: 429,
                    title: "The Good, the Bad and the Ugly",
                    poster_path: "/bX2xnavhMYjWDoZp1VM6VnU1xwe.jpg",
                    release_date: "1966-12-23"
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
                    id: 157336,
                    title: "Interstellar",
                    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
                    release_date: "2014-11-07"
                },
                {
                    id: 680,
                    title: "Pulp Fiction",
                    poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
                    release_date: "1994-09-10"
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
                    id: 122,
                    title: "The Lord of the Rings: The Return of the King",
                    poster_path: "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
                    release_date: "2003-12-17"
                },
                {
                    id: 240,
                    title: "The Godfather Part II",
                    poster_path: "/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg",
                    release_date: "1974-12-20"
                },
                {
                    id: 424,
                    title: "Schindler's List",
                    poster_path: "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
                    release_date: "1993-12-15"
                },
                {
                    id: 129,
                    title: "Spirited Away",
                    poster_path: "/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
                    release_date: "2001-07-20"
                },
                {
                    id: 372058,
                    title: "Your Name.",
                    poster_path: "/q719jXXEzOoYaps6babgKnONONX.jpg",
                    release_date: "2016-08-26"
                }
            ],
            watchlist: [
                {
                    id: 11,
                    title: "Star Wars",
                    poster_path: "/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",
                    release_date: "1977-05-25"
                },

            ]
        });
    };

    const fetchUserComments = async () => {
        try {
            // Mock data - gerçek API'den gelecek
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
            ];
            setUserComments(mockComments);
        } catch (error) {
            console.error('Error fetching user comments:', error);
        }
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

    const handleDeleteComment = async (commentId) => {
        try {
            // API çağrısı yapılacak
            // const response = await fetch(`/api/comments/${commentId}`, {
            //     method: 'DELETE'
            // });
            
            // Başarılı silme işleminden sonra yorumları güncelle
            setUserComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
            
            // Yorum sayısını güncelle
            setUserProfile(prevProfile => ({
                ...prevProfile,
                stats: {
                    ...prevProfile.stats,
                    comments: prevProfile.stats.comments - 1
                }
            }));

            // Modalı kapat
            setDeleteModal({ isOpen: false, commentId: null });
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleEditComment = async (commentId, newComment, newRating) => {
        try {
            // API çağrısı yapılacak
            // const response = await fetch(`/api/comments/${commentId}`, {
            //     method: 'PUT',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ comment: newComment, rating: newRating })
            // });

            // Yorumları güncelle
            setUserComments(prevComments => prevComments.map(comment => 
                comment.id === commentId 
                    ? { ...comment, comment: newComment, rating: newRating }
                    : comment
            ));

            // Modalı kapat
            setEditModal({ isOpen: false, comment: null });
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };

    const handleFollow = (userId) => {
        setFollowers(followers.map(follower => 
            follower.id === userId 
                ? {...follower, isFollowing: !follower.isFollowing}
                : follower
        ));
    };

    const handleUnfollow = (userId) => {
        setFollowing(following.filter(user => user.id !== userId));
        // Takipçi sayısını güncelle
        setUserProfile(prev => ({
            ...prev,
            stats: {
                ...prev.stats,
                following: prev.stats.following - 1
            }
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

    const DeleteConfirmationModal = () => (
        <div className={`delete-modal-overlay ${deleteModal.isOpen ? 'active' : ''}`}>
            <div className="delete-modal-content">
                <h3>Delete Comment</h3>
                <p>Are you sure you want to delete this comment?</p>
                <div className="delete-modal-buttons">
                    <button 
                        className="delete-modal-button cancel"
                        onClick={() => setDeleteModal({ isOpen: false, commentId: null })}
                    >
                        Cancel
                    </button>
                    <button 
                        className="delete-modal-button confirm"
                        onClick={() => handleDeleteComment(deleteModal.commentId)}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );

    const EditCommentModal = () => {
        const [editedComment, setEditedComment] = useState(editModal.comment?.comment || '');
        const [editedRating, setEditedRating] = useState(editModal.comment?.rating || 5);
        const [hoveredRating, setHoveredRating] = useState(0);

        useEffect(() => {
            if (editModal.comment) {
                setEditedComment(editModal.comment.comment);
                setEditedRating(editModal.comment.rating);
            }
        }, [editModal.comment]);

        return (
            <div className={`edit-modal-overlay ${editModal.isOpen ? 'active' : ''}`}>
                <div className="edit-modal-content">
                    <h3>Edit Comment</h3>
                    <div className="edit-modal-form">
                        <div className="rating-input">
                            <label>Rating:</label>
                            <div className="star-rating">
                                {[...Array(10)].map((_, index) => {
                                    const ratingValue = index + 1;
                                    return (
                                        <button
                                            type="button"
                                            key={ratingValue}
                                            className={`star-button ${
                                                ratingValue <= (hoveredRating || editedRating) 
                                                    ? 'active' 
                                                    : ''
                                            }`}
                                            onClick={() => setEditedRating(ratingValue)}
                                            onMouseEnter={() => setHoveredRating(ratingValue)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                        >
                                            ★
                                        </button>
                                    );
                                })}
                                {editedRating > 0 && (
                                    <span className="rating-number">{editedRating}/10</span>
                                )}
                            </div>
                        </div>
                        <div className="comment-input">
                            <label>Comment:</label>
                            <textarea
                                value={editedComment}
                                onChange={(e) => setEditedComment(e.target.value)}
                                rows="4"
                                placeholder="Write your comment..."
                            />
                        </div>
                    </div>
                    <div className="edit-modal-buttons">
                        <button 
                            className="edit-modal-button cancel"
                            onClick={() => setEditModal({ isOpen: false, comment: null })}
                        >
                            Cancel
                        </button>
                        <button 
                            className="edit-modal-button confirm"
                            onClick={() => handleEditComment(editModal.comment.id, editedComment, editedRating)}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const CommentCard = ({ comment }) => (
        <div className="comment-card">
            <div className="comment-movie-info" onClick={() => handleMovieClick({ id: comment.movieId })}>
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
            <div className="comment-footer">
                <span className="comment-date">{new Date(comment.date).toLocaleDateString()}</span>
                <div className="comment-actions">
                    <button 
                        className="edit-comment-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setEditModal({ isOpen: true, comment });
                        }}
                    >
                        <FaEdit />
                    </button>
                    <button 
                        className="delete-comment-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setDeleteModal({ isOpen: true, commentId: comment.id });
                        }}
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>
        </div>
    );

    const UserCard = ({ user, type }) => (
        <div 
            className="user-card"
            onClick={() => navigate(`/user/${user.username}`)}
        >
            <div className="user-avatar">
                {user.avatar || user.username.substring(0, 2).toUpperCase()}
            </div>
            <div className="user-info">
                <h4>{user.username}</h4>
                <p>{user.movieCount} films</p>
            </div>
            <button 
                className={`follow-button ${type === 'following' || user.isFollowing ? 'following' : ''}`}
                onClick={(e) => {
                    e.stopPropagation();
                    type === 'following' ? handleUnfollow(user.id) : handleFollow(user.id);
                }}
            >
                {type === 'following' || user.isFollowing ? 'Following' : 'Follow'}
            </button>
        </div>
    );

    const ConnectionModal = ({ title, users, isOpen, onClose, icon: Icon, type }) => {
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
                className={`connection-modal-overlay ${isActive ? 'active' : ''}`} 
                onClick={onClose}
            >
                <div className="connection-modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>
                            {Icon && <Icon className="section-icon" />}
                            {title}
                        </h2>
                        <button className="modal-close-button" onClick={onClose}>×</button>
                    </div>
                    <div className="modal-users-list">
                        {users.map(user => (
                            <UserCard 
                                key={user.id} 
                                user={user} 
                                type={type}
                            />
                        ))}
                    </div>
                </div>
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

                <div className="connections-section">
                    <div className="followers-container">
                        <div className="connections-header">
                            <h3>
                                <FaUsers className="section-icon" />
                                Followers
                            </h3>
                            <div className="connections-header-right">
                                <span>{userProfile.stats.followers}</span>
                                <button 
                                    className="see-all-button modal-button"
                                    onClick={() => setFollowersModal(true)}
                                >
                                    See all <FaChevronRight />
                                </button>
                            </div>
                        </div>
                        <div className="user-list">
                            {followers.map(user => (
                                <UserCard 
                                    key={user.id} 
                                    user={user} 
                                    type="followers"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="following-container">
                        <div className="connections-header">
                            <h3>
                                <FaUserFriends className="section-icon" />
                                Following
                            </h3>
                            <div className="connections-header-right">
                                <span>{userProfile.stats.following}</span>
                                <button 
                                    className="see-all-button modal-button"
                                    onClick={() => setFollowingModal(true)}
                                >
                                    See all <FaChevronRight />
                                </button>
                            </div>
                        </div>
                        <div className="user-list">
                            {following.map(user => (
                                <UserCard 
                                    key={user.id} 
                                    user={user} 
                                    type="following"
                                />
                            ))}
                        </div>
                    </div>

                    <ConnectionModal 
                        title="Followers"
                        users={followers}
                        isOpen={followersModal}
                        onClose={() => setFollowersModal(false)}
                        icon={FaUsers}
                        type="followers"
                    />

                    <ConnectionModal 
                        title="Following"
                        users={following}
                        isOpen={followingModal}
                        onClose={() => setFollowingModal(false)}
                        icon={FaUserFriends}
                        type="following"
                    />
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
                />
            )}
            <DeleteConfirmationModal />
            <EditCommentModal />
        </div>
    );
};

export default Profile; 