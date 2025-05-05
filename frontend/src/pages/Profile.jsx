import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Profile.css';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { FaChevronRight, FaHeart, FaEye, FaList, FaComment, FaStar, FaTrash, FaEdit, FaUsers, FaUserFriends } from 'react-icons/fa';
import MovieDetail from '../components/MovieDetail';
import MovieCard from '../components/MovieCard';
import axios from '../services/axiosConfig';

const Profile = () => {
    const { t, i18n } = useTranslation();
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
    const [movieTimeStats, setMovieTimeStats] = useState({
            months: 0,
            days: 0,
            hours: 0
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchUserProfile();
        fetchMovieTimeStats();
    }, [username]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/profile/${username || 'me'}`);
            setUserProfile(response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setError('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const fetchMovieTimeStats = async () => {
        try {
            const response = await axios.get('/api/movies/stats/movietime');
            setMovieTimeStats(response.data);
        } catch (error) {
            console.error('Error fetching movie time stats:', error);
        }
    };

    const handleFollow = async (userId) => {
        try {
            await axios.post(`/api/profile/follow/${userId}`);
            fetchUserProfile();
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    const handleUnfollow = async (userId) => {
        try {
            await axios.post(`/api/profile/unfollow/${userId}`);
            fetchUserProfile();
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    };

    const handleMovieClick = (movie) => {
        const language = i18n.language === 'tr' ? 'tr-TR' : 'en-US';
        Promise.all([
            fetch(`https://api.themoviedb.org/3/movie/${movie.tmdbId}?api_key=84e605aa45ef84282ba934b9b2648dc5&language=${language}`),
            fetch(`https://api.themoviedb.org/3/movie/${movie.tmdbId}/credits?api_key=84e605aa45ef84282ba934b9b2648dc5&language=${language}`),
            fetch(`https://api.themoviedb.org/3/movie/${movie.tmdbId}/watch/providers?api_key=84e605aa45ef84282ba934b9b2648dc5`)
        ])
        .then(([detailsRes, creditsRes, providersRes]) => 
            Promise.all([detailsRes.json(), creditsRes.json(), providersRes.json()])
        )
        .then(([detailedMovie, credits, providers]) => {
            const countryCode = i18n.language === 'tr' ? 'TR' : 'US';
            setSelectedMovie({
                ...movie,
                ...detailedMovie,
                tmdbId: movie.id || movie.tmdbId,
                overview: detailedMovie.overview,
                vote_average: detailedMovie.vote_average,
                original_title: detailedMovie.original_title,
                runtime: detailedMovie.runtime,
                cast: credits.cast?.slice(0, 5),
                providers: providers.results?.[countryCode] || {}
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

    const handleWatchlistUpdate = (movieId, isInWatchlist) => {
        setUserProfile(prevProfile => ({
            ...prevProfile,
            watchlist: isInWatchlist 
                ? [...prevProfile.watchlist]
                : prevProfile.watchlist.filter(m => m.tmdbId !== movieId),
            watched: isInWatchlist 
                ? prevProfile.watched.filter(m => m.tmdbId !== movieId)
                : prevProfile.watched
        }));
    };

    const handleWatchedToggle = async (movieId, isWatched) => {
        try {
            if (isWatched) {
                await axios.post(`/api/movies/${movieId}/watched`);
                setUserProfile(prevProfile => ({
                    ...prevProfile,
                    watched: [...prevProfile.watched, prevProfile.watchlist.find(m => m.tmdbId === movieId)],
                    watchlist: prevProfile.watchlist.filter(m => m.tmdbId !== movieId)
                }));
            } else {
                await axios.delete(`/api/movies/${movieId}/watched`);
                setUserProfile(prevProfile => ({
                    ...prevProfile,
                    watched: prevProfile.watched.filter(m => m.tmdbId !== movieId),
                    watchlist: [...prevProfile.watchlist, prevProfile.watched.find(m => m.tmdbId === movieId)]
                }));
            }
        } catch (error) {
            console.error("An error occurred while updating the viewing status:", error);
        }
    };

    const handleFavoriteToggle = async (movieId, isFavorite) => {
        try {
            if (isFavorite) {
                await axios.post(`/api/movies/${movieId}/favorites`);
                setUserProfile(prevProfile => ({
                    ...prevProfile,
                    favorites: [...prevProfile.favorites, prevProfile.watchlist.find(m => m.tmdbId === movieId)]
                }));
            } else {
                await axios.delete(`/api/movies/${movieId}/favorites`);
                setUserProfile(prevProfile => ({
                    ...prevProfile,
                    favorites: prevProfile.favorites.filter(m => m.tmdbId !== movieId)
                }));
            }
        } catch (error) {
            console.error("An error occurred while updating the favorite status:", error);
        }
    };

    const getAvatarUrl = (avatarPath) => {
        if (!avatarPath) return '';
        return avatarPath; // Return the Azure Blob Storage URL directly
    };

    const MovieSection = ({ title, movies, icon: Icon }) => {
        // Güvenli bir şekilde çeviri anahtarını oluştur
        const translationKey = title.toLowerCase().replace(/\s+/g, '');
        
        const [modalMovies, setModalMovies] = useState({
            isOpen: false,
            movies: [],
            title: '',
            icon: null
        });

        // İzlenen filmleri watchlist'ten filtrele
        const filteredMovies = title === "Watchlist" 
            ? movies.filter(movie => !userProfile.watched.some(w => w.tmdbId === movie.tmdbId))
            : movies;

        const formatMovie = (movie) => ({
            ...movie,
            poster_path: movie.posterPath,
            release_date: movie.releaseDate,
            vote_average: movie.voteAverage,
            overview: movie.overview,
            id: movie.tmdbId
        });

        return (
            <div className="movies-section">
                <div className="section-header">
                    <h2>
                        <Icon className="section-icon" />
                        {t(`profile.movieSections.${translationKey}`)}
                    </h2>
                    {movies.length > 3 && (
                        <button className="see-all-button" onClick={() => setModalMovies({ 
                            isOpen: true, 
                            movies, 
                            title: t(`profile.movieSections.${translationKey}`), 
                            icon: Icon 
                        })}>
                            {t('profile.seeAll')} <FaChevronRight />
                        </button>
                    )}
                </div>
                
                <div className="movies-grid">
                    {filteredMovies.slice(0, 5).map(movie => (
                        <MovieCard
                            key={movie.id}
                            movie={formatMovie(movie)}
                            onClick={() => handleMovieClick(movie)}
                            isGridView={true}
                            isWatchlist={title === "Watchlist"}
                            isWatched={userProfile.watched.some(w => w.tmdbId === movie.tmdbId)}
                            onWatchedToggle={handleWatchedToggle}
                            isFavorite={userProfile.favorites.some(f => f.tmdbId === movie.tmdbId)}
                            onFavoriteToggle={handleFavoriteToggle}
                        />
                    ))}
                </div>

                <MovieModal
                    movies={modalMovies.movies}
                    title={modalMovies.title}
                    isOpen={modalMovies.isOpen}
                    onClose={() => setModalMovies({ ...modalMovies, isOpen: false })}
                    icon={modalMovies.icon}
                />
            </div>
        );
    };

    const MovieModal = ({ movies, title, isOpen, onClose, icon: Icon }) => {
        const [isActive, setIsActive] = useState(false);

        const formatMovie = (movie) => ({
            ...movie,
            poster_path: movie.posterPath,
            release_date: movie.releaseDate,
            vote_average: movie.voteAverage,
            overview: movie.overview,
            id: movie.tmdbId
        });

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
                            <MovieCard
                                key={movie.id}
                                movie={formatMovie(movie)}
                                onClick={() => handleMovieClick(movie)}
                                isGridView={true}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => (
        <div className={`modal ${isOpen ? 'open' : ''}`}>
            <div className="modal-content delete-modal">
                <h2>{t('profile.modals.deleteTitle')}</h2>
                <p>{t('profile.modals.deleteConfirm')}</p>
                <div className="modal-actions">
                    <button onClick={onClose} className="cancel-button">
                        {t('profile.modals.cancel')}
                    </button>
                    <button onClick={onConfirm} className="delete-button">
                        {t('profile.modals.delete')}
                    </button>
                </div>
            </div>
        </div>
    );

    const EditCommentModal = ({ isOpen, comment, onClose, onSave }) => {
        const [commentText, setCommentText] = useState('');
        const [rating, setRating] = useState(5);
        const [isSpoiler, setIsSpoiler] = useState(false);

        useEffect(() => {
            if (comment) {
                setCommentText(comment.comment || '');
                setRating(comment.rating || 5);
                setIsSpoiler(comment.isSpoiler || false);
            }
        }, [comment]);

        const handleSubmit = (e) => {
            e.preventDefault();
            onSave(comment.id, commentText, rating, isSpoiler);
        };

        return (
            <div className={`modal ${isOpen ? 'open' : ''}`}>
                <div className="modal-content edit-modal">
                    <h2>{t('profile.modals.editTitle')}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>{t('profile.modals.editComment')}</label>
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>{t('profile.modals.editRating')}</label>
                            <div className="star-rating">
                                {[...Array(10)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        className={i < rating ? 'star active' : 'star'}
                                        onClick={() => setRating(i + 1)}
                                    />
                                ))}
                                <span>{rating}/10</span>
                            </div>
                        </div>
                        
                        <div className="modal-actions">
                            <button type="button" onClick={onClose} className="cancel-button">
                                {t('profile.modals.cancel')}
                            </button>
                            <button type="submit" className="save-button">
                                {t('profile.modals.save')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const CommentCard = ({ comment, onEdit, onDelete }) => (
        <div className="comment-card">
            <div className="comment-header">
                <div className="movie-info">
                    <img 
                        src={`https://image.tmdb.org/t/p/w92${comment.movie.posterPath}`}
                        alt={comment.movie.title}
                        className="movie-thumbnail"
                    />
                    <div className="movie-details">
                        <h4>{comment.movie.title}</h4>
                        <div className="comment-rating">
                            <span className="rating-value">{comment.rating}/10</span>
                            <div className="star-container">
                                {[...Array(10)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        className={i < comment.rating ? 'star active' : 'star'}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="comment-actions">
                    {comment.isSpoiler && <span className="spoiler-tag">{t('profile.commentsSection.spoiler')}</span>}
                    <button onClick={() => onEdit(comment)} className="action-button edit">
                        <FaEdit />
                    </button>
                    <button onClick={() => onDelete(comment.id)} className="action-button delete">
                        <FaTrash />
                    </button>
                </div>
            </div>
            <div className="comment-body">
                <p>{comment.comment}</p>
                <span className="comment-date">{new Date(comment.date).toLocaleDateString()}</span>
            </div>
        </div>
    );

    const UserCard = ({ user, type, onFollow, onUnfollow }) => {
        // Kullanıcının takip edilip edilmediğini kontrol et
        const isAlreadyFollowing = type === 'following' || user.isFollowing || 
            (userProfile && userProfile.following && 
             userProfile.following.some(followedUser => followedUser.id === user.id));

        return (
            <div 
                className="user-card"
                onClick={() => navigate(`/user/${user.username}`)}
            >
                <div className="user-avatar">
                    {user.avatar ? (
                        <img 
                            src={getAvatarUrl(user.avatar)} 
                            alt={user.username}
                            className="user-avatar-image"
                        />
                    ) : (
                        <span>{user.username.substring(0, 2).toUpperCase()}</span>
                    )}
                </div>
                <div className="user-info">
                    <h4>{user.username}</h4>
                    <p>{user.movieCount} films</p>
                </div>
                {(type === 'following' || (!isAlreadyFollowing && type === 'followers')) && (
                    <button 
                        className={`follow-button ${isAlreadyFollowing ? 'following' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            isAlreadyFollowing ? onUnfollow(user.id) : onFollow(user.id);
                        }}
                    >
                        {isAlreadyFollowing ? 'Following' : 'Follow'}
                    </button>
                )}
            </div>
        );
    };

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
                    {userProfile.avatar ? (
                        <img 
                            src={getAvatarUrl(userProfile.avatar)} 
                            alt={userProfile.username}
                            className="profile-avatar-image"
                        />
                    ) : (
                        <span>{userProfile.username.substring(0, 2).toUpperCase()}</span>
                    )}
                </div>
                <h1 className="profile-username">{userProfile.username}</h1>
                {!username && (
                    <Link to="/profile/edit" className="edit-button">
                        {t('profile.edit')}
                    </Link>
                )}
                <div className="profile-stats">
                    <div className="stat-item">
                        <div className="stat-value">{userProfile.stats.following}</div>
                        <div className="stat-label">{t('profile.following')}</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{userProfile.stats.followers}</div>
                        <div className="stat-label">{t('profile.follower')}</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{userProfile.stats.comments}</div>
                        <div className="stat-label">{t('profile.comments')}</div>
                    </div>
                </div>
            </div>

            <div className="profile-content">
                <div className="stats-section">
                    <h2>{t('profile.stats')}</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h4>{t('profile.movieTime')}</h4>
                            <div className="time-stats">
                                <div className="time-stat">
                                    <span>{movieTimeStats.months}</span>
                                    <label>{t('profile.months')}</label>
                                </div>
                                <div className="time-stat">
                                    <span>{movieTimeStats.days}</span>
                                    <label>{t('profile.days')}</label>
                                </div>
                                <div className="time-stat">
                                    <span>{movieTimeStats.hours}</span>
                                    <label>{t('profile.hours')}</label>
                                </div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <h4>{t('profile.moviesWatched')}</h4>
                            <div className="single-stat">{userProfile.stats.moviesWatched}</div>
                        </div>
                    </div>
                </div>

                <div className="connections-section">
                    <div className="followers-container">
                        <div className="connections-header">
                            <h3>
                                <FaUsers className="section-icon" />
                                {t('profile.followers')}
                            </h3>
                            <div className="connections-header-right">
                                <span>{userProfile.stats.followers}</span>
                                <button 
                                    className="see-all-button modal-button"
                                    onClick={() => setFollowersModal(true)}
                                >
                                    {t('profile.seeAll')} <FaChevronRight />
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
                                {t('profile.following')}
                            </h3>
                            <div className="connections-header-right">
                                <span>{userProfile.stats.following}</span>
                                <button 
                                    className="see-all-button modal-button"
                                    onClick={() => setFollowingModal(true)}
                                >
                                    {t('profile.seeAll')} <FaChevronRight />
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
                        title={t('profile.followers')}
                        users={userProfile.followers}
                        isOpen={followersModal}
                        onClose={() => setFollowersModal(false)}
                        icon={FaUsers}
                        type="followers"
                        onFollow={handleFollow}
                        onUnfollow={handleUnfollow}
                    />

                    <ConnectionModal 
                        title={t('profile.following')}
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
                            {t('profile.commentsSection.title')}
                        </h2>
                        {userProfile.comments.length > 3 && (
                            <button 
                                className="see-all-button" 
                                onClick={() => setShowAllComments(!showAllComments)}
                            >
                                {showAllComments ? t('profile.showLess') : t('profile.seeAll')} 
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
                                <p>{t('profile.commentsSection.noComments')}</p>
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