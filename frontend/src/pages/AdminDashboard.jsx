import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import { FaStar, FaTrash, FaChevronRight, FaUsers } from 'react-icons/fa';

const AdminDashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin'); // örnek kontrol
        
        if (!isAdmin) {
            navigate('/login');
            alert('You do not have acces to this page!');
        }
    }, [navigate]);

    const stats = {
        totalUsers: 1250,
        dailyVisitors: 456,
        totalMovies: 2800,
        totalReviews: 4500
    };

    const topMovies = [
        { 
            title: "Inception", 
            favorites: 1200,
            poster: "/inception.jpg",
            rating: 4.8,
            image: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg"
        },
        { 
            title: "The Dark Knight", 
            favorites: 1150,
            poster: "/dark-knight.jpg",
            rating: 4.9,
            image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
        },
        { 
            title: "Pulp Fiction", 
            favorites: 980,
            poster: "/pulp-fiction.jpg",
            rating: 4.7,
            image: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg"
        },
        { 
            title: "Fight Club", 
            favorites: 950,
            poster: "/fight-club.jpg",
            rating: 4.8,
            image: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg"
        }
    ];

    const recentComments = [
        { user: "USER1", movie: "Inception", comment: "Wonderful movie!", date: "2024-03-20" },
        { user: "USER2", movie: "The Matrix", comment: "CLASSIC!", date: "2024-03-19" }
    ];

    // Yeni state'ler ekleyelim
    const [showAllComments, setShowAllComments] = useState(false);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        commentId: null
    });
    const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);

    // Örnek yorum verileri (gerçek uygulamada API'den gelecek)
    const [userComments, setUserComments] = useState([
        {
            id: 1,
            userId: "user123",
            username: "MovieLover",
            movieId: 27205,
            movieTitle: "Inception",
            moviePoster: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
            comment: "What a fantastic movie! One of Nolan's best.", 
            rating: 4.5,
            date: "2024-03-15"
        },
        {
            id: 2,
            userId: "user456",
            username: "CinemaFan",
            movieId: 155,
            movieTitle: "The Dark Knight",
            moviePoster: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
            comment: "Heath Ledger's performance as the Joker is unforgettable.",
            rating: 5,
            date: "2024-03-10"
        },
        // Daha fazla yorum eklenebilir
    ]);

    // Users state'ini güncelleyelim
    const [users, setUsers] = useState([
        {
            id: 1,
            username: "Emircan Çapkan",
            movieCount: 150,
            commentCount: 45,
            joinDate: "2024-01-15",
            isBanned: false,
            banReason: null
        },
        {
            id: 2,
            username: "Yiğit Bıçkıcı",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CinemaFan",
            movieCount: 89,
            commentCount: 23,
            joinDate: "2024-02-20"
        },
        {
            id: 3,
            username: "Elif Gülüm",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=FilmBuff",
            movieCount: 234,
            commentCount: 78,
            joinDate: "2023-12-10"
        },
        {
            id: 4,
            username: "Muhammed Emir Gündoğdu",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=FilmBuff",
            movieCount: 234,
            commentCount: 25,
            joinDate: "2025-03-08"
        }
    ]);

    const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
    const [isMoviesModalOpen, setIsMoviesModalOpen] = useState(false);

    // Ban modalı için state
    const [banModal, setBanModal] = useState({
        isOpen: false,
        userId: null,
        isBanned: false
    });

    // Ban sebepleri
    const banReasons = [
        "Unsuitable content sharing",
        "Spam/Advertising",
        "Hate speech/Insult",
        "Fake account",
        "Other"
    ];

    // Ban işlemi için fonksiyon
    const handleBanUser = (userId, reason) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId
                    ? { ...user, isBanned: true, banReason: reason }
                    : user
            )
        );
        setBanModal({ isOpen: false, userId: null, isBanned: false });
    };

    // Unban işlemi için fonksiyon
    const handleUnbanUser = (userId) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId
                    ? { ...user, isBanned: false, banReason: null }
                    : user
            )
        );
    };

    // Yorum silme işlemi
    const handleDeleteComment = async (commentId) => {
        try {
            // API çağrısı yapılacak
            // const response = await fetch(`/api/admin/comments/${commentId}`, {
            //     method: 'DELETE'
            // });
            
            setUserComments(prevComments => 
                prevComments.filter(comment => comment.id !== commentId)
            );
            setDeleteModal({ isOpen: false, commentId: null });
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    // Yorum kartı komponenti
    const CommentCard = ({ comment }) => (
        <div className="comment-card">
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
            <div className="comment-user-info">
                <span className="comment-username">{comment.username}</span>
            </div>
            <p className="comment-text">{comment.comment}</p>
            <div className="comment-footer">
                <span className="comment-date">
                    {new Date(comment.date).toLocaleDateString()}
                </span>
                <button 
                    className="delete-comment-button"
                    onClick={() => setDeleteModal({ isOpen: true, commentId: comment.id })}
                >
                    <FaTrash />
                </button>
            </div>
        </div>
    );

    // Silme onay modalı
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

    // Yorum modalı komponenti
    const CommentsModal = () => (
        <div className={`comments-modal-overlay ${isCommentsModalOpen ? 'active' : ''}`}>
            <div className="comments-modal-content">
                <div className="modal-header">
                    <h2>Last User Comments</h2>
                    <button 
                        className="modal-close-button"
                        onClick={() => setIsCommentsModalOpen(false)}
                    >
                        ×
                    </button>
                </div>
                <div className="modal-comments-container">
                    <div className="comments-grid">
                        {userComments.map(comment => (
                            <CommentCard key={comment.id} comment={comment} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    // Users Modal komponenti
    const UsersModal = () => (
        <div className={`users-modal-overlay ${isUsersModalOpen ? 'active' : ''}`}>
            <div className="users-modal-content">
                <div className="modal-header">
                    <h2>All Users</h2>
                    <button 
                        className="modal-close-button"
                        onClick={() => setIsUsersModalOpen(false)}
                    >
                        ×
                    </button>
                </div>
                <div className="modal-users-container">
                    <div className="users-grid">
                        {users.map(user => (
                            <UserCard key={user.id} user={user} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    // İsim kısaltması oluşturan fonksiyon
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2); // Sadece ilk iki harfi al
    };

    // User Card komponentini güncelleyelim
    const UserCard = ({ user }) => (
        <div className="user-card">
            <div className="user-info-section" onClick={() => navigate(`/user/${user.username}`)}>
                <div className="user-avatar">
                    {getInitials(user.username)}
                </div>
                <div className="user-info">
                    <h4>{user.username}</h4>
                    <div className="user-stats">
                        <span>{user.movieCount} films</span>
                    </div>
                    {user.isBanned && (
                        <div className="ban-reason">
                            Reason: {user.banReason}
                        </div>
                    )}
                </div>
            </div>
            <div className="user-actions">
                {user.isBanned ? (
                    <button 
                        className="unban-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleUnbanUser(user.id);
                        }}
                    >
                        Unban
                    </button>
                ) : (
                    <button 
                        className="ban-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setBanModal({ isOpen: true, userId: user.id });
                        }}
                    >
                        Ban
                    </button>
                )}
            </div>
        </div>
    );

    // MoviesModal komponentini ekleyelim
    const MoviesModal = () => (
        <div className={`movies-modal-overlay ${isMoviesModalOpen ? 'active' : ''}`}>
            <div className="movies-modal-content">
                <div className="modal-header">
                    <h2>Top Favorited Movies</h2>
                    <button 
                        className="modal-close-button"
                        onClick={() => setIsMoviesModalOpen(false)}
                    >
                        ×
                    </button>
                </div>
                <div className="modal-movies-container">
                    <div className="movies-grid">
                        {topMovies.map((movie, index) => (
                            <div key={index} className="movie-list-item">
                                <div className="movie-list-info">
                                    <img 
                                        src={movie.image} 
                                        alt={movie.title}
                                        className="movie-list-poster"
                                    />
                                    <div className="movie-list-details">
                                        <h4>{movie.title}</h4>
                                        <div className="movie-list-rating">
                                            <FaStar className="star-icon" />
                                            <span>{movie.rating}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="movie-list-favorites">
                                    <span>{movie.favorites} favourite</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    // Ban Modal komponenti
    const BanModal = () => {
        const [selectedReason, setSelectedReason] = useState('');
        const [customReason, setCustomReason] = useState('');

        return (
            <div className={`ban-modal-overlay ${banModal.isOpen ? 'active' : ''}`}>
                <div className="ban-modal-content">
                    <h3>Ban User</h3>
                    <div className="ban-form">
                        <select 
                            value={selectedReason}
                            onChange={(e) => setSelectedReason(e.target.value)}
                            className="ban-reason-select"
                        >
                            <option value="">Ban reason</option>
                            {banReasons.map((reason, index) => (
                                <option key={index} value={reason}>{reason}</option>
                            ))}
                        </select>
                        
                        {selectedReason === "Other" && (
                            <textarea
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                placeholder="Write the reason for the ban..."
                                className="custom-reason-input"
                            />
                        )}
                    </div>
                    <div className="ban-modal-buttons">
                        <button 
                            className="ban-modal-button cancel"
                            onClick={() => setBanModal({ isOpen: false, userId: null })}
                        >
                            Cancel
                        </button>
                        <button 
                            className="ban-modal-button confirm"
                            onClick={() => handleBanUser(banModal.userId, 
                                selectedReason === "Other" ? customReason : selectedReason)}
                            disabled={!selectedReason}
                        >
                            Ban
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            
            <div className="stats-container">
                <div className="stat-card">
                    <i className="fas fa-users"></i>
                    <h3>Total User</h3>
                    <p>{stats.totalUsers}</p>
                </div>
                <div className="stat-card">
                    <i className="fas fa-eye"></i>
                    <h3>Daily Visitors</h3>
                    <p>{stats.dailyVisitors}</p>
                </div>
                <div className="stat-card">
                    <i className="fas fa-film"></i>
                    <h3>Total Movies</h3>
                    <p>{stats.totalMovies}</p>
                </div>
                <div className="stat-card">
                    <i className="fas fa-comments"></i>
                    <h3>Total Reviews</h3>
                    <p>{stats.totalReviews}</p>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <div className="section-header">
                        <h2>Top Favorited Movies</h2>
                        <button 
                            className="see-all-button"
                            onClick={() => setIsMoviesModalOpen(true)}
                        >
                            See All <FaChevronRight />
                        </button>
                    </div>
                    <div className="top-movies-list">
                        {topMovies.map((movie, index) => (
                            <div key={index} className="movie-list-item">
                                <div className="movie-list-info">
                                    <img 
                                        src={movie.image} 
                                        alt={movie.title}
                                        className="movie-list-poster"
                                    />
                                    <div className="movie-list-details">
                                        <h4>{movie.title}</h4>
                                        <div className="movie-list-rating">
                                            <FaStar className="star-icon" />
                                            <span>{movie.rating}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="movie-list-favorites">
                                    <span>{movie.favorites} favourite</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="section-header">
                            <h2>Last User Comments</h2>
                        <button 
                            className="see-all-button" 
                            onClick={() => setIsCommentsModalOpen(true)}
                        >
                            See All <FaChevronRight />
                        </button>
                    </div>
                    
                    <div className="comments-container">
                        {userComments.length > 0 ? (
                            <div className="comments-grid">
                                {userComments.slice(0, 3).map(comment => (
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

                <div className="dashboard-card users-section">
                    <div className="section-header">
                        <h2>
                            <FaUsers className="section-icon" />
                            Users
                        </h2>
                        <button 
                            className="see-all-button"
                            onClick={() => setIsUsersModalOpen(true)}
                        >
                            See All <FaChevronRight />
                        </button>
                    </div>
                    <div className="users-list">
                        {users.slice(0, 3).map(user => (
                            <UserCard key={user.id} user={user} />
                        ))}
                    </div>
                </div>
            </div>
            <DeleteConfirmationModal />
            <CommentsModal />
            <MoviesModal />
            <UsersModal />
            <BanModal />
        </div>
    );
};

export default AdminDashboard; 