import React, { useState, useEffect } from 'react';
import './Profile.css';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { FaChevronRight, FaHeart, FaEye, FaList, FaComment, FaStar, FaTrash, FaEdit, FaUsers, FaUserFriends } from 'react-icons/fa';
import MovieDetail from '../components/MovieDetail';
import axios from 'axios';

const Profile = () => {
    const { username } = useParams();
    const [userProfile, setUserProfile] = useState(null);
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
    const [followersModal, setFollowersModal] = useState(false);
    const [followingModal, setFollowingModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchUserProfile();
    }, [username]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:8080/api/profile/${username || 'me'}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setUserProfile(response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setError('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `http://localhost:8080/api/profile/follow/${userId}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            fetchUserProfile(); // Profili yenile
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    const handleUnfollow = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `http://localhost:8080/api/profile/unfollow/${userId}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            fetchUserProfile(); // Profili yenile
        } catch (error) {
            console.error('Error unfollowing user:', error);
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

        return (
            <div className="movies-section">
                <div className="section-header">
                    <h2>
                        <Icon className="section-icon" />
                        {title}
                    </h2>
                    <div className="section-buttons">
                        <button 
                            className="see-all-button modal-button" 
                            onClick={() => setIsModalOpen(true)}
                        >
                            See all <FaChevronRight />
                        </button>
                    </div>
                </div>
                
                <div className="movies-grid">
                    {movies.slice(0, 5).map(movie => (
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

    const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => (
        <div className={`delete-modal-overlay ${isOpen ? 'active' : ''}`}>
            <div className="delete-modal-content">
                <h3>Delete Comment</h3>
                <p>Are you sure you want to delete this comment?</p>
                <div className="delete-modal-buttons">
                    <button 
                        className="delete-modal-button cancel"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button 
                        className="delete-modal-button confirm"
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );

    const EditCommentModal = ({ isOpen, comment, onClose, onSave }) => {
        const [editedComment, setEditedComment] = useState(comment?.comment || '');
        const [editedRating, setEditedRating] = useState(comment?.rating || 5);
        const [hoveredRating, setHoveredRating] = useState(0);

        useEffect(() => {
            if (comment) {
                setEditedComment(comment.comment);
                setEditedRating(comment.rating);
            }
        }, [comment]);

        return (
            <div className={`edit-modal-overlay ${isOpen ? 'active' : ''}`}>
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
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button 
                            className="edit-modal-button confirm"
                            onClick={() => onSave(comment.id, editedComment, editedRating)}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const CommentCard = ({ comment, onEdit, onDelete }) => (
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
                            onEdit(comment);
                        }}
                    >
                        <FaEdit />
                    </button>
                    <button 
                        className="delete-comment-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(comment.id);
                        }}
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>
        </div>
    );

    const UserCard = ({ user, type, onFollow, onUnfollow }) => (
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
                    type === 'following' ? onUnfollow(user.id) : onFollow(user.id);
                }}
            >
                {type === 'following' || user.isFollowing ? 'Following' : 'Follow'}
            </button>
        </div>
    );

    const ConnectionModal = ({ title, users, isOpen, onClose, icon: Icon, type, onFollow, onUnfollow }) => {
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
                                onFollow={onFollow}
                                onUnfollow={onUnfollow}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!userProfile) {
        return <div className="error">Profile not found</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-avatar">
                    <span>{userProfile.avatar}</span>
                </div>
                <h1 className="profile-username">{userProfile.username}</h1>
                {!username && (
                    <Link to="/profile/edit" className="edit-button">
                        EDIT
                    </Link>
                )}
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
                            {userProfile.followers.map(user => (
                                <UserCard 
                                    key={user.id} 
                                    user={user} 
                                    type="followers"
                                    onFollow={handleFollow}
                                    onUnfollow={handleUnfollow}
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
                            {userProfile.following.map(user => (
                                <UserCard 
                                    key={user.id} 
                                    user={user} 
                                    type="following"
                                    onFollow={handleFollow}
                                    onUnfollow={handleUnfollow}
                                />
                            ))}
                        </div>
                    </div>

                    <ConnectionModal 
                        title="Followers"
                        users={userProfile.followers}
                        isOpen={followersModal}
                        onClose={() => setFollowersModal(false)}
                        icon={FaUsers}
                        type="followers"
                        onFollow={handleFollow}
                        onUnfollow={handleUnfollow}
                    />

                    <ConnectionModal 
                        title="Following"
                        users={userProfile.following}
                        isOpen={followingModal}
                        onClose={() => setFollowingModal(false)}
                        icon={FaUserFriends}
                        type="following"
                        onFollow={handleFollow}
                        onUnfollow={handleUnfollow}
                    />
                </div>

                <MovieSection 
                    title="Favorites"
                    movies={userProfile.favorites}
                    icon={FaHeart}
                />

                <MovieSection 
                    title="Watched Movies"
                    movies={userProfile.watched}
                    icon={FaEye}
                />

                <MovieSection 
                    title="Watchlist"
                    movies={userProfile.watchlist}
                    icon={FaList}
                />

                <div className="comments-section">
                    <div className="section-header">
                        <h2>
                            <FaComment className="section-icon" />
                            Comments
                        </h2>
                        {userProfile.comments.length > 3 && (
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
                        {userProfile.comments.length > 0 ? (
                            <div className="comments-grid">
                                {(showAllComments ? userProfile.comments : userProfile.comments.slice(0, 3)).map(comment => (
                                    <CommentCard 
                                        key={comment.id} 
                                        comment={comment}
                                        onEdit={(editedComment) => setEditModal({ isOpen: true, comment: editedComment })}
                                        onDelete={(commentId) => setDeleteModal({ isOpen: true, commentId })}
                                    />
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
            <DeleteConfirmationModal 
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, commentId: null })}
                onConfirm={() => handleDeleteComment(deleteModal.commentId)}
            />
            <EditCommentModal 
                isOpen={editModal.isOpen}
                comment={editModal.comment}
                onClose={() => setEditModal({ isOpen: false, comment: null })}
                onSave={handleEditComment}
            />
        </div>
    );
};

export default Profile; 