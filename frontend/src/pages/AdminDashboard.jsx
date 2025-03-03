import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Burada normalde API'den admin kontrolü yapılır
        const isAdmin = localStorage.getItem('isAdmin'); // örnek kontrol
        
        if (!isAdmin) {
            navigate('/login');
            alert('Bu sayfaya erişim yetkiniz yok!');
        }
    }, [navigate]);

    // Örnek veriler (gerçek uygulamada API'den gelecek)
    const stats = {
        totalUsers: 1250,
        dailyVisitors: 456,
        totalMovies: 2800,
        totalReviews: 4500
    };

    const topMovies = [
        { title: "Inception", favorites: 1200 },
        { title: "The Dark Knight", favorites: 1150 },
        { title: "Pulp Fiction", favorites: 980 },
        { title: "Fight Club", favorites: 950 }
    ];

    const recentComments = [
        { user: "John Doe", movie: "Inception", comment: "Harika bir film!", date: "2024-03-20" },
        { user: "Jane Smith", movie: "The Matrix", comment: "Klasik!", date: "2024-03-19" }
    ];

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            
            <div className="stats-container">
                <div className="stat-card">
                    <i className="fas fa-users"></i>
                    <h3>Toplam Kullanıcı</h3>
                    <p>{stats.totalUsers}</p>
                </div>
                <div className="stat-card">
                    <i className="fas fa-eye"></i>
                    <h3>Günlük Ziyaretçi</h3>
                    <p>{stats.dailyVisitors}</p>
                </div>
                <div className="stat-card">
                    <i className="fas fa-film"></i>
                    <h3>Toplam Film</h3>
                    <p>{stats.totalMovies}</p>
                </div>
                <div className="stat-card">
                    <i className="fas fa-comments"></i>
                    <h3>Toplam Yorum</h3>
                    <p>{stats.totalReviews}</p>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h2>En Çok Favorilenen Filmler</h2>
                    <ul className="top-movies-list">
                        {topMovies.map((movie, index) => (
                            <li key={index}>
                                <span>{movie.title}</span>
                                <span>{movie.favorites} favori</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="dashboard-card">
                    <h2>Son Yorumlar</h2>
                    <div className="recent-comments">
                        {recentComments.map((comment, index) => (
                            <div key={index} className="comment-card">
                                <div className="comment-header">
                                    <span className="comment-user">{comment.user}</span>
                                    <span className="comment-date">{comment.date}</span>
                                </div>
                                <p className="comment-movie">Film: {comment.movie}</p>
                                <p className="comment-text">{comment.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard; 